import { Request, Response } from "express";
import db from "../config/db";

const getAllCities = (req: Request, res: Response) => {
	const query = "SELECT * FROM cities";
	db.query(query, (error, results) => {
		if (error) {
			console.error("Erro ao obter as cidades:", error);
			res.status(500).json({ error: "Erro ao obter as cidades" });
		} else {
			res.status(200).json(results);
		}
	});
};

export default {
	getAllCities,
};
