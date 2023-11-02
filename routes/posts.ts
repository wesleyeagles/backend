import express, { Request, Response } from "express";
import postsController from "../controllers/postsController";
import uploadMiddleware from "../middleware/uploadMiddleware";

const router = express.Router();

// Rota para obter todos os posts
router.get("/todos-posts", postsController.getAllPosts);

// Rota para criar um novo post
router.post("/criar-post", uploadMiddleware.single("imagem"), (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).json({ error: "Nenhuma imagem enviada" });
	}

	const { titulo, conteudo } = req.body;
	const imagem = req.file.filename;

	postsController
		.createPost(titulo, conteudo, imagem)
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

export default router;
