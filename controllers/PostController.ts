import { Request, Response } from "express";
import Post from "../models/Post";
import { remove } from "remove-accents";

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

		// Crie um novo post no banco de dados
		const newPost = await Post.create({
			titulo,
			slug,
			conteudo,
			imagem: req.file ? req.file.filename : null,
		});

		res.status(201).json(newPost);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const getPosts = async (req: Request, res: Response) => {
	try {
		const limit = req.query.limit as string | undefined;
		const parsedLimit = limit ? parseInt(limit, 10) : 3;

		if (isNaN(parsedLimit)) {
			return res.status(400).json({ error: "O parâmetro limit não é um número válido." });
		}

		const posts = await Post.findAll({ limit: parsedLimit, order: [["id", "DESC"]] });

		res.json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};
