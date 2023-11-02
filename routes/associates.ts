import express from "express";
import associatesController from "../controllers/associatesController";

const router = express.Router();

router.get("/todos-associados", associatesController.getAllAssociates);

export default router;
