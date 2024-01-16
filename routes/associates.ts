import express from "express";
import associatesController, { createAssociate } from "../controllers/associatesController";
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

router.get("/todos-associados", associatesController.getAllAssociates);

router.post("/criar-associado", upload.single("imagem"), createAssociate);

export default router;
