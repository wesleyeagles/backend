import { Model, DataTypes } from "sequelize";
import db from "../config/db"; // Importe a instância do Sequelize

class Post extends Model {
	public post_id!: number;
	public titulo!: string;
	public conteudo!: string;
	public imagem!: string;
}

Post.init(
	{
		post_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		titulo: {
			type: DataTypes.STRING,
		},
		conteudo: {
			type: DataTypes.STRING,
		},
		imagem: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize: db,
		modelName: "post", // Nome da tabela no banco de dados
	}
);

export default Post;
