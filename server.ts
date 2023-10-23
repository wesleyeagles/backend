import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

// Configurar o transporte de email
const transporter = nodemailer.createTransport({
	host: "mail.ibtec.org.br",
	port: 465,
	auth: {
		user: "dev@ibtec.org.br",
		pass: "Dev110591",
	},
});

app.post("/enviar-formulario", (req, res) => {
	const { Nome, Email, Telefone, Assunto, Mensagem } = req.body;

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
          <p><strong>Nome:</strong> ${Nome}</p>
          <p><strong>Email:</strong> ${Email}</p>
          <p><strong>Telefone:</strong> ${Telefone}</p>
          <p><strong>Assunto:</strong> ${Assunto}</p>
          <p><strong>Mensagem:</strong> ${Mensagem}</p>
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
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
