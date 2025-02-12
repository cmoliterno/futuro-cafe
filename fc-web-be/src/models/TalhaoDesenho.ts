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
            defaultValue: DataTypes.NOW, // Preencher automaticamente
            field: 'CreatedAt'
        },
        LastUpdatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Preencher automaticamente
            field: 'LastUpdatedAt'
        }
    },
    {
        sequelize,
        modelName: 'TalhaoDesenho',
        tableName: 'tbTalhaoDesenho',
        timestamps: true,
    }
);

export default TalhaoDesenho;
