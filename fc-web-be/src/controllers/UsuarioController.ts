import { Request, Response } from 'express';
import { sequelize } from '../services/DatabaseService';
import crypto from 'crypto';
import Pessoa from '../models/Pessoa';
import PessoaFisica from '../models/PessoaFisica';
import Login from '../models/Login';
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

// Função para criar hash da senha com a PassPhrase
function createPasswordHash(password: string, salt: string): string {
    const passphrase = process.env.CIPHER_PASS_PHRASE;
    if (!passphrase) {
        throw new Error('PassPhrase não está definida no .env');
    }

    const hash = crypto.createHmac('sha256', passphrase + salt)
        .update(password)
        .digest('hex');
    return hash;
}

export const refreshAccessToken = (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token não fornecido' });
    }

    const newAccessToken = authService.refreshAccessToken(refreshToken);
    if (!newAccessToken) {
        return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
    }

    return res.json({ accessToken: newAccessToken });
};

export async function registerUser(req: Request, res: Response) {
    const transaction = await sequelize.transaction(); // Inicia a transação
    try {
        const { nomeCompleto, email, documento, password, cpf } = req.body;

        console.log('Dados recebidos para registro:', req.body);

        if (!cpf) {
            return res.status(400).json({ message: 'CPF é obrigatório' });
        }

        // Limpeza do CPF
        const cpfLimpo = cpf.replace(/\D/g, '');  // Remove todos os caracteres não numéricos

        console.log('CPF limpo para consulta:', cpfLimpo);

        const existingUser = await Login.findOne({ where: { providerValue: email }, transaction });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já está em uso' });
        }

        const existingCpf = await PessoaFisica.findOne({ where: { CPF: cpfLimpo }, transaction });
        if (existingCpf) {
            return res.status(400).json({ message: 'CPF já está em uso' });
        }

        // Verifica se a senha está vazia ou não
        if (!password) {
            return res.status(400).json({ message: 'Senha é obrigatória' });
        }

        const salt = crypto.randomUUID(); // Gera um salt
        const hashedPassword = createPasswordHash(password, salt); // Cria hash da senha

        // Cria uma nova instância de Pessoa
        const pessoaId = crypto.randomUUID(); // Gera um novo ID para a Pessoa
        await Pessoa.create({
            id: pessoaId, // Usando o ID gerado
            natureza: 'Física' // Definindo a natureza como "Física"
        }, { transaction });

        // Cria uma nova instância de PessoaFisica
        const pessoaFisica = await PessoaFisica.create({
            id: pessoaId,
            nomeCompleto,
            email,
            documento,
            cpf: cpfLimpo,  // Passando o CPF limpo
            passwordHash: JSON.stringify({ Hash: hashedPassword, Salt: salt }),
        }, { transaction });

        const loginInstance = await Login.create({
            id: crypto.randomUUID(),
            provider: 'local',
            providerValue: email,
            pessoaFisicaId: pessoaFisica.id,
        }, { transaction });

        await transaction.commit(); // Confirma a transação
        res.status(201).json({ message: 'Usuário registrado com sucesso', pessoaFisica });
    } catch (error) {
        await transaction.rollback(); // Desfaz a transação em caso de erro
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
}

// Autenticação de usuário
export async function authenticateUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        console.log('Autenticação iniciada para o usuário:', email);

        // Encontrar a pessoa física pelo email
        const pessoaFisica = await PessoaFisica.findOne({ where: { email } });
        if (!pessoaFisica) {
            console.warn('Usuário não encontrado:', email);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se passwordHash é válido
        if (!pessoaFisica.passwordHash) {
            console.warn('Hash de senha não encontrado para o usuário:', email);
            return res.status(500).json({ message: 'Dados de senha inválidos' });
        }

        let storedPasswordData;
        try {
            storedPasswordData = JSON.parse(pessoaFisica.passwordHash);
        } catch (error) {
            console.error('Erro ao analisar o hash da senha:', error);
            return res.status(500).json({ message: 'Erro ao analisar os dados de senha' });
        }

        const storedHash = storedPasswordData.Hash;
        const storedSalt = storedPasswordData.Salt;

        console.log('Autenticação storedPasswordHash:', storedPasswordData);

        // Criar hash da senha fornecida usando a mesma PassPhrase e salt
        const hashedPassword = createPasswordHash(password, storedSalt);

        console.log('Autenticação hashedPassword:', hashedPassword);

        // Comparar o hash da senha armazenada com o hash da senha fornecida
        if (hashedPassword !== storedHash) {
            console.warn('Senha incorreta para o usuário:', email);
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gerar token
        const token = authService.generateToken(pessoaFisica.id);

        // Formatar a resposta
        const responseData = {
            result: {
                accessToken: token,
                refreshToken: storedHash, // Ajuste se necessário
                // expiresIn: new Date(Date.now() + 3600 * 1000).toISOString(), // Exemplo de expiração em 1 hora
                tokenType: 'Bearer'
            },
            success: true,
            messages: [],
            hasErrors: false,
            hasImpediments: false,
            hasWarnings: false
        };

        console.log('Autenticação bem-sucedida para o usuário:', email);
        res.json(responseData);
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ message: 'Erro ao autenticar usuário', error });
    }
}

// Atualizar dados do usuário
export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nomeCompleto, email } = req.body; // Removido perfisIds

        const pessoaFisica = await PessoaFisica.findByPk(id);
        if (!pessoaFisica) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Atualiza os campos do usuário
        pessoaFisica.nomeCompleto = nomeCompleto;
        pessoaFisica.email = email;
        await pessoaFisica.save();

        // Removido código para atualizar perfis, pois não é mais aplicável

        res.json({ message: 'Usuário atualizado com sucesso', pessoaFisica });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error });
    }
}

// Excluir usuário
export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const pessoaFisica = await PessoaFisica.findByPk(id);
        if (!pessoaFisica) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Excluir login associado
        const loginInstance = await Login.findOne({ where: { pessoaFisicaId: id } });
        if (loginInstance) {
            await loginInstance.destroy();
        }

        // Excluir pessoa física
        await pessoaFisica.destroy();
        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário', error });
    }
}

export default { registerUser, authenticateUser, updateUser, deleteUser, refreshAccessToken };
