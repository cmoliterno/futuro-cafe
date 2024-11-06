import { Request, Response } from 'express';
import { Analise } from '../models/Analise';
import Talhao from '../models/Talhao';
import { Op } from 'sequelize';

export async function getEstatisticas(req: Request, res: Response) {
    try {
        const pessoaId = req.headers.userId;

        const dataAtual = new Date();
        const primeiroDiaDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
        const ultimoDiaDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
        
        const primeiroDiaDoMesPassado = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1);
        const ultimoDiaDoMesPassado = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0);

        // Total de análises do mês atual
        const totalAnalisesMesAtual = await Analise.count({
            where: {
                createdAt: {
                    [Op.between]: [primeiroDiaDoMesAtual, ultimoDiaDoMesAtual]
                },
                '$Talhao.PessoaId$': pessoaId
            },
            include: [{ model: Talhao }]
        });

        // Total de análises do mês passado
        const totalAnalisesMesPassado = await Analise.count({
            where: {
                createdAt: {
                    [Op.between]: [primeiroDiaDoMesPassado, ultimoDiaDoMesPassado]
                },
                '$Talhao.PessoaId$': pessoaId
            },
            include: [{ model: Talhao }]
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
                '$Talhao.PessoaId$': pessoaId
            },
            include: [{ model: Talhao }]
        });

        // Total de talhões
        const totalTalhoes = await Talhao.count({
            where: { PessoaId: pessoaId }
        });

        res.json({
            totalAnalisesMesAtual,
            aumentoAnalisesRelacaoMesPassado,
            totalAnalisesHoje,
            totalTalhoes
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estatísticas', error });
    }
}

export default { getEstatisticas };
