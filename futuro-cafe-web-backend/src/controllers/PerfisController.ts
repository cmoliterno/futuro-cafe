import { Request, Response } from 'express';
import Perfil from '../models/Perfil';


export async function getAllPerfis(req: Request, res: Response) {
    try {
        const perfis = await Perfil.findAll();
        res.json(perfis);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfis', error });
    }
}

export async function getPerfilById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const perfil = await Perfil.findByPk(id);

        if (!perfil) {
            return res.status(404).json({ message: 'Perfil não encontrado' });
        }

        res.json(perfil);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil', error });
    }
}

export async function createPerfil(req: Request, res: Response) {
    try {
        const { nome, descricao, systemKey } = req.body;
        const perfil = await Perfil.create({ nome, descricao, systemKey });
        res.status(201).json(perfil);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar perfil', error });
    }
}

export async function updatePerfil(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, descricao, systemKey } = req.body;
        const perfil = await Perfil.findByPk(id);

        if (!perfil) {
            return res.status(404).json({ message: 'Perfil não encontrado' });
        }

        perfil.nome = nome;
        perfil.descricao = descricao;
        perfil.systemKey = systemKey;
        await perfil.save();

        res.json(perfil);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar perfil', error });
    }
}

export async function deletePerfil(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const perfil = await Perfil.findByPk(id);

        if (!perfil) {
            return res.status(404).json({ message: 'Perfil não encontrado' });
        }

        await perfil.destroy();
        res.json({ message: 'Perfil excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir perfil', error });
    }
}

export default { getAllPerfis, getPerfilById, createPerfil, updatePerfil, deletePerfil };