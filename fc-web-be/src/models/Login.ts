import { Model, DataTypes, Association, QueryTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import Perfil from './Perfil';

class Login extends Model {
    public id!: string;  // UUID para identificação
    public provider!: string;  // Nome do provedor
    public providerValue!: string;  // Valor do provedor (substituindo o email)
    public providerToken!: string;  // Token do provedor
    public pessoaFisicaId!: string;  // ID da pessoa física associado

    // Define associations
    public static associations: {
        perfis: Association<Login, Perfil>;
    };

    // Método customizado para associar perfis
    public async setPerfis(perfis: Perfil[]) {
        // Remove associações existentes
        await sequelize.query('DELETE FROM LoginPerfil WHERE LoginId = ?', {
            replacements: [this.id],
            type: QueryTypes.DELETE
        });

        // Adiciona as novas associações
        for (const perfil of perfis) {
            await sequelize.query('INSERT INTO LoginPerfil (LoginId, PerfilId) VALUES (?, ?)', {
                replacements: [this.id, perfil.id],
                type: QueryTypes.INSERT
            });
        }
    }
}

// Inicializa o modelo
Login.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    provider: {
        type: DataTypes.STRING(50),  // Campo para identificar o provedor
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
        allowNull: true,  // Pode ser nulo se não houver token
        field: 'ProviderToken'
    },
    pessoaFisicaId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'PessoaFisicaId'
    }
}, {
    sequelize,
    modelName: 'Login',
    tableName: 'tbLogin',
    timestamps: true  // Para manter registros de criação e atualização
});

// Define as associações
Login.belongsToMany(Perfil, { through: 'LoginPerfil', foreignKey: 'LoginId' });
Perfil.belongsToMany(Login, { through: 'LoginPerfil', foreignKey: 'PerfilId' });

export default Login;
