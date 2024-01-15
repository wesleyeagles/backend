import { Request, Response } from "express";
import Associate from "../models/Associate"; // Importe o modelo Associate
import { Client } from "basic-ftp";
import sharp from "sharp";

export const createAssociate = async (req: Request, res: Response) => {
	try {
		const { segment_id, city_id, fantasy_name, state, address, neighborhood, zip_code, phone, website } = req.body;

		console.log(req.body);

		// Verifique se já existe um post com o mesmo título no banco de dados
		const existingPost = await Associate.findOne({ where: { fantasy_name } });

		if (existingPost) {
			return res.status(400).json({ error: "Já existe um associado com o mesmo nome." });
		}

		// Realize a conversão para WebP antes da transferência FTP
		if (req.file) {
			const imagePath = req.file.path; // Caminho da imagem original
			const webpPath = imagePath.replace(/\.[^.]+$/, ".webp"); // Caminho da imagem WebP

			await sharp(imagePath)
				.webp({ quality: 90 }) // Defina a qualidade desejada
				.toFile(webpPath);

			// Agora, faça a transferência FTP da imagem WebP para o cPanel
			const client = new Client();
			await client.access({
				host: "ftp.ibtec.org.br",
				user: "dev@dev.ibtec.org.br",
				password: "Dev04121996",
			});

			// Substitua '/blog/' pelo caminho correto no seu cPanel
			await client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));

			await client.close();
		}

		// Crie um novo post no banco de dados com o nome da imagem no formato WebP
		const newPost = await Associate.create({
			segment_id,
			city_id,
			state,
			address,
			neighborhood,
			zip_code,
			phone,
			website,
			image: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null,
		});

		res.status(201).json(newPost);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

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
