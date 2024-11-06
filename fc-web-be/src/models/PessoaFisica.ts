import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';

class PessoaFisica extends Model {
    public id!: string;  // UUID para identificação
    public cpf!: string;  // CPF da pessoa
    public email!: string;  // Email da pessoa
    public emailUpdateToken?: string;  // Token de atualização do email
    public enderecoBairro?: string;  // Bairro do endereço
    public enderecoCep?: string;  // CEP do endereço
    public enderecoCidade?: string;  // Cidade do endereço
    public enderecoComplemento?: string;  // Complemento do endereço
    public enderecoEstado?: string;  // Estado do endereço
    public enderecoLogradouro?: string;  // Logradouro do endereço
    public enderecoNumero?: string;  // Número do endereço
    public nascimento?: Date;  // Data de nascimento
    public nomeCompleto!: string;  // Nome completo da pessoa
    public nomeSocial?: string;  // Nome social da pessoa
    public passwordHash?: string;  // Hash da senha
    public passwordResetToken?: string;  // Token para redefinição de senha
    public passwordResetTokenExpiry?: Date;  // Data de expiração do token
}

PessoaFisica.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'Id'
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        field: 'CPF'
    },
    email: {
        type: DataTypes.STRING(400),
        allowNull: true,
        field: 'Email'
    },
    emailUpdateToken: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'EmailUpdateToken'
    },
    enderecoBairro: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'EnderecoBairro'
    },
    enderecoCep: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: 'EnderecoCep'
    },
    enderecoCidade: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'EnderecoCidade'
    },
    enderecoComplemento: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'EnderecoComplemento'
    },
    enderecoEstado: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'EnderecoEstado'
    },
    enderecoLogradouro: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'EnderecoLogradouro'
    },
    enderecoNumero: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'EnderecoNumero'
    },
    nascimento: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'Nascimento'
    },
    nomeCompleto: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'NomeCompleto'
    },
    nomeSocial: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'NomeSocial'
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'PasswordHash'
    },
    passwordResetToken: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'PasswordResetToken'
    },
    passwordResetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'PasswordResetTokenExpiry'
    }
}, {
    sequelize,
    modelName: 'PessoaFisica',
    tableName: 'tbPessoaFisica',
    timestamps: false
});

export default PessoaFisica;
