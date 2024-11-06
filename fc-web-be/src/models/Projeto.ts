import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import PessoaFisica from './PessoaFisica';

export class Projeto extends Model {
    public id!: string;
    public nome!: string;
    public descricao!: string;
}

Projeto.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    nome: {
        type: DataTypes.STRING(500), // STRING(500) para corresponder ao DBO
        allowNull: false,
        field: 'Nome'
    },
    descricao: {
        type: DataTypes.STRING(1000), // STRING(1000) para corresponder ao DBO
        allowNull: true,
        field: 'Descricao'
    }
}, {
    sequelize,
    modelName: 'Projeto',
    tableName: 'tbProjeto',
    timestamps: false
});

export default Projeto;