import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import PessoaFisica from '../models/PessoaFisica';
import Login from '../models/Login';
import Perfil from '../models/Perfil';

const saltRounds = 10;

// Register new user
export async function registerUser(req: Request, res: Response) {
    try {
        const { nomeCompleto, email, documento, perfisIds } = req.body;

        const existingUser = await Login.findOne({ where: { providerValue: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já está em uso' });
        }

        const pessoaFisica = await PessoaFisica.create({
            id: crypto.randomUUID(),
            nomeCompleto,
            email,
            documento
        });

        const loginInstance = await Login.create({
            id: crypto.randomUUID(),
            provider: 'local',
            providerValue: email,
            pessoaFisicaId: pessoaFisica.id
        });

        if (perfisIds && Array.isArray(perfisIds)) {
            const perfis = await Perfil.findAll({ where: { id: perfisIds } });
            // Chama setPerfis na instância do login
            await loginInstance.setPerfis(perfis);  // Método deve estar disponível
        }

        res.status(201).json({ message: 'Usuário registrado com sucesso', pessoaFisica });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
}

// Autenticação do usuário
export async function authenticateUser(req: Request, res: Response) {
    try {
        const { email, providerToken } = req.body;

        console.log(`Autenticação iniciada para o usuário: ${email}`);

        // Encontrar o login pelo email
        const loginInstance = await Login.findOne({ where: { providerValue: email } });
        if (!loginInstance) {
            console.log(`Usuário não encontrado: ${email}`);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        console.log(`Usuário encontrado: ${loginInstance.id}`);

        // Verificar o token do provider, se fornecido
        if (providerToken && loginInstance.providerToken) {
            console.log(`Verificando token para o usuário: ${email}`);
            const tokenMatch = await bcrypt.compare(providerToken, loginInstance.providerToken);
            if (!tokenMatch) {
                console.log(`Token do provedor incorreto para o usuário: ${email}`);
                return res.status(401).json({ message: 'Token do provedor incorreto' });
            }
            console.log(`Token do provedor verificado com sucesso para o usuário: ${email}`);
        }

        res.json({ message: 'Autenticação bem-sucedida', login: loginInstance });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error); // Log detalhado do erro
        res.status(500).json({ message: 'Erro ao autenticar usuário', error });
    }
}

// Atualizar dados do usuário
export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nomeCompleto, email, perfisIds } = req.body;

        const pessoaFisica = await PessoaFisica.findByPk(id);
        if (!pessoaFisica) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        pessoaFisica.nomeCompleto = nomeCompleto;
        pessoaFisica.email = email;
        await pessoaFisica.save();

        // Atualizar perfis associados via login
        const loginInstance = await Login.findOne({ where: { pessoaFisicaId: id } });
        if (loginInstance && perfisIds && Array.isArray(perfisIds)) {
            const perfis = await Perfil.findAll({ where: { id: perfisIds } });
            await loginInstance.setPerfis(perfis);  // Método deve estar disponível
        }

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

export default { registerUser, authenticateUser, updateUser, deleteUser };
