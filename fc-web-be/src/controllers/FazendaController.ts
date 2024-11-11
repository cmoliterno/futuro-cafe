import { Request, Response } from 'express';
import { Fazenda } from '../models/Fazenda';
import Talhao from '../models/Talhao';
import jwt from 'jsonwebtoken';
import PessoaFisicaFazenda from "../models/PessoaFisicaFazenda";

export async function getAllFazendas(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string }; // Decodifica o token
        const pessoaId = decoded.userId; // Extraindo o userId do token

        // Obtém as fazendas associadas ao usuário
        const fazendasAssociadas = await PessoaFisicaFazenda.findAll({
            where: { pessoaFisicaId: pessoaId } // Filtrando pelo ID da pessoa
        });

        // Extrai apenas os IDs das fazendas
        const fazendaIds = fazendasAssociadas.map(pff => pff.fazendaId);

        // Busca as fazendas correspondentes
        const fazendas = await Fazenda.findAll({
            where: {
                id: fazendaIds // Filtrando as fazendas pelos IDs obtidos
            }
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
        const { nome } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        const pessoaId = decoded.userId; // Extraindo o userId do token

        // Criar a fazenda com as datas
        const fazenda = await Fazenda.create({
            nome,
            createdAt: new Date(),
            lastUpdatedAt: new Date()
        });

        // Criar a referência na tabela PessoaFisicaFazenda
        await PessoaFisicaFazenda.create({
            fazendaId: fazenda.id, // Referenciando a nova fazenda
            pessoaFisicaId: pessoaId, // Referenciando a pessoa física
            createdAt: new Date(), // Definindo a data de criação
            lastUpdatedAt: new Date() // Definindo a data de última atualização
        });

        res.status(201).json(fazenda);
    } catch (error) {
        console.error('Erro ao criar fazenda:', error);
        res.status(500).json({ message: 'Erro ao criar fazenda', error });
    }
}


export async function deleteFazenda(req: Request, res: Response) {
    try {
        const { id } = req.params;
        // Primeiro, removemos a referência na tabela PessoaFisicaFazenda
        await PessoaFisicaFazenda.destroy({ where: { fazendaId: id } });
        // Agora podemos deletar a fazenda
        await Fazenda.destroy({ where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar fazenda', error });
    }
}


// Atualizar uma fazenda
export const updateFazenda = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        const fazenda = await Fazenda.findByPk(id);
        if (!fazenda) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }

        // Atualiza o nome da fazenda
        fazenda.nome = nome;
        await fazenda.save();

        res.json({ message: 'Fazenda atualizada com sucesso', fazenda });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar fazenda', error });
    }
};

export default { getAllFazendas, getFazendaById, createFazenda, updateFazenda, deleteFazenda };
