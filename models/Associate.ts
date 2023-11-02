import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Associate = sequelize.define("Associate", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	// Outros campos do modelo Associate
	active: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
});

export default Associate;
