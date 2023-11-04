import express from "express";
import multer from "multer";
import { createPost, getPosts } from "../controllers/PostController";

const router = express.Router();
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now();
		cb(null, `${timestamp}-${file.originalname}`);
	},
});

const upload = multer({ storage });

router.post("/criar-post", upload.single("imagem"), createPost);
// Rota para buscar posts com base no número fornecido
router.get("/ultimos-posts", getPosts);

export default router;
