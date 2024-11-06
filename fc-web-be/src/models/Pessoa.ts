import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class Pessoa extends Model {
    public id!: string;
    public natureza!: string;
}

Pessoa.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    natureza: {
        type: DataTypes.STRING(100), // STRING(100) para corresponder ao DBO
        allowNull: false,
        field: 'Natureza'
    }
}, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'tbPessoa',
    timestamps: false
});

export default Pessoa;