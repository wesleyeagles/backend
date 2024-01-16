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
		created_at: {
			type: DataTypes.STRING,
		},
		updated_at: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize: db,
		modelName: "new", // Nome da tabela no banco de dados
		timestamps: false,
	}
);

export default Post;
