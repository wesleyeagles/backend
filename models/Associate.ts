import { DataTypes, Model } from "sequelize";
import db from "../config/db"; // Importe a instância do Sequelize

class Associate extends Model {
	public segment_id!: number;
	public city_id!: number;
	public fantasy_name!: string;
	public image!: string;
	public state!: string;
	public address!: string;
	public neighborhood!: string;
	public zip_code!: string;
	public phone!: string;
	public website!: string;
}

Associate.init(
	{
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
		sequelize: db,
		modelName: "associates", // Nome da tabela no banco de dados
		timestamps: false,
	}
);

export default Associate;
