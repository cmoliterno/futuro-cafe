import { Request, Response } from 'express';
import { Analise } from '../models/Analise';
import PessoaFisicaFazenda from '../models/PessoaFisicaFazenda'; // Importando o modelo do vínculo
import Talhao from '../models/Talhao';
import Fazenda from '../models/Fazenda'; // Para validar a fazenda
import { Op, Sequelize } from 'sequelize';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();
export async function getEstatisticas(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token);

        console.log('Pessoa ID:', pessoaId); // Log para verificar o ID da pessoa

        // Verifica se existem fazendas cadastradas através do vínculo
        const fazendasAssociadas = await PessoaFisicaFazenda.findAll({
            where: { PessoaFisicaId: pessoaId },
            attributes: ['fazendaId']
        });

        console.log('Fazendas associadas:', fazendasAssociadas); // Log para verificar as fazendas associadas

        if (fazendasAssociadas.length === 0) {
            return res.status(400).json({ message: 'Você precisa criar uma Fazenda antes de continuar.' });
        }

        const fazendaIds = fazendasAssociadas.map(f => f.fazendaId); // Extrair IDs das fazendas
        console.log('IDs das fazendas:', fazendaIds); // Log para verificar os IDs das fazendas

        // Verifica se existem talhões cadastrados
        const totalTalhoes = await Talhao.count({
            where: { fazendaId: { [Op.in]: fazendaIds } }
        });

        console.log('Total de talhões:', totalTalhoes); // Log para verificar o total de talhões

        if (totalTalhoes === 0) {
            return res.status(400).json({ message: 'Você precisa criar um Talhão antes de continuar.' });
        }

        const dataAtual = new Date();
        const primeiroDiaDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
        const ultimoDiaDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);

        const primeiroDiaDoMesPassado = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1);
        const ultimoDiaDoMesPassado = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0);

        // Obter IDs dos talhões relacionados ao usuário
        const talhoes = await Talhao.findAll({
            where: { fazendaId: { [Op.in]: fazendaIds } },
            attributes: ['id']
        });
        const talhaoIds = talhoes.map(t => t.id); // Agora é seguro usar map

        console.log('IDs dos talhões:', talhaoIds); // Log para verificar os IDs dos talhões

        // Total de análises do mês atual
        const totalAnalisesMesAtual = await Analise.count({
            where: {
                createdAt: {
                    [Op.between]: [primeiroDiaDoMesAtual, ultimoDiaDoMesAtual]
                },
                talhaoId: { [Op.in]: talhaoIds } // Usando os IDs dos talhões
            }
        });

        // Total de análises do mês passado
        const totalAnalisesMesPassado = await Analise.count({
            where: {
                createdAt: {
                    [Op.between]: [primeiroDiaDoMesPassado, ultimoDiaDoMesPassado]
                },
                talhaoId: { [Op.in]: talhaoIds } // Usando os IDs dos talhões
            }
        });

        // Aumento percentual
        const aumentoAnalisesRelacaoMesPassado = totalAnalisesMesPassado === 0
            ? (totalAnalisesMesAtual > 0 ? 100 : 0)
            : Math.ceil(((totalAnalisesMesAtual - totalAnalisesMesPassado) / totalAnalisesMesPassado) * 100);

        // Total de análises hoje
        const inicioDiaHoje = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
        const totalAnalisesHoje = await Analise.count({
            where: {
                createdAt: {
                    [Op.gte]: inicioDiaHoje
                },
                talhaoId: { [Op.in]: talhaoIds } // Usando os IDs dos talhões
            }
        });

        res.json({
            totalAnalisesMesAtual,
            aumentoAnalisesRelacaoMesPassado,
            totalAnalisesHoje,
            totalTalhoes
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ message: 'Erro ao buscar estatísticas', error });
    }
}

export async function getDataToChartBy(req: Request, res: Response) {
    try {
        const { farmId, plotId, startDate, endDate, reportType } = req.query;

        if (!farmId || !startDate || !endDate || !reportType) {
            return res.status(400).json({ message: 'Parâmetros insuficientes.' });
        }

        const start = new Date(String(startDate));
        const end = new Date(String(endDate));

        if (end > new Date()) {
            return res.status(400).json({ message: 'A data final não pode ser no futuro.' });
        }

        // Buscar a fazenda
        const fazenda = await Fazenda.findByPk(String(farmId));
        if (!fazenda) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }

        if (reportType === 'byFarm') {
            // Se for "Por Fazenda", buscamos todos os talhões da fazenda
            return await getDataForFarm(fazenda, start, end, res);
        } else if (reportType === 'byDate') {
            // Se for "Por Data", buscamos dados para um talhão específico
            if (!plotId) {
                return res.status(400).json({ message: 'Por favor, selecione um talhão para consulta por data.' });
            }
            return await getDataForPlot(fazenda, String(plotId), start, end, res);
        } else {
            return res.status(400).json({ message: 'Tipo de relatório inválido.' });
        }
    } catch (error) {
        console.error('Erro ao buscar dados para o Dashboard:', error);
        res.status(500).json({ message: 'Erro ao buscar dados para o Dashboard', error });
    }
}

