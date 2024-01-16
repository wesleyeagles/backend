import express from "express";
import associatesController, { createAssociate, deleteAssociate } from "../controllers/associatesController";
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

router.post("/criar-associado", upload.single("image"), createAssociate);

router.delete("/deletar/:id", deleteAssociate);

router.get("/todos-associados", associatesController.getAllAssociates);

export default router;
