import { Request, Response } from "express";
import db from "../config/db";

const getAllPosts = (req: Request, res: Response) => {
	const query = "SELECT * FROM posts";
	db.query(query, (error, results) => {
		if (error) {
			console.error("Erro ao obter os posts:", error);
			res.status(500).json({ error: "Erro ao obter os posts" });
		} else {
			res.status(200).json(results);
		}
	});
};

const createPost = (titulo: string, conteudo: string, imagem: string) => {
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO posts (titulo, conteudo, imagem) VALUES (?, ?, ?)";
		db.query(sql, [titulo, conteudo, imagem], (error, result) => {
			if (error) {
				console.error("Erro ao inserir o post:", error);
				reject({ error: "Erro ao inserir o post" });
			} else {
				const postId = result.insertId;
				resolve({ message: "Post criado com sucesso", postId });
			}
		});
	});
};

export default {
	getAllPosts,
	createPost,
};
