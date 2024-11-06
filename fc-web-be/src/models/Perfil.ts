import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

class Perfil extends Model {
    public id!: string;  // UUID para identificação
    public descricao?: string;  // Descrição do perfil (opcional)
    public nome!: string;  // Nome do perfil
    public systemKey!: string;  // Chave do sistema
    public createdAt!: Date;  // Data de criação
    public lastUpdatedAt!: Date;  // Data da última atualização
}

Perfil.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    descricao: {
        type: DataTypes.STRING,  // Tipo NVARCHAR padrão
        allowNull: true,
        field: 'Descricao'
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Nome'
    },
    systemKey: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'SystemKey'
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
    },
}, {
    sequelize,
    modelName: 'Perfil',
    tableName: 'tbPerfil',
    timestamps: false  // Desativado se você estiver gerenciando timestamps manualmente
});

export default Perfil;
