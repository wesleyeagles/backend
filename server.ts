import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import { createConnection } from "mysql";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	cors({
		origin: ["http://localhost:5173", "https://dev.ibtec.org.br"],
	})
);

// Configuração da conexão com o banco de dados
const db = createConnection({
	host: "server01.ibtec.org.br",
	user: "ctcca_dev",
	password: "Eagles110591",
	database: "ctcca_ibtec",
});

// Conectar ao banco de dados
db.connect((err) => {
	if (err) {
		console.error("Erro ao conectar ao banco de dados:", err);
	} else {
		console.log("Conexão bem-sucedida ao banco de dados");
	}
});

// Configurar o transporte de email
const transporter = nodemailer.createTransport({
	host: "mail.ibtec.org.br",
	port: 465,
	auth: {
		user: "dev@ibtec.org.br",
		pass: "Dev110591",
	},
});

// Rota para realizar a consulta
app.get("/consultar-dados", (req, res) => {
	const query = "SELECT * FROM `associates` WHERE active = 1";
	db.query(query, (error, results, fields) => {
		if (error) {
			console.error("Erro na consulta:", error);
			res.status(500).send("Erro na consulta ao banco de dados");
		} else {
			res.status(200).json(results);
		}
	});
});

app.get("/cities", (req, res) => {
	const query = "SELECT * FROM `cities`";
	db.query(query, (error, results, fields) => {
		if (error) {
			console.error("Erro na consulta:", error);
			res.status(500).send("Erro na consulta ao banco de dados");
		} else {
			res.status(200).json(results);
		}
	});
});

app.get("/segments", (req, res) => {
	const query = "SELECT * FROM `segments` WHERE active = 1";
	db.query(query, (error, results, fields) => {
		if (error) {
			console.error("Erro na consulta:", error);
			res.status(500).send("Erro na consulta ao banco de dados");
		} else {
			res.status(200).json(results);
		}
	});
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
