import { Request, Response } from "express";
import City from "../models/City"; // Importe o modelo City

const getAllCities = async (req: Request, res: Response) => {
	try {
		const cities = await City.findAll();

		res.status(200).json(cities);
	} catch (error) {
		console.error("Erro ao obter as cidades:", error);
		res.status(500).json({ error: "Erro ao obter as cidades" });
	}
};

export default {
	getAllCities,
};
