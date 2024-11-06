import { Request, Response } from 'express';
import { Cultivar } from '../models/Cultivar';
import { CultivarEspecie } from '../models/CultivarEspecie'; // Importa o modelo de espécie
import Plantio from '../models/Plantio';

// Listar todos os cultivares
export async function getAllCultivares(req: Request, res: Response) {
    try {
        const cultivares = await Cultivar.findAll();
        res.json(cultivares);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cultivares', error });
    }
}

// Obter cultivar por ID
export async function getCultivarById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cultivar = await Cultivar.findByPk(id);

        if (!cultivar) {
            return res.status(404).json({ message: 'Cultivar não encontrado' });
        }

        res.json(cultivar);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cultivar', error });
    }
}

// Criar um novo cultivar
export async function createCultivar(req: Request, res: Response) {
    try {
        const { nome, especie, dataPlantio, espacamentoLinhasMetros, espacamentoMudasMetros, talhaoId } = req.body;

        // Verificar se a espécie já existe
        let cultivarEspecie = await CultivarEspecie.findOne({ where: { Nome: especie } });
        
        if (!cultivarEspecie) {
            // Se não existir, criar uma nova espécie
            cultivarEspecie = await CultivarEspecie.create({ Nome: especie });
        }

        // Criar o cultivar com a ID da espécie
        const cultivar = await Cultivar.create({
            nome,
            cultivarEspecieId: cultivarEspecie.id // Associa a ID da espécie
        });

        // Criar um novo plantio associado ao cultivar
        await Plantio.create({
            data: dataPlantio,
            espacamentoLinhasMetros,
            espacamentoMudasMetros,
            cultivarId: cultivar.id,  // Associa o plantio ao cultivar recém-criado
            talhaoId  // Associa o plantio ao talhão se fornecido
        });

        res.status(201).json(cultivar);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cultivar', error });
    }
}


// Atualizar um cultivar
export async function updateCultivar(req: Request, res: Response) {
    try {
        const { id } = req.params; // Obtém o ID do cultivar a ser atualizado
        const { nome, cultivarEspecieId } = req.body; // Obtém os novos dados do corpo da requisição

        // Busca o cultivar pelo ID
        const cultivar = await Cultivar.findByPk(id);
        if (!cultivar) {
            return res.status(404).json({ message: 'Cultivar não encontrado' });
        }

        // Atualiza os campos do cultivar
        if (nome) {
            cultivar.nome = nome; // Atualiza o nome se fornecido
        }
        if (cultivarEspecieId) {
            cultivar.cultivarEspecieId = cultivarEspecieId; // Atualiza a ID da espécie se fornecida
        }

        // Salva as alterações
        await cultivar.save();

        // Retorna o cultivar atualizado
        res.json(cultivar);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar cultivar', error });
    }
}

// Excluir um cultivar
export async function deleteCultivar(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cultivar = await Cultivar.findByPk(id);

        if (!cultivar) {
            return res.status(404).json({ message: 'Cultivar não encontrado' });
        }

        await cultivar.destroy();
        res.json({ message: 'Cultivar excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir cultivar', error });
    }
}

export default { getAllCultivares, getCultivarById, createCultivar, updateCultivar, deleteCultivar };
