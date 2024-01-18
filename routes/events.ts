import express from "express";
import { createEvent, deleteEvento, editEvent, getEventBySlug, getEvents, orderedGetEvents } from "../controllers/EventController";
import multer from "multer";

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

// Rota para buscar posts com base no número fornecido
router.get("/ultimos-events", getEvents);

router.get("/ordered-events", orderedGetEvents);

// Rota para excluir uma notícia pelo ID
router.delete("/deletar/:id", deleteEvento);

router.post("/criar-evento", upload.single("imagem"), createEvent);

router.put("/editar/:id", upload.single("imagem"), editEvent);

router.get("/:slug", getEventBySlug); // Rota para obter um post pelo ID

export default router;
