import { Request, Response } from "express";
import db from "../config/db";

const getAllAssociates = (req: Request, res: Response) => {
	const query = "SELECT * FROM `associates` WHERE active = 1";
	db.query(query, (error, results) => {
		if (error) {
			console.error("Erro ao obter os associados:", error);
			res.status(500).json({ error: "Erro ao obter os associados" });
		} else {
			res.status(200).json(results);
		}
	});
};

export default {
	getAllAssociates,
};
