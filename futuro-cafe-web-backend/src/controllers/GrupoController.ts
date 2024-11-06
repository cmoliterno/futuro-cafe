import { Request, Response } from 'express';
import { Grupo } from '../models/Grupo';
import Login from '../models/Login';

export async function getAllGrupos(req: Request, res: Response) {
    try {
        const grupos = await Grupo.findAll();
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
        const grupo = await Grupo.create({ nome, descricao });
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