// Função para dados por fazenda
const getDataForFarm = async (fazenda: any, start: Date, end: Date, res: Response) => {
    try {
        // Consultar todos os talhões da fazenda
        const talhoes = await Talhao.findAll({
            where: { fazendaId: fazenda.id },
        });

        if (talhoes.length === 0) {
            return res.status(404).json({ message: 'Nenhum talhão encontrado para essa fazenda.' });
        }

        // Buscar análises de todos os talhões no período
        const analises = await Analise.findAll({
            where: {
                talhaoId: {
                    [Op.in]: talhoes.map((talhao) => talhao.id),
                },
                createdAt: {
                    [Op.between]: [start, end],
                },
            },
            order: [['createdAt', 'ASC']],
        });

        if (analises.length === 0) {
            return res.status(204).json({ message: 'Nenhuma análise encontrada' });
        }

        // Agrupar as análises por talhão e por data
        const groupedByTalhao: { [key: string]: { [key: string]: { Green: number, GreenYellow: number, Cherry: number, Raisin: number, Dry: number } } } = {};

        analises.forEach((analysis) => {
            const talhaoId = analysis.talhaoId;
            const date = analysis.createdAt.toISOString().split('T')[0]; // Extrair a data sem a hora

            if (!groupedByTalhao[talhaoId]) {
                groupedByTalhao[talhaoId] = {};
            }

            if (!groupedByTalhao[talhaoId][date]) {
                groupedByTalhao[talhaoId][date] = { Green: 0, GreenYellow: 0, Cherry: 0, Raisin: 0, Dry: 0 };
            }

            groupedByTalhao[talhaoId][date].Green += analysis.green;
            groupedByTalhao[talhaoId][date].GreenYellow += analysis.greenYellow;
            groupedByTalhao[talhaoId][date].Cherry += analysis.cherry;
            groupedByTalhao[talhaoId][date].Raisin += analysis.raisin;
            groupedByTalhao[talhaoId][date].Dry += analysis.dry;
        });

        // Preparar os dados para o gráfico, agora agrupados por talhão
        const data: any[] = [];

        for (const talhaoId in groupedByTalhao) {
            const talhao = talhoes.find((t) => t.id === talhaoId);
            if (talhao) {
                const talhaoData = groupedByTalhao[talhaoId];
                const chartData = {
                    talhao: talhao.nome, // Nome do talhão
                    groupedData: talhaoData
                };
                data.push(chartData);
            }
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar dados para a fazenda:', error);
        res.status(500).json({ message: 'Erro ao buscar dados para a fazenda', error });
    }
};


// Função para dados por talhão
const getDataForPlot = async (fazenda: any, plotId: string, start: Date, end: Date, res: Response) => {
    try {
        // Verificar se o talhão pertence à fazenda
        const talhao = await Talhao.findOne({
            where: {
                id: plotId,
                fazendaId: fazenda.id,
            },
        });

        if (!talhao) {
            return res.status(404).json({ message: 'Talhão não encontrado ou não associado à fazenda fornecida' });
        }

        // Buscar análises para o talhão no período
        const analises = await Analise.findAll({
            where: {
                talhaoId: talhao.id,
                createdAt: {
                    [Op.between]: [start, end],
                },
            },
            order: [['createdAt', 'ASC']],
        });

        if (analises.length === 0) {
            return res.status(204).json({ message: 'Nenhuma análise encontrada para esse talhão no período.' });
        }

        // Agrupar as análises por dia
        const groupedByDay: { [key: string]: { Green: number, GreenYellow: number, Cherry: number, Raisin: number, Dry: number } } = {};

        analises.forEach((analysis) => {
            const date = analysis.createdAt.toISOString().split('T')[0]; // Extrair a data sem a hora
            if (!groupedByDay[date]) {
                groupedByDay[date] = { Green: 0, GreenYellow: 0, Cherry: 0, Raisin: 0, Dry: 0 };
            }

            groupedByDay[date].Green += analysis.green;
            groupedByDay[date].GreenYellow += analysis.greenYellow;
            groupedByDay[date].Cherry += analysis.cherry;
            groupedByDay[date].Raisin += analysis.raisin;
            groupedByDay[date].Dry += analysis.dry;
        });

        // Preparar os dados para o gráfico
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

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar dados para o talhão:', error);
        res.status(500).json({ message: 'Erro ao buscar dados para o talhão', error });
    }
}

export default { getEstatisticas, getDataToChartBy };
