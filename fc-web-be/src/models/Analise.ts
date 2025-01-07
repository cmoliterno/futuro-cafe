import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class Analise extends Model {
    public id!: string;
    public cherry!: number;
    public dry!: number;
    public green!: number;
    public greenYellow!: number;
    public raisin!: number;
    public total!: number;
    public talhaoId!: string;
    public grupoId?: string;
    public projetoId?: string;
    public coordenadas?: string;
    public imagemUrl!: string;
    public imagemResultadoUrl?: string;
    public createdAt!: Date;
    public lastUpdatedAt!: Date;
}

Analise.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    cherry: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Cherry'
    },
    dry: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Dry'
    },
    green: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Green'
    },
    greenYellow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'GreenYellow'
    },
    raisin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Raisin'
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Total'
    },
    talhaoId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'TalhaoId'
    },
    grupoId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'GrupoId'
    },
    projetoId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'ProjetoId'
    },
    coordenadas: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'Coordenadas'
    },
    imagemUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'ImagemUrl'
    },
    imagemResultadoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'ImagemResultadoUrl'
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
    modelName: 'Analise',
    tableName: 'tbAnalise',
    timestamps: false
});

export default Analise;
