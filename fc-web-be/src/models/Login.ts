import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import Role from './Role';

class Login extends Model {
    public id!: string;  // UUID para identificação
    public provider!: string;  // Nome do provedor
    public providerValue!: string;  // Valor do provedor (substituindo o email)
    public providerToken!: string;  // Token do provedor
    public pessoaFisicaId!: string;  // ID da pessoa física associado
    public createdAt!: Date;  // Data de criação
    public lastUpdatedAt!: Date;  // Data da última atualização
}

Login.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'Provider'
    },
    providerValue: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ProviderValue'
    },
    providerToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'ProviderToken'
    },
    pessoaFisicaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'PessoaFisicaId'
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
    modelName: 'Login',
    tableName: 'tbLogin',
    timestamps: false
});

// Adiciona associação com Role através da tabela de junção tbLoginRole
Login.belongsToMany(Role, {
    through: 'tbLoginRole',
    foreignKey: 'LoginId',
    otherKey: 'RoleId',
    timestamps: false
});

export default Login;
