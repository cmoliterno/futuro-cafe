import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

class PessoaFisicaFazenda extends Model {
    public id!: string;  // UUID para identificação
    public fazendaId!: string;  // ID da Fazenda
    public pessoaFisicaId!: string;  // ID da Pessoa Física
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
    }
}, {
    sequelize,
    modelName: 'PessoaFisicaFazenda',
    tableName: 'tbPessoaFisicaFazenda',
    timestamps: false
});

export default PessoaFisicaFazenda;
