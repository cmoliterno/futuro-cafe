import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class Pessoa extends Model {
    public id!: string;
    public natureza!: string;
    public createdAt!: Date;
    public lastUpdatedAt!: Date;
}

Pessoa.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    natureza: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'Natureza'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'CreatedAt'
    },
    lastUpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'LastUpdatedAt'
    }
}, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'tbPessoa',
    timestamps: false
});

export default Pessoa;
