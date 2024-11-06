import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class Fazenda extends Model {
    public id!: string;
    public nome!: string;
}

Fazenda.init({
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
    modelName: 'Fazenda',
    tableName: 'tbFazenda',
    timestamps: false // Definido como false
});

export default Fazenda;