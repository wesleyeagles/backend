import { Sequelize } from "sequelize";

const sequelize = new Sequelize("ctcca_ibtec", "ctcca_dev", "Eagles110591", {
	host: "server01.ibtec.org.br",
	dialect: "mysql",
	dialectOptions: {
		keepAlive: true, // Ativar a consulta de manutenção
	},
});

sequelize
	.authenticate()
	.then(() => {
		console.log("Conexão com o banco de dados estabelecida com sucesso.");
	})
	.catch((error) => {
		console.error("Erro ao conectar ao banco de dados:", error);
	});

export default sequelize;
