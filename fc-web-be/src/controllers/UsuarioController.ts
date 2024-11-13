import { Request, Response } from 'express';
import { sequelize } from '../services/DatabaseService';
import crypto from 'crypto';
import Pessoa from '../models/Pessoa';
import PessoaFisica from '../models/PessoaFisica';
import Login from '../models/Login';
import { AuthService } from "../services/AuthService";

const authService = new AuthService();


// Função para registrar um novo usuário
export async function registerUser(req: Request, res: Response) {
    const transaction = await sequelize.transaction();
    try {
        const { nomeCompleto, email, documento, password, cpf } = req.body;

        if (!cpf || !password) {
            return res.status(400).json({ message: 'CPF e senha são obrigatórios' });
        }

        const cpfLimpo = cpf.replace(/\D/g, '');

        const existingUser = await Login.findOne({ where: { providerValue: email }, transaction });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já está em uso' });
        }

        const existingCpf = await PessoaFisica.findOne({ where: { CPF: cpfLimpo }, transaction });
        if (existingCpf) {
            return res.status(400).json({ message: 'CPF já está em uso' });
        }

        const hashedPassword = await authService.hashPassword(password);
        const pessoaId = crypto.randomUUID();

        await Pessoa.create({ id: pessoaId, natureza: 'Física' }, { transaction });
        const pessoaFisica = await PessoaFisica.create({
            id: pessoaId,
            nomeCompleto,
            email,
            documento,
            cpf: cpfLimpo,
            passwordHash: hashedPassword,
        }, { transaction });

        await Login.create({
            id: crypto.randomUUID(),
            provider: 'local',
            providerValue: email,
            pessoaFisicaId: pessoaFisica.id,
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Usuário registrado com sucesso', pessoaFisica });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
}

// Função para autenticar o usuário
export async function authenticateUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const pessoaFisica = await PessoaFisica.findOne({ where: { email } });
        if (!pessoaFisica || !pessoaFisica.passwordHash) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = await authService.comparePassword(password, pessoaFisica.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        const accessToken = authService.generateToken(pessoaFisica.id);
        const refreshToken = authService.generateRefreshToken(pessoaFisica.id);

        const responseData = {
            result: {
                accessToken: accessToken,
                refreshToken: refreshToken, // Ajuste se necessário
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

// Função para renovar o token de acesso
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
