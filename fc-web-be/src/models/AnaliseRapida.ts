import { DataTypes, Model } from "sequelize";
import { sequelize } from '../services/DatabaseService';

class AnaliseRapida extends Model {
    public id!: string;
    public nomeGrupo!: string;
    public lado!: "Esquerdo" | "Direito";
    public createdAt!: Date;
    public updatedAt!: Date;
    public grupoId!: string;
    public analiseId!: string;

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
        lado: {
            type: DataTypes.STRING, // Removido o CHECK constraint
            allowNull: false,
            validate: {
                isIn: [["Esquerdo", "Direito"]], // Validação no backend
            },
        },
        analiseId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'tbAnalise',
                key: 'Id',
            },
            field: "AnaliseId",
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
