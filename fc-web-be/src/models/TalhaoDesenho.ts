// models/TalhaoDesenho.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

class TalhaoDesenho extends Model {}

TalhaoDesenho.init(
    {
        talhaoId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        desenhoGeometria: {
            type: DataTypes.GEOGRAPHY('POLYGON'),
            allowNull: false,
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
    },
    {
        sequelize,
        modelName: 'TalhaoDesenho',
        tableName: 'tbTalhaoDesenho',
        timestamps: false,
        createdAt: false,
        updatedAt: false
    }
);

export default TalhaoDesenho;
