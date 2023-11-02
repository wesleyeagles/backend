import { Request, Response } from "express";
import Post from "../models/Post"; // Importe o modelo Post

const getAllPosts = async (req: Request, res: Response) => {
	try {
		const posts = await Post.findAll();

		res.status(200).json(posts);
	} catch (error) {
		console.error("Erro ao obter os posts:", error);
		res.status(500).json({ error: "Erro ao obter os posts" });
	}
};

const createPost = async (titulo: string, conteudo: string, imagem: string) => {
	try {
		const post = await Post.create({
			titulo,
			conteudo,
			imagem,
		});

		return post.post_id; // Retorna o ID do post criado
	} catch (error) {
		console.error("Erro ao criar o post:", error);
		throw new Error("Erro ao criar o post");
	}
};

export default {
	getAllPosts,
	createPost,
};
