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
            type: DataTypes.GEOMETRY('POLYGON'),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'TalhaoDesenho',
        tableName: 'tbTalhaoDesenho',
        timestamps: true,
    }
);

export default TalhaoDesenho;
