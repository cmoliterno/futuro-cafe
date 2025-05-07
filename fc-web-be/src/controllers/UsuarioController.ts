import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import crypto from 'crypto';
import Pessoa from '../models/Pessoa';
import PessoaFisica from '../models/PessoaFisica';
import Login from '../models/Login';
import { AuthService } from "../services/AuthService";
import nodemailer from "nodemailer";

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

// Função para obter os detalhes do usuário logado
export async function getUserDetails(req: Request, res: Response) {
    try {
        // Extrai o token e verifica sua validade
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Verifica o token e extrai o ID do usuário
        const pessoaId = authService.verifyToken(token)?.userId;
        if (!pessoaId) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }

        // Busca os detalhes do usuário usando o ID
        const pessoaFisica = await PessoaFisica.findOne({
            where: { id: pessoaId },
            attributes: [
                'nomeCompleto',
                'email',
                'enderecoCep',
                'enderecoLogradouro',
                'enderecoCidade',
                'enderecoComplemento',
                'enderecoBairro',
                'enderecoNumero',
                'enderecoEstado'
            ]
        });

        if (!pessoaFisica) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Formata a resposta no padrão solicitado
        const responseData = {
            result: {
                nomeCompleto: pessoaFisica.nomeCompleto,
                email: pessoaFisica.email,
                enderecoCep: pessoaFisica.enderecoCep,
                enderecoLogradouro: pessoaFisica.enderecoLogradouro,
                enderecoCidade: pessoaFisica.enderecoCidade,
                enderecoComplemento: pessoaFisica.enderecoComplemento,
                enderecoBairro: pessoaFisica.enderecoBairro,
                enderecoNumero: pessoaFisica.enderecoNumero,
                enderecoEstado: pessoaFisica.enderecoEstado
            },
            success: true,
            messages: [],
            hasErrors: false,
            hasImpediments: false,
            hasWarnings: false
        };

        res.json(responseData);
    } catch (error) {
        console.error('Erro ao obter detalhes do usuário:', error);
        res.status(500).json({ message: 'Erro ao obter detalhes do usuário', error });
    }
}

export async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
        // Encontrar o usuário pelo email
        const pessoaFisica = await PessoaFisica.findOne({ where: { email } });
        if (!pessoaFisica) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gerar um token único para redefinir a senha
        const resetToken = crypto.randomUUID();  // Gerar um UUID válido

        const resetTokenExpiration = new Date(Date.now() + 3600000);

        // Formatar para 'yyyy-MM-dd HH:mm:ss.SSS +0000' para o tipo datetimeoffset
        const formattedExpirationDate = resetTokenExpiration.toISOString();

        // Atualizar a pessoa fisica com o token e a data de expiração
        pessoaFisica.passwordResetToken = resetToken;
        pessoaFisica.passwordResetExpires = formattedExpirationDate;
        await pessoaFisica.save();

        // Configurar o transporte de email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Configurar o email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Redefinir Senha',
            text: `Olá, para redefinir sua senha, clique no link abaixo:\n\n` +
                `${process.env.BASE_URL}/reset-password/${resetToken}\n\n` +
                `Este link expira em 1 hora.`,
        };

        // Enviar o email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Instruções para redefinir a senha foram enviadas para o seu email.',
        });
    } catch (error) {
        console.error('Erro ao processar solicitação de redefinição de senha:', error);
        res.status(500).json({ message: 'Erro ao enviar o email de redefinição de senha.' });
    }
}

export async function resetPassword(req: Request, res: Response) {
    const { newPassword } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    const pessoaId = authService.verifyToken(token)?.userId;

    try {
        // Encontrar o usuário pelo token
        const pessoaFisica = await PessoaFisica.findOne({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { [Op.gt]: new Date() },
            },
        });

        if (!pessoaFisica) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        // Atualizar a senha do usuário
        const hashedPassword = await authService.hashPassword(newPassword);
        pessoaFisica.passwordHash = hashedPassword;
        pessoaFisica.passwordResetToken = null; // Limpa o token de redefinição
        pessoaFisica.passwordResetExpires = null; // Limpa a data de expiração
        await pessoaFisica.save();

        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ message: 'Erro ao redefinir a senha.' });
    }
}

export default { registerUser, authenticateUser, updateUser, deleteUser, refreshAccessToken, getUserDetails,  };
