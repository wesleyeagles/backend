import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Segment = sequelize.define(
	"segment",
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		// Outros campos do modelo Segment
	},
	{
		timestamps: false,
	}
);

export default Segment;
