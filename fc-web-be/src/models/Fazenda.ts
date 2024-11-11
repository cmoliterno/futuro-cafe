import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class Fazenda extends Model {
    public id!: string;
    public nome!: string;
    public createdAt!: Date;  // Data de criação
    public lastUpdatedAt!: Date;  // Data da última atualização
}

Fazenda.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    nome: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'Nome'
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
    modelName: 'Fazenda',
    tableName: 'tbFazenda',
    timestamps: false
});

export default Fazenda;
