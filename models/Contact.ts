import { Model, DataTypes } from "sequelize";
import db from "../config/db"; // Importe a instância do Sequelize

class Contato extends Model {
	public nome!: string;
	public email!: string;
	public assunto!: string;
	public telefone!: string;
	public mensagem!: string;
}

Contato.init(
	{
		nome: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
		},
		assunto: {
			type: DataTypes.STRING,
		},
		mensagem: {
			type: DataTypes.STRING,
		},
		telefone: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize: db,
		modelName: "contato", // Nome da tabela no banco de dados
	}
);

export default Contato;
