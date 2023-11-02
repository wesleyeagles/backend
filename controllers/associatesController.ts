import { Request, Response } from "express";
import Associate from "../models/Associate"; // Importe o modelo Associate

const getAllAssociates = async (req: Request, res: Response) => {
	try {
		const associates = await Associate.findAll({
			where: {
				active: 1,
			},
		});

		res.status(200).json(associates);
	} catch (error) {
		console.error("Erro ao obter os associados:", error);
		res.status(500).json({ error: "Erro ao obter os associados" });
	}
};

export default {
	getAllAssociates,
};
