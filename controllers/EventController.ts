import { Request, Response } from "express";
import Event from "../models/Event";
import { remove } from "remove-accents";
import axios from "axios";
import { Client } from "basic-ftp";
import sharp from "sharp";

export const createEvent = async (req: Request, res: Response) => {
	try {
		const { nome, sobre, data, publicoAlvo, objetivos, cargaHoraria, horario, modalidade, local, link, facebook, instagram, linkedin, youtube } = req.body;

		console.log(req.body);

		const publicoAlvoString = publicoAlvo.join(", ");
		const objetivosString = objetivos.join(", ");

		if (typeof nome !== "string") {
			return res.status(400).json({ error: "O título deve ser uma string válida." });
		}

		// Verifique se já existe um post com o mesmo título no banco de dados
		const existingPost = await Event.findOne({ where: { nome } });

		if (existingPost) {
			return res.status(400).json({ error: "Já existe um evento com o mesmo titulo." });
		}

		// Gere o "slug" automaticamente com base no título
		const slug = remove(nome).toLowerCase().replace(/\s+/g, "-");

		// Realize a conversão para WebP antes da transferência FTP
		if (req.file) {
			const imagePath = req.file.path; // Caminho da imagem original
			const webpPath = imagePath.replace(/\.[^.]+$/, ".webp"); // Caminho da imagem WebP

			if (!imagePath.includes("webp")) {
				await sharp(imagePath)
					.webp({ quality: 90 }) // Defina a qualidade desejada
					.toFile(webpPath);
			}

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

		// Crie um novo evento no banco de dados com o nome da imagem no formato WebP
		const newEvent = await Event.create({
			nome,
			sobre,
			data,
			slug,
			publicoAlvo: publicoAlvoString,
			objetivos: objetivosString,
			cargaHoraria,
			horario,
			modalidade,
			local,
			link,
			facebook,
			instagram,
			linkedin,
			youtube,
			imagem: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null,
		});

		res.status(201).json(newEvent);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const editEvent = async (req: Request, res: Response) => {
	try {
		const eventId = Number(req.params.id);
		const event = await Event.findByPk(eventId);

		if (!event) {
			return res.status(404).json({ error: "Evento não encontrada" });
		}

		const { nome, sobre, data, publicoAlvo, objetivos, cargaHoraria, horario, modalidade, local, link, facebook, instagram, linkedin, youtube } = req.body;

		const publicoAlvoString = publicoAlvo.join(", ");
		const objetivosString = objetivos.join(", ");

		console.log(req.body);
		const slug = remove(nome).toLowerCase().replace(/\s+/g, "-");

		// Compare os valores existentes com os novos
		if (
			nome === event.nome &&
			slug === event.slug &&
			sobre === event.sobre &&
			data === event.data &&
			publicoAlvo === event.publicoAlvo &&
			objetivos === event.objetivos &&
			cargaHoraria === event.cargaHoraria &&
			horario === event.horario &&
			modalidade === event.modalidade &&
			local === event.local &&
			link === event.link &&
			facebook === event.facebook &&
			instagram === event.instagram &&
			linkedin === event.linkedin &&
			youtube === event.youtube &&
			!req.file // Se não houver nova imagem
		) {
			// Se nada foi alterado, envie uma resposta indicando que nenhum dado foi modificado
			return res.status(200).json({ message: "Nenhum dado foi modificado." });
		}

		// Atualize os campos relevantes da postagem
		event.nome = nome;
		event.slug = slug;
		event.data = data;
		event.publicoAlvo = publicoAlvoString;
		event.objetivos = objetivosString;
		event.cargaHoraria = cargaHoraria;
		event.horario = horario;
		event.modalidade = modalidade;
		event.local = local;
		event.link = link;
		event.facebook = facebook;
		event.instagram = instagram;
		event.linkedin = linkedin;
		event.youtube = youtube;

		// Se uma nova imagem for fornecida, faça o processamento da imagem
		if (req.file) {
			const imagePath = req.file.path;
			const webpPath = imagePath.replace(/\.[^.]+$/, ".webp");

			await sharp(imagePath).webp({ quality: 90 }).toFile(webpPath);

			const client = new Client();
			await client.access({
				host: "ftp.ibtec.org.br",
				user: "dev@dev.ibtec.org.br",
				password: "Dev04121996",
			});

			await client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));

			await client.close();

			event.imagem = req.file.filename.replace(/\.[^.]+$/, ".webp");
		}

		// Salve as alterações no banco de dados
		await event.save();

		return res.json(event);
	} catch (error) {
		console.error(error);

		// Tratamento de erro adequado
		return res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const deleteEvento = async (req: Request, res: Response): Promise<void> => {
	try {
		const eventId = Number(req.params.id); // Obtenha o ID do evento a ser excluída dos parâmetros da URL

		// Use o Sequelize para buscar o evento pelo ID e excluí-la
		const event = await Event.findByPk(eventId);

		if (!event) {
			res.status(404).json({ error: "Evento não encontrada" });
			return;
		}

		await event.destroy(); // Exclua o evento

		res.status(204).end(); // Responda com um status 204 (No Content) para indicar sucesso na exclusão
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const getEventBySlug = async (req: Request, res: Response) => {
	try {
		const eventSlug = req.params.slug;

		// Use o Sequelize para buscar o evento pelo slug
		const event = await Event.findOne({ where: { slug: eventSlug } });

		if (!event) {
			res.status(404).json({ error: "Evento não encontrado" });
			return;
		}

		// URL direta da imagem
		const remoteFileUrl = `https://dev.ibtec.org.br/dev/blog/${event.imagem}`;

		// Baixar a imagem diretamente da URL
		const response = await axios.get(remoteFileUrl, { responseType: "arraybuffer" });

		// Converter o ArrayBuffer para Buffer usando Buffer.from
		const imageBuffer = Buffer.from(response.data as ArrayBuffer);

		// Converter a imagem para buffer usando sharp
		const originalImageBuffer = await sharp(imageBuffer).toBuffer();

		res.json({
			...event.toJSON(),
			originalImageBuffer,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export const getEvents = async (req: Request, res: Response) => {
	try {
		const limit = req.query.limit as string | undefined;
		const parsedLimit = limit ? parseInt(limit, 10) : undefined; // Mantenha como undefined se não houver limite

		const events = await Event.findAll({
			limit: typeof parsedLimit === "number" ? parsedLimit : undefined,
			order: [["id", "DESC"]],
		});

		res.json(events);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};
