import { Request, Response } from "express";
import { User } from "../models/User";

class UserController {
	public static async getUserById(req: Request, res: Response): Promise<void> {
		const { id } = req.params; // Correção: use req.params para obter o ID da URL

		try {
			const user = await User.findOne({ where: { id } });

			if (!user) {
				res.status(401).json({ message: "Usuário não encontrado" });
				return;
			}

			res.json({ user }.user);
		} catch (error) {
			console.error("Erro no login:", error);
			res.status(500).json({ message: "Erro no servidor" });
		}
	}
}

export { UserController };
