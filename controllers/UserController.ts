import { Request, Response } from "express";
import { User } from "../models/User";
import sharp from "sharp";
import { Client } from "basic-ftp";
import { hash } from "bcrypt";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const users = await User.findAll();
		res.json({ users });
	} catch (error) {
		console.error("Erro ao obter todos os usuários:", error);
		res.status(500).json({ message: "Erro no servidor" });
	}
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	try {
		const user = await User.findOne({ where: { id } });

		if (!user) {
			res.status(401).json({ message: "Usuário não encontrado" });
			return;
		}

		res.json({ user });
	} catch (error) {
		console.error("Erro no login:", error);
		res.status(500).json({ message: "Erro no servidor" });
	}
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
	const { name, email, password, role } = req.body;

	try {
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			res.status(404).json({ error: "Já existe um usuário com este e-mail" });
			return;
		}

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
		}

		const hashedPassword = await hash(password, 10);

		const newUser = await User.create({ name, email, password: hashedPassword, role, image: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null });

		res.status(201).json({ user: newUser });
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		res.status(500).json({ message: "Erro no servidor" });
	}
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = Number(req.params.id); // Obtenha o ID do evento a ser excluída dos parâmetros da URL

		// Use o Sequelize para buscar o evento pelo ID e excluí-la
		const user = await User.findByPk(userId);

		if (!user) {
			res.status(404).json({ error: "Usuário não encontrada" });
			return;
		}

		await user.destroy(); // Exclua o evento

		res.status(204).end(); // Responda com um status 204 (No Content) para indicar sucesso na exclusão
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};
