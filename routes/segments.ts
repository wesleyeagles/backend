import express from "express";
import segmentsController from "../controllers/segmentsController";

const router = express.Router();

router.get("/todos-segmentos", segmentsController.getAllSegments);

export default router;
