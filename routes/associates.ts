import express from "express";
import associatesController, { createAssociate } from "../controllers/associatesController";

const router = express.Router();

router.get("/todos-associados", associatesController.getAllAssociates);

router.post("/criar-associado", createAssociate);

export default router;
