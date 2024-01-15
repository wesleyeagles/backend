import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Associate = sequelize.define(
	"associate",
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
		},
		segment_id: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		city_id: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		fantasy_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		neighborhood: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		zip_code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		website: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.BLOB,
			allowNull: false,
		},
		// Outros campos do modelo Associate
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		timestamps: false,
	}
);

export default Associate;
