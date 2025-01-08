import { DataTypes, Model } from "sequelize";
import { sequelize } from '../services/DatabaseService';

class AnaliseRapida extends Model {
    public id!: string;
    public nomeGrupo!: string;
    public status!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public grupoId!: string;

}

AnaliseRapida.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nomeGrupo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grupoId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: "GrupoId",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'CreatedAt'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'UpdatedAt'
        },
    },
    {
        sequelize,
        modelName: "AnaliseRapida",
        tableName: "tbAnaliseRapida",
    }
);

export default AnaliseRapida;
