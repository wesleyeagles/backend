import { Model, DataTypes } from "sequelize";
import db from "../config/db"; // Importe a instância do Sequelize

class Post extends Model {
	public tile!: string;
	public content!: string[];
	public image!: string | null;
}

Post.init(
	{
		title: {
			type: DataTypes.STRING,
		},
		content: {
			type: DataTypes.TEXT,
		},
		image: {
			type: DataTypes.BLOB,
		},
	},
	{
		sequelize: db,
		modelName: "new", // Nome da tabela no banco de dados
		timestamps: true,
	}
);

export default Post;
