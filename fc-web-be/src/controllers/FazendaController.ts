import { Request, Response } from 'express';
import { Fazenda } from '../models/Fazenda';
import Talhao from '../models/Talhao';
import jwt from 'jsonwebtoken';
import PessoaFisicaFazenda from "../models/PessoaFisicaFazenda"; // Para decodificar o token

export async function getAllFazendas(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        console.log('Token recebido:', token); // Adicione esta linha para depuração

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string }; // Decodifica o token
        const pessoaId = decoded.userId; // Extraindo o userId do token

        const fazendas = await PessoaFisicaFazenda.findAll({
            where: { id: pessoaId },
        });

        res.json(fazendas);
    } catch (error) {
        console.error('Erro ao buscar fazendas:', error);
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
        const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string }; // Decodifica o token
        const pessoaId = decoded.userId; // Extraindo o userId do token

        const fazenda = await Fazenda.create({ nome, area, PessoaId: pessoaId }); // Adiciona o ID da pessoa
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
