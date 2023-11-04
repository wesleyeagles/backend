import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = "Wszwe94q@@dSa$%a15Z"; // Deve ser mantido em segredo

class AuthController {
	public static async login(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;

		try {
			const user = await User.findOne({ where: { email } });

			if (!user) {
				res.status(401).json({ message: "Usuário não encontrado" });
				return; // Retorne aqui para evitar erros de tipo
			}

			if (!bcrypt.compareSync(password, user.password)) {
				res.status(401).json({ message: "Senha incorreta" });
				return; // Retorne aqui para evitar erros de tipo
			}

			const token = jwt.sign({ id: user.id, email: user.email }, secretKey);

			res.json({ token, user });
		} catch (error) {
			console.error("Erro no login:", error);
			res.status(500).json({ message: "Erro no servidor" });
		}
	}
}

export { AuthController };
