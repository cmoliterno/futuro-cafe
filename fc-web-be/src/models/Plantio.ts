import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class Plantio extends Model {
    public id!: string;  // UUID para identificação
    public data!: Date;  // Data do plantio
    public espacamentoLinhasMetros!: number;  // Espaçamento entre linhas em metros
    public espacamentoMudasMetros!: number;    // Espaçamento entre mudas em metros
    public cultivarId!: number;                 // ID do cultivar associado
    public talhaoId!: string;                   // ID do talhão associado
    public createdAt!: Date;                    // Data de criação
    public lastUpdatedAt!: Date;                // Data da última atualização
}

Plantio.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'Data'
    },
    espacamentoLinhasMetros: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        field: 'EspacamentoLinhasMetros'
    },
    espacamentoMudasMetros: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        field: 'EspacamentoMudasMetros'
    },
    cultivarId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CultivarId'
    },
    talhaoId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'TalhaoId'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'CreatedAt'
    },
    lastUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'LastUpdatedAt'
    }
}, {
    sequelize,
    modelName: 'Plantio',
    tableName: 'tbPlantio',
    timestamps: false
});

export default Plantio;
