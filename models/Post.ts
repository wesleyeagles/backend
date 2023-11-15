import { Model, DataTypes } from "sequelize";
import db from "../config/db"; // Importe a instância do Sequelize

class Post extends Model {
	public titulo!: string;
	public slug!: string;
	public conteudo!: string[];
	public imagem!: string | null;
}

Post.init(
	{
		slug: {
			type: DataTypes.STRING,
		},
		titulo: {
			type: DataTypes.STRING,
		},
		conteudo: {
			type: DataTypes.TEXT,
		},
		imagem: {
			type: DataTypes.BLOB,
		},
	},
	{
		sequelize: db,
		modelName: "post", // Nome da tabela no banco de dados
	}
);

export default Post;
