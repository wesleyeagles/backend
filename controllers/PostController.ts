import { Request, Response } from "express";
import Post from "../models/Post";
import { remove } from "remove-accents";
import { Client } from "basic-ftp";
import sharp from "sharp";

export const createPost = async (req: Request, res: Response) => {
	try {
		const { titulo, conteudo } = req.body;

		if (typeof titulo !== "string") {
			return res.status(400).json({ error: "O título deve ser uma string válida." });
		}

		// Verifique se já existe um post com o mesmo título no banco de dados
		const existingPost = await Post.findOne({ where: { titulo } });

		if (existingPost) {
			return res.status(400).json({ error: "Já existe um post com o mesmo título." });
		}

		// Gere o "slug" automaticamente com base no título
		const slug = remove(titulo).toLowerCase().replace(/\s+/g, "-");

		console.log(req.file);

		// Realize a conversão para WebP antes da transferência FTP
		if (req.file) {
			const imagePath = req.file.path; // Caminho da imagem original
			const webpPath = imagePath.replace(/\.[^.]+$/, ".webp"); // Caminho da imagem WebP

			await sharp(imagePath)
				.webp({ quality: 90 }) // Defina a qualidade desejada
				.toFile(webpPath);

			// Agora, faça a transferência FTP da imagem WebP para o cPanel
			const client = new Client();
			await client.access({
				host: "ftp.ibtec.org.br",
				user: "dev@dev.ibtec.org.br",
				password: "Dev04121996",
			});

			// Substitua '/blog/' pelo caminho correto no seu cPanel
			await client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));

			await client.close();
		}

		// Crie um novo post no banco de dados com o nome da imagem no formato WebP
		const newPost = await Post.create({
			titulo,
			slug,
			conteudo,
			imagem: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null,
		});

		res.status(201).json(newPost);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
	try {
		const postId = Number(req.params.id); // Obtenha o ID da notícia a ser excluída dos parâmetros da URL

		// Use o Sequelize para buscar a notícia pelo ID e excluí-la
		const post = await Post.findByPk(postId);

		if (!post) {
			res.status(404).json({ error: "Notícia não encontrada" });
			return;
		}

		await post.destroy(); // Exclua a notícia

		res.status(204).end(); // Responda com um status 204 (No Content) para indicar sucesso na exclusão
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const getPosts = async (req: Request, res: Response) => {
	try {
		const limit = req.query.limit as string | undefined;
		const parsedLimit = limit ? parseInt(limit, 10) : undefined; // Mantenha como undefined se não houver limite

		const posts = await Post.findAll({
			limit: typeof parsedLimit === "number" ? parsedLimit : undefined,
			order: [["id", "DESC"]],
		});

		res.json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};
