import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class TalhaoManejo extends Model {
    public id!: number;
    public data!: Date;
    public talhaoId!: number;  // ID do talhão associado
    public manejoId!: number;   // ID do manejo associado
}

TalhaoManejo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'Id'
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'Data'
    },
    talhaoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'TalhaoId'
    },
    manejoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ManejoId'
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
    modelName: 'TalhaoManejo',
    tableName: 'tbTalhaoManejo',
    timestamps: true // Para manter registros de criação e atualização
});

export default TalhaoManejo;
