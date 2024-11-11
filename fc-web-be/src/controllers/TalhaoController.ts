import { Request, Response } from 'express';
import { Fazenda } from '../models/Fazenda';
import Talhao from '../models/Talhao';
import Plantio from '../models/Plantio'; // Importando o modelo Plantio
import jwt from 'jsonwebtoken';
import Analise from "../models/Analise";
import PessoaFisicaFazenda from '../models/PessoaFisicaFazenda';
import {Op, Sequelize} from "sequelize"; // Para vincular Fazenda à Pessoa

export async function getAllTalhoes(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        const pessoaId = decoded.userId;

        // Busca apenas os talhões que pertencem ao usuário através da Fazenda
        const talhoes = await Talhao.findAll({
            where: {
                fazendaId: {
                    [Op.in]: Sequelize.literal(`(SELECT FazendaId FROM tbPessoaFisicaFazenda WHERE PessoaFisicaId = '${pessoaId}')`)
                }
            }
        });

        res.json(talhoes);
    } catch (error) {
        console.error('Erro ao buscar talhões:', error);
        res.status(500).json({ message: 'Erro ao buscar talhões', error });
    }
}

export async function getTalhaoById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const talhao = await Talhao.findByPk(id, {
            include: [{ model: Fazenda }]
        });

        if (!talhao) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        res.json(talhao);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar talhão', error });
    }
}

export async function getTalhoesByFazenda(req: Request, res: Response) {
    try {
        console.log("ENTROU");

        const { fazendaId } = req.params; // Pegando o fazendaId da rota

        console.log("Chegou e a fazenda é: ",fazendaId);

        // Verifica se a fazenda existe
        const fazenda = await Fazenda.findByPk(fazendaId);
        if (!fazenda) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }
        console.log("Buscando Talhoes com fazenda: ",fazendaId);

        // Busca os talhões associados à fazenda
        const talhoes = await Talhao.findAll({
            where: { fazendaId }
        });

        res.json(talhoes);
    } catch (error) {
        console.error('Erro ao buscar talhões por fazenda:', error);
        res.status(500).json({ message: 'Erro ao buscar talhões por fazenda', error });
    }
}

export async function createTalhao(req: Request, res: Response) {
    try {
        const { nome, nomeResponsavel, fazendaId, dataPlantio, espacamentoLinhas, espacamentoMudas, cultivarId } = req.body;

        if (!nome || !fazendaId) {
            return res.status(400).json({ message: 'Nome e Fazenda ID são obrigatórios' });
        }

        const fazendaExists = await Fazenda.findByPk(fazendaId);
        if (!fazendaExists) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        const pessoaId = decoded.userId;

        const talhao = await Talhao.create({ nome, fazendaId });

        // Cadastro do Plantio
        if (dataPlantio && espacamentoLinhas && espacamentoMudas && cultivarId) {
            await Plantio.create({
                data: dataPlantio,
                espacamentoLinhasMetros: espacamentoLinhas,
                espacamentoMudasMetros: espacamentoMudas,
                cultivarId,
                talhaoId: talhao.id,
                createdAt: new Date(),
                lastUpdatedAt: new Date(),
            });
        }

        res.status(201).json(talhao);
    } catch (error) {
        console.error('Erro ao criar talhão:', error);
        res.status(500).json({ message: 'Erro ao criar talhão', error });
    }
}

export async function updateTalhao(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, nomeResponsavel, fazendaId } = req.body;

        const talhao = await Talhao.findByPk(id);
        if (!talhao) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        if (!nome || !fazendaId) {
            return res.status(400).json({ message: 'Nome e Fazenda ID são obrigatórios' });
        }

        const fazendaExists = await Fazenda.findByPk(fazendaId);
        if (!fazendaExists) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }

        talhao.nome = nome;
        talhao.fazendaId = fazendaId;
        await talhao.save();

        res.json({ message: 'Talhão atualizado com sucesso', talhao });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar talhão', error });
    }
}

