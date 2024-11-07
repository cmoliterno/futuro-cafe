import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

class Talhao extends Model {
    public id!: string;
    public nome!: string; // Nome do talhão
    public fazendaId!: string; // ID da fazenda
    public createdAt!: Date; // Adicionando createdAt
    public lastUpdatedAt!: Date; // Adicionando lastUpdatedAt
}

Talhao.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Nome'
    },
    fazendaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'FazendaId'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'CreatedAt'
    },
    lastUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'LastUpdatedAt'
    }
}, {
    sequelize,
    modelName: 'Talhao',
    tableName: 'tbTalhao',
    timestamps: false // Removido
});

export default Talhao;
