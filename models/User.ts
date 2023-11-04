import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class User extends Model {
	public id!: number;
	public email!: string;
	public password!: string;
	public name!: string;
	public role!: string;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		role: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		name: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		email: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		password: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: false,
	}
);

export { User };
