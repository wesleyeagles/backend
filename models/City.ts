import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const City = sequelize.define("City", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	// Outros campos do modelo City
});

export default City;
