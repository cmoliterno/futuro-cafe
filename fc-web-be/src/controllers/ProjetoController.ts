import { Request, Response } from 'express';
import { Projeto } from '../models/Projeto';
import { AuthService } from '../services/AuthService';
import Grupo from "../models/Grupo";

const authService = new AuthService();

export async function getAllProjetos(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;
        if (!pessoaId) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }

        const projetos = await Projeto.findAll({
            where: { pessoaFisicaId: pessoaId }
        });

        res.json(projetos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar projetos', error });
    }
}

export async function getProjetoById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const projeto = await Projeto.findByPk(id, {
            include: [{ model: Grupo }]
        });

        if (!projeto) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        res.json(projeto);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar projeto', error });
    }
}

export async function createProjeto(req: Request, res: Response) {
    try {
        const { nome, descricao, dataInicio, dataFim } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;
        if (!pessoaId) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }

        const projeto = await Projeto.create({
            nome,
            descricao,
            dataInicio,
            dataFim,
            pessoaFisicaId: pessoaId
        });

        res.status(201).json(projeto);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar projeto', error });
    }
}

// Atualizar um projeto
export const updateProjeto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Projeto.update(req.body, { where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar projeto', error });
    }
};

// Deletar um projeto
export const deleteProjeto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Projeto.destroy({ where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar projeto', error });
    }
};

export default { getAllProjetos, getProjetoById, createProjeto, updateProjeto, deleteProjeto };
