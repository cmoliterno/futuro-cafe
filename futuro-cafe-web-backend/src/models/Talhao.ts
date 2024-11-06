import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

class Talhao extends Model {
    public id!: string; // UUID para identificação
    public nome!: string; // Nome do talhão
    public fazendaId!: string; // ID da fazenda
}

Talhao.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Nome'
    },
    fazendaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'FazendaId'
    }
}, {
    sequelize,
    modelName: 'Talhao',
    tableName: 'tbTalhao',
    timestamps: true
});

export default Talhao;
