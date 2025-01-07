import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import PessoaFisica from './PessoaFisica';

export class Grupo extends Model {
    public id!: string;
    public nome!: string;
    public pessoaFisicaId!: string;
    public createdAt!: Date;
    public lastUpdatedAt!: Date;
}

Grupo.init({
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
    pessoaFisicaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'PessoaFisicaId',
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
    modelName: 'Grupo',
    tableName: 'tbGrupo',
    timestamps: false
});

export default Grupo;
