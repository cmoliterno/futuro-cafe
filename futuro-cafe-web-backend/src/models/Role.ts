import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

class Role extends Model {
    public id!: string;  // UUID para identificação
    public aplicacao!: string;  // Aplicação do papel
    public descricao?: string;  // Descrição do papel (opcional)
    public systemKey!: string;  // Chave do sistema
    public createdAt!: Date;  // Data de criação
    public lastUpdatedAt!: Date;  // Data da última atualização
}

Role.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    aplicacao: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'Aplicacao'
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'Descricao'
    },
    systemKey: {
        type: DataTypes.STRING(100),
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
    modelName: 'Role',
    tableName: 'tbRole',
    timestamps: false  // Desativado se você estiver gerenciando timestamps manualmente
});

export default Role;
