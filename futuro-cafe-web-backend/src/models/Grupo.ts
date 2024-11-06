import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import PessoaFisica from './PessoaFisica';

export class Grupo extends Model {
    public id!: string;
    public nome!: string;
}

Grupo.init({
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
    }
}, {
    sequelize,
    modelName: 'Grupo',
    tableName: 'tbGrupo',
    timestamps: false
});

export default Grupo;