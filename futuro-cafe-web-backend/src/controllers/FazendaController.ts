import { Request, Response } from 'express';
import { Fazenda } from '../models/Fazenda';
import Talhao from '../models/Talhao';


export async function getAllFazendas(req: Request, res: Response) {
    try {
        const fazendas = await Fazenda.findAll();
        res.json(fazendas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar fazendas', error });
    }
}

export async function getFazendaById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const fazenda = await Fazenda.findByPk(id, {
            include: [{ model: Talhao }]
        });

        if (!fazenda) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }

        res.json(fazenda);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar fazenda', error });
    }
}

export async function createFazenda(req: Request, res: Response) {
    try {
        const { nome, area } = req.body;
        const fazenda = await Fazenda.create({ nome, area });
        res.status(201).json(fazenda);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar fazenda', error });
    }
}

// Atualizar uma fazenda
export const updateFazenda = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Fazenda.update(req.body, { where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar fazenda', error });
    }
};

// Deletar uma fazenda
export const deleteFazenda = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Fazenda.destroy({ where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar fazenda', error });
    }
};
export default { getAllFazendas, getFazendaById, createFazenda, updateFazenda, deleteFazenda };
