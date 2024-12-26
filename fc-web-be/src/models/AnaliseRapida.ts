import { Model, DataTypes } from "sequelize";
import { sequelize } from '../services/DatabaseService';

class AnaliseRapida extends Model {
    public id!: string;
    public nomeGrupo!: string;
    public lado!: "Esquerdo" | "Direito";
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

AnaliseRapida.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nomeGrupo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lado: {
            type: DataTypes.ENUM("Esquerdo", "Direito"),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "tbAnaliseRapida",
        tableName: "tbAnaliseRapida",
    }
);

export default AnaliseRapida;
