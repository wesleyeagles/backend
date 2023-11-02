import express from "express";
import citiesController from "../controllers/citiesController";

const router = express.Router();

router.get("/todas-cidades", citiesController.getAllCities);

export default router;
