import { createConnection } from "mysql";

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

export default db;
