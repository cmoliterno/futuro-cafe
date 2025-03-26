import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import CultivarEspecie from './CultivarEspecie';

export class Cultivar extends Model {
    public id!: number;
    public nome!: string;
    public mantenedor!: string;  // Avaliar necessidade
    public registro!: string;
    public cultivarEspecieId!: number;  // ID da espécie do cultivar
}

Cultivar.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'Id'
    },
    nome: {
        type: DataTypes.STRING(500),  // STRING(500) para corresponder ao DBO
        allowNull: false,
        field: 'Nome'
    },
    mantenedor: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'Mantenedor'
    },
    registro: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Registro'
    },
    cultivarEspecieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CultivarEspecieId'  // Certifique-se de que este nome corresponde ao que está no banco de dados
    }
}, {
    sequelize,
    modelName: 'Cultivar',
    tableName: 'tbCultivar',
    timestamps: false
});

// Definindo a associação com CultivarEspecie
Cultivar.belongsTo(CultivarEspecie, { 
    foreignKey: 'cultivarEspecieId',
    as: 'cultivarEspecie' // Nome consistente da associação
});

export default Cultivar;
