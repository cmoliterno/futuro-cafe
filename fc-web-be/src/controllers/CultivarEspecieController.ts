import { Request, Response } from 'express';
import { CultivarEspecie } from '../models/CultivarEspecie';

// Listar todas as espécies de cultivares
export async function getAllCultivarEspecies(req: Request, res: Response) {
    try {
        console.log('Buscando todas as espécies de cultivares');
        const especies = await CultivarEspecie.findAll();
        console.log('Espécies encontradas:', especies.length);
        res.json(especies);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar espécies de cultivares', error });
    }
}

// Obter espécie de cultivar por ID
export async function getCultivarEspecieById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const especie = await CultivarEspecie.findByPk(id);

        if (!especie) {
            return res.status(404).json({ message: 'Espécie de cultivar não encontrada' });
        }

        res.json(especie);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar espécie de cultivar', error });
    }
}
