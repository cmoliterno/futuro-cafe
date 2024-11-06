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
    public coordenadas?: string; // Adicionando coordenadas
    public imagemUrl?: string; // Adicionando URL da imagem
    public imagemResultadoUrl?: string; // Adicionando URL da imagem do resultado
    public createdAt!: Date; // Adicionando createdAt
    public lastUpdatedAt!: Date; // Adicionando lastUpdatedAt
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
        allowNull: false,
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
        type: DataTypes.STRING, // Ajuste o tipo conforme necessário
        allowNull: true,
        field: 'Coordenadas'
    },
    imagemUrl: {
        type: DataTypes.STRING, // Ajuste o tipo conforme necessário
        allowNull: true,
        field: 'ImagemUrl'
    },
    imagemResultadoUrl: {
        type: DataTypes.STRING, // Ajuste o tipo conforme necessário
        allowNull: true,
        field: 'ImagemResultadoUrl'
    },
}, {
    sequelize,
    modelName: 'Analise',
    tableName: 'tbAnalise',
    timestamps: true // Isso adiciona createdAt e updatedAt automaticamente
});

export default Analise;
