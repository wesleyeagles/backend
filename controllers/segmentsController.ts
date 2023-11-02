import { Request, Response } from "express";
import db from "../config/db";

const getAllSegments = (req: Request, res: Response) => {
	const query = "SELECT * FROM segments WHERE active = 1";
	db.query(query, (error, results) => {
		if (error) {
			console.error("Erro ao obter os segmentos:", error);
			res.status(500).json({ error: "Erro ao obter os segmentos" });
		} else {
			res.status(200).json(results);
		}
	});
};

export default {
	getAllSegments,
};
