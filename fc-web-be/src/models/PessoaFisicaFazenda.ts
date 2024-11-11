import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import Fazenda from './Fazenda'; // Importando o modelo Fazenda

class PessoaFisicaFazenda extends Model {
    public id!: string;
    public fazendaId!: string;
    public pessoaFisicaId!: string;
    public createdAt!: Date;
    public lastUpdatedAt!: Date;

    // Adicionando a propriedade Fazenda
    public Fazenda?: Fazenda;
}

PessoaFisicaFazenda.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    fazendaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'FazendaId'
    },
    pessoaFisicaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'PessoaFisicaId'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'CreatedAt'
    },
    lastUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'LastUpdatedAt'
    }
}, {
    sequelize,
    modelName: 'PessoaFisicaFazenda',
    tableName: 'tbPessoaFisicaFazenda',
    timestamps: false
});

export default PessoaFisicaFazenda;
