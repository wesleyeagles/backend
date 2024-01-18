import { Model, DataTypes } from "sequelize";
import db from "../config/db"; // Importe a instância do Sequelize

class Event extends Model {
	public nome!: string;
	public slug!: string;
	public sobre!: string;
	public imagem!: string;
	public data!: Date;
	public dataFim!: Date;
	public publicoAlvo!: string;
	public objetivos!: string;
	public tematicas!: string;
	public cargaHoraria!: string;
	public horario!: string | null;
	public horarioFim!: string | null;
	public modalidade!: string;
	public local!: string;
	public link!: string | null;
	public facebook!: string | null;
	public instagram!: string | null;
	public linkedin!: string | null;
	public youtube!: string | null;
}

Event.init(
	{
		nome: {
			type: DataTypes.STRING,
		},
		slug: {
			type: DataTypes.STRING,
		},
		sobre: {
			type: DataTypes.STRING,
		},
		imagem: {
			type: DataTypes.BLOB,
		},
		publicoAlvo: {
			type: DataTypes.STRING,
		},
		objetivos: {
			type: DataTypes.STRING,
		},
		tematicas: {
			type: DataTypes.STRING,
		},
		cargaHoraria: {
			type: DataTypes.STRING,
		},
		horario: {
			type: DataTypes.STRING,
		},
		horarioFim: {
			type: DataTypes.STRING,
		},
		modalidade: {
			type: DataTypes.STRING,
		},
		local: {
			type: DataTypes.STRING,
		},
		data: {
			type: DataTypes.DATE,
		},
		dataFim: {
			type: DataTypes.DATE,
		},
		link: {
			type: DataTypes.STRING,
		},
		facebook: {
			type: DataTypes.STRING,
		},
		instagram: {
			type: DataTypes.STRING,
		},
		linkedin: {
			type: DataTypes.STRING,
		},
		youtube: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize: db,
		modelName: "evento", // Nome da tabela no banco de dados
	}
);

export default Event;