export async function deleteTalhao(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Excluir todos os registros associados na tabela Plantio
        await Plantio.destroy({ where: { talhaoId: id } });

        const talhao = await Talhao.findByPk(id);
        if (!talhao) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        await talhao.destroy();
        res.json({ message: 'Talhão e seus plantios associados excluídos com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir talhão', error });
    }
}


// Obter análises de um talhão
export const getPlotAnalyses = async (req: Request, res: Response) => {
    const { talhaoId } = req.params;
    try {
        const talhaoExists = await Talhao.findByPk(talhaoId);
        if (!talhaoExists) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        const analyses = await Analise.findAll({ where: { TalhaoId: talhaoId } });
        res.json(analyses);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter análises do talhão', error });
    }
};

// Adicionar uma nova análise a um talhão
export const addPlotAnalysis = async (req: Request, res: Response) => {
    const { talhaoId } = req.params;
    const { argsString, formFile } = req.body; // Ajuste para sua estrutura de request

    try {
        const talhaoExists = await Talhao.findByPk(talhaoId);
        if (!talhaoExists) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        if (!formFile) {
            return res.status(400).json({ message: 'Arquivo de imagem não detectado' });
        }

        // Lógica para upload de imagem e predição de resultados (a ser implementada)
        const newAnalysis = await Analise.create({
            TalhaoId: talhaoId,
            // Inclua outras propriedades com base no seu modelo
        });

        res.status(201).json(newAnalysis);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar análise ao talhão', error });
    }
};

// Definindo a interface para os dados agrupados por dia
interface GroupedData {
    Green: number;
    GreenYellow: number;
    Cherry: number;
    Raisin: number;
    Dry: number;
}

// Obter gráficos de análises
export const getPlotAnalysesChart = async (req: Request, res: Response) => {
    const { talhaoId } = req.params;
    try {
        const talhaoExists = await Talhao.findByPk(talhaoId);
        if (!talhaoExists) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        const analyses = await Analise.findAll({
            where: { talhaoId: talhaoId },
            order: [['createdAt', 'ASC']],
        });

        if (analyses.length === 0) {
            return res.status(204).json({ message: 'Nenhuma análise encontrada' });
        }

        // Agrupamento por dia
        const groupedByDay: { [key: string]: GroupedData } = analyses.reduce((acc: { [key: string]: GroupedData }, analysis) => {
            const date = analysis.createdAt.toISOString().split('T')[0]; // Data sem hora
            if (!acc[date]) {
                acc[date] = {
                    Green: 0,
                    GreenYellow: 0,
                    Cherry: 0,
                    Raisin: 0,
                    Dry: 0
                };
            }

            acc[date].Green -= analysis.green; // Negativo, conforme sua lógica
            acc[date].GreenYellow -= analysis.greenYellow; // Usando a propriedade correta
            acc[date].Cherry += analysis.cherry; // Usando a propriedade correta
            acc[date].Raisin += analysis.raisin; // Usando a propriedade correta
            acc[date].Dry += analysis.dry; // Usando a propriedade correta

            return acc;
        }, {});

        // Preparando os dados para o gráfico
        const data = {
            Green: [] as number[],
            GreenYellow: [] as number[],
            Cherry: [] as number[],
            Raisin: [] as number[],
            Dry: [] as number[],
            labels: [] as string[],
        };

        Object.keys(groupedByDay).sort().forEach(date => {
            data.labels.push(date);
            data.Green.push(groupedByDay[date].Green);
            data.GreenYellow.push(groupedByDay[date].GreenYellow);
            data.Cherry.push(groupedByDay[date].Cherry);
            data.Raisin.push(groupedByDay[date].Raisin);
            data.Dry.push(groupedByDay[date].Dry);
        });

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter dados para gráfico', error });
    }
};

export default { getAllTalhoes, getTalhaoById, createTalhao, updateTalhao, deleteTalhao, getPlotAnalyses, addPlotAnalysis, getPlotAnalysesChart, getTalhoesByFazenda };
