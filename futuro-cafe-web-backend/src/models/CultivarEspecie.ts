import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class CultivarEspecie extends Model {
    public id!: number;
    public nome!: string;
}

CultivarEspecie.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
    modelName: 'CultivarEspecie',
    tableName: 'tbCultivarEspecie',
    timestamps: false
});

export default CultivarEspecie;