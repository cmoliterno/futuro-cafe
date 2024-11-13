import { Request, Response } from 'express';
import { Grupo } from '../models/Grupo';
import { AuthService } from '../services/AuthService';
import Login from "../models/Login";

const authService = new AuthService();

export async function getAllGrupos(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;
        if (!pessoaId) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }

        const grupos = await Grupo.findAll({
            where: { pessoaFisicaId: pessoaId }
        });

        res.json(grupos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar grupos', error });
    }
}

export async function getGrupoById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const grupo = await Grupo.findByPk(id, {
            include: [{ model: Login }]
        });

        if (!grupo) {
            return res.status(404).json({ message: 'Grupo não encontrado' });
        }

        res.json(grupo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar grupo', error });
    }
}

export async function createGrupo(req: Request, res: Response) {
    try {
        const { nome, descricao } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;
        if (!pessoaId) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }

        const grupo = await Grupo.create({
            nome,
            descricao,
            pessoaFisicaId: pessoaId
        });

        res.status(201).json(grupo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar grupo', error });
    }
}

// Atualizar um grupo
export const updateGrupo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Grupo.update(req.body, { where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar grupo', error });
    }
};

// Deletar um grupo
export const deleteGrupo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Grupo.destroy({ where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar grupo', error });
    }
};

export default { getAllGrupos, getGrupoById, createGrupo, updateGrupo, deleteGrupo };
