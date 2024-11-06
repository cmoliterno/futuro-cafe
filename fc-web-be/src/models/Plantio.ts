import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

export class Plantio extends Model {
    public id!: number;
    public data!: Date;
    public espacamentoLinhasMetros!: number;
    public espacamentoMudasMetros!: number;
    public cultivarId!: number;  // ID do cultivar associado
    public talhaoId!: number;     // ID do talhão associado
}

Plantio.init({
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
    espacamentoLinhasMetros: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'EspacamentoLinhasMetros'
    },
    espacamentoMudasMetros: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'EspacamentoMudasMetros'
    },
    cultivarId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CultivarId'
    },
    talhaoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'TalhaoId'
    }
}, {
    sequelize,
    modelName: 'Plantio',
    tableName: 'tbPlantio',
    timestamps: true // Se necessário para CreatedAt/LastUpdatedAt
});

export default Plantio;
