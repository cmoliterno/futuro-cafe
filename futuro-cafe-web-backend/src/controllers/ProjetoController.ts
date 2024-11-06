import { Request, Response } from 'express';
import { Projeto } from '../models/Projeto';
import { Grupo } from '../models/Grupo';

export async function getAllProjetos(req: Request, res: Response) {
    try {
        const projetos = await Projeto.findAll();
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
        const { nome, descricao, dataInicio, dataFim, grupoId } = req.body;
        const projeto = await Projeto.create({
            nome,
            descricao,
            dataInicio,
            dataFim,
            grupoId
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
