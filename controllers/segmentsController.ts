import { Request, Response } from "express";
import Segment from "../models/Segment"; // Importe o modelo Segment

const getAllSegments = async (req: Request, res: Response) => {
	try {
		const segments = await Segment.findAll({
			where: {
				active: 1,
			},
		});

		res.status(200).json(segments);
	} catch (error) {
		console.error("Erro ao obter os segmentos:", error);
		res.status(500).json({ error: "Erro ao obter os segmentos" });
	}
};

export default {
	getAllSegments,
};
