import { Request, Response } from 'express';
import Role from '../models/Role';
import Perfil from '../models/Perfil';

export async function getAllRoles(req: Request, res: Response) {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar roles', error });
    }
}

export async function getRoleById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id, {
            include: [{ model: Perfil }]
        });

        if (!role) {
            return res.status(404).json({ message: 'Role não encontrada' });
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar role', error });
    }
}

export async function createRole(req: Request, res: Response) {
    try {
        const { nome, descricao, systemKey, aplicacao } = req.body;
        const role = await Role.create({ nome, descricao, systemKey, aplicacao });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar role', error });
    }
}

export async function updateRole(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, descricao, systemKey, aplicacao } = req.body;
        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({ message: 'Role não encontrada' });
        }

        role.descricao = descricao;
        role.systemKey = systemKey;
        role.aplicacao = aplicacao;
        await role.save();

        res.json(role);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar role', error });
    }
}

export async function deleteRole(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({ message: 'Role não encontrada' });
        }

        await role.destroy();
        res.json({ message: 'Role excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir role', error });
    }
}

export default { getAllRoles, getRoleById, createRole, updateRole, deleteRole };