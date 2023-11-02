import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const AccessLog = sequelize.define("AccessLog", {
	timestamp: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	ip_address: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	country: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	referer: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

export default AccessLog;
