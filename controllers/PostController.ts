import { Request, Response } from "express";
import Post from "../models/Post";
import PostAntigo from "../models/PostAntigo";
import { remove } from "remove-accents";
import axios from "axios";
import { Client } from "basic-ftp";
import sharp from "sharp";
import { Op } from "sequelize";

export const createPost = async (req: Request, res: Response) => {
	try {
		const { titulo, conteudo, destaque, tipo } = req.body;

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
			tipo,
			conteudo,
			destaque,
			imagem: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null,
		});

		res.status(201).json(newPost);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const getPostById = async (req: Request, res: Response) => {
	try {
		const postId = Number(req.params.id);

		// Use o Sequelize para buscar a postagem pelo ID
		const post = await Post.findByPk(postId);

		if (!post) {
			res.status(404).json({ error: "Postagem não encontrada" });
			return;
		}

		// URL direta da imagem
		const remoteFileUrl = `https://dev.ibtec.org.br/dev/blog/${post.imagem}`;

		// Baixar a imagem diretamente da URL
		const response = await axios.get(remoteFileUrl, { responseType: "arraybuffer" });

		// Converter o ArrayBuffer para Buffer usando Buffer.from
		const imageBuffer = Buffer.from(response.data as ArrayBuffer);

		// Converter a imagem para buffer usando sharp
		const originalImageBuffer = await sharp(imageBuffer).toBuffer();

		res.json({
			...post.toJSON(),
			originalImageBuffer,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const editPost = async (req: Request, res: Response) => {
	try {
		const postId = Number(req.params.id);
		const post = await Post.findByPk(postId);

		if (!post) {
			return res.status(404).json({ error: "Postagem não encontrada" });
		}

		const { titulo, conteudo, destaque, tipo } = req.body;
		const slug = remove(titulo).toLowerCase().replace(/\s+/g, "-");

		// Compare os valores existentes com os novos
		if (
			titulo === post.titulo &&
			tipo === post.tipo &&
			slug === post.slug &&
			conteudo === post.conteudo &&
			destaque === post.destaque &&
			!req.file // Se não houver nova imagem
		) {
			// Se nada foi alterado, envie uma resposta indicando que nenhum dado foi modificado
			return res.status(200).json({ message: "Nenhum dado foi modificado." });
		}

		// Atualize os campos relevantes da postagem
		post.titulo = titulo;
		post.tipo = tipo;
		post.slug = slug;
		post.conteudo = conteudo;
		post.destaque = destaque;

		// Se uma nova imagem for fornecida, faça o processamento da imagem
		if (req.file) {
			const imagePath = req.file.path;
			const webpPath = imagePath.replace(/\.[^.]+$/, ".webp");

			await sharp(imagePath).webp({ quality: 90 }).toFile(webpPath);

			const client = new Client();
			await client.access({
				host: "ftp.ibtec.org.br",
				user: "dev@dev.ibtec.org.br",
				password: "Dev04121996",
			});

			await client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));

			await client.close();

			post.imagem = req.file.filename.replace(/\.[^.]+$/, ".webp");

			// Limpeza de arquivos temporários
			// Remova essas linhas para evitar erros de arquivo não encontrado
			// fs.unlinkSync(imagePath);
			// fs.unlinkSync(webpPath);
		}

		// Salve as alterações no banco de dados
		await post.save();

		return res.json(post);
	} catch (error) {
		console.error(error);

		// Tratamento de erro adequado
		return res.status(500).json({ error: "Erro interno do servidor" });
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

export const getPostsAntigos = async (req: Request, res: Response) => {
	try {
		const limit = req.query.limit as string | undefined;
		const parsedLimit = limit ? parseInt(limit, 10) : undefined; // Mantenha como undefined se não houver limite

		const posts = await PostAntigo.findAll({
			limit: typeof parsedLimit === "number" ? parsedLimit : undefined,
			order: [["id", "DESC"]],
			where: {
				created_at: {
					[Op.between]: [new Date("2023-01-01"), new Date("2023-12-31 23:59:59.999")],
				},
			},
		});

		res.json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const getPostsDestaques = async (req: Request, res: Response) => {
	try {
		const posts = await Post.findAll({
			where: {
				destaque: 1, // Filtra os posts que têm destaque igual a 1
			},
			limit: 2,
			order: [["id", "DESC"]],
		});

		res.json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};
