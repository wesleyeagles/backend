import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postsRouter from "./routes/posts";
import citiesRouter from "./routes/cities";
import segmentsRouter from "./routes/segments";
import contactFormRouter from "./routes/contactForm";
import associatesRouter from "./routes/associates";
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

const db = createConnection({
	host: "server01.ibtec.org.br",
	user: "ctcca_dev",
	password: "Eagles110591",
	database: "ctcca_ibtec",
});

db.connect((err) => {
	if (err) {
		console.error("Erro ao conectar ao banco de dados:", err);
	} else {
		console.log("Conexão bem-sucedida ao banco de dados");
	}
});

const keepDBConnectionAlive = () => {
	const query = "SELECT 1";
	db.query(query, (error) => {
		if (error) {
			console.error("Erro na consulta de manutenção da conexão:", error);
		} else {
			console.log("Consulta de manutenção da conexão bem-sucedida");
		}
	});
};

setInterval(keepDBConnectionAlive, 250000);

// Roteamento para as rotas de posts
app.use("/api/posts", postsRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/segments", segmentsRouter);
app.use("/api/contact", contactFormRouter);
app.use("/api/associates", associatesRouter);

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
