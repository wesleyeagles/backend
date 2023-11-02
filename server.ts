import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postsRouter from "./routes/posts";
import citiesRouter from "./routes/cities";
import segmentsRouter from "./routes/segments";
import contactFormRouter from "./routes/contactForm";
import associatesRouter from "./routes/associates";
import { Op, Sequelize } from "sequelize";
import axios from "axios"; // Importe a biblioteca "axios" para fazer solicitações HTTP
import AccessLog from "./models/AccessLog";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	cors({
		origin: ["http://localhost:5173", "https://dev.ibtec.org.br"],
	})
);

// Configure o Sequelize para se conectar ao banco de dados
const sequelize = new Sequelize({
	dialect: "mysql",
	host: "server01.ibtec.org.br",
	username: "ctcca_dev",
	password: "Eagles110591",
	database: "ctcca_ibtec",
	pool: {
		max: 5, // Número máximo de conexões no pool
		min: 0, // Número mínimo de conexões no pool
		acquire: 250000, // Tempo máximo em milissegundos para adquirir uma conexão
		idle: 10000, // Tempo máximo em milissegundos que uma conexão pode ficar inativa
	},
});
// Verifique a conexão com o banco de dados
sequelize
	.authenticate()
	.then(() => {
		console.log("Conexão bem-sucedida ao banco de dados");
	})
	.catch((err) => {
		console.error("Erro ao conectar ao banco de dados:", err);
	});

// Roteamento para as rotas de posts
app.use("/api/posts", postsRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/segments", segmentsRouter);
app.use("/api/contact", contactFormRouter);
app.use("/api/associates", associatesRouter);

// Middleware para rastreamento de visitas
app.post("/api/track-visit", async (req, res, next) => {
	const clientIP = req.ip;

	console.log(clientIP);

	// Use a API de geolocalização para obter informações sobre o país
	try {
		const response = await axios.get(`https://ipinfo.io/${clientIP}/json`);

		const data = response.data;
		const country = data.country;

		// Obtenha a URL de referência do cabeçalho da solicitação
		const referrer = req.get("referrer");

		// Registre o acesso no banco de dados
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const existingVisit = await AccessLog.findOne({
				where: {
					timestamp: {
						[Op.gte]: today,
					},
				},
			});

			if (!existingVisit) {
				await AccessLog.create({
					timestamp: new Date(),
					country,
					referrer,
				});
			}
		} catch (error) {
			console.error("Erro ao registrar a visita:", error);
		}
	} catch (error) {
		console.error("Erro ao obter informações de geolocalização:", error);
	}
	next();
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
