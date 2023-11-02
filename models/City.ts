import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const City = sequelize.define(
	"City",
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		uf: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Outros campos do modelo City
	},
	{
		timestamps: false,
		tableName: "cities",
	}
);

export default City;
