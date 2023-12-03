import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Contato from "../models/Contact";

// Configurar o transporte de email
const transporter = nodemailer.createTransport({
	host: "mail.ibtec.org.br",
	port: 465,
	auth: {
		user: "dev@ibtec.org.br",
		pass: "Dev110591",
	},
});

export const getAllContatos = async (req: Request, res: Response) => {
	try {
		const contatos = await Contato.findAll();

		res.status(200).json(contatos);
	} catch (error) {
		console.error("Erro ao obter os contatos:", error);
		res.status(500).json({ error: "Erro ao obter os contatos" });
	}
};

export const deletaContato = async (req: Request, res: Response): Promise<void> => {
	try {
		const contatoId = Number(req.params.id); // Obtenha o ID do evento a ser excluída dos parâmetros da URL

		// Use o Sequelize para buscar o evento pelo ID e excluí-la
		const contato = await Contato.findByPk(contatoId);

		if (!contato) {
			res.status(404).json({ error: "Contato não encontrada" });
			return;
		}

		await contato.destroy(); // Exclua o evento

		res.status(204).end(); // Responda com um status 204 (No Content) para indicar sucesso na exclusão
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
};

const sendContactForm = async (req: Request, res: Response) => {
	const { nome, email, telefone, assunto, mensagem } = req.body;

	const existingContact = await Contato.findOne({ where: { email } });

	if (existingContact) {
		return res.status(400).json({ error: "Já existe um registro com esse email, por favor aguarde o contato." });
	}

	const mailOptions = {
		from: "seu-email@gmail.com",
		to: "crafael.wesley@gmail.com",
		subject: "Mensagem do formulário de contato",
		html: `
      <html>
      <body>
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="font-size: 24px; color: #333;">Detalhes do Contato</h1>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
          </div>
        </div>
      </body>
      </html>
    `,
	};

	// Enviar o email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.status(500).send("Erro ao enviar o email");
		} else {
			console.log("Email enviado: " + info.response);
			res.status(200).send("Email enviado com sucesso");
		}
	});

	const newContato = await Contato.create({
		nome,
		assunto,
		telefone,
		mensagem,
		email,
	});

	res.status(201).json(newContato);
};

export default {
	sendContactForm,
};
