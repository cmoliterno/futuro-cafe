import { Request, Response } from 'express';
import { Analise } from '../models/Analise';
import Talhao from '../models/Talhao';
import Fazenda from '../models/Fazenda';
import PessoaFisicaFazenda from '../models/PessoaFisicaFazenda'; // Importando o modelo do vínculo
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken'; // Para decodificar o token

export async function getEstatisticas(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret'); // Decodifica o token
        const pessoaId = decoded.userId; // Extraindo o userId do token

        // Verifica se existem fazendas cadastradas através do vínculo
        const fazendasAssociadas = await PessoaFisicaFazenda.count({
            where: { PessoaFisicaId: pessoaId } // Relacionamento com PessoaFisica
        });

        if (fazendasAssociadas === 0) {
            return res.status(400).json({ message: 'Você precisa criar uma Fazenda antes de continuar.' });
        }

        // Verifica se existem talhões cadastrados
        const totalTalhoes = await Talhao.count({
            where: { PessoaId: pessoaId } // Ajuste conforme necessário
        });

        if (totalTalhoes === 0) {
            return res.status(400).json({ message: 'Você precisa criar um Talhão antes de continuar.' });
        }

        const dataAtual = new Date();
        const primeiroDiaDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
        const ultimoDiaDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);

        const primeiroDiaDoMesPassado = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1);
        const ultimoDiaDoMesPassado = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0);

        // Obter IDs dos talhões relacionados ao usuário
        const talhoes = await Talhao.findAll({ where: { PessoaId: pessoaId }, attributes: ['id'] });
        const talhaoIds = talhoes.map(t => t.id); // Agora é seguro usar map

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

export default { getEstatisticas };
