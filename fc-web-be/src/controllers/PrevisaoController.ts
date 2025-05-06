import { Request, Response } from 'express';
import { PrevisaoService } from '../services/PrevisaoService';
import Talhao from '../models/Talhao';
import Analise from '../models/Analise';
import Plantio from '../models/Plantio';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../services/DatabaseService';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

interface PrevisaoTalhao {
    id: string;
    nome: string;
    fazendaNome: string;
    sacasPorHectare: number;
    diasParaColheita: number;
    dataIdealColheita: Date;
    dataUltimaAnalise: Date;
}

interface TalhaoResult {
    Id: string;
    Nome: string;
    FazendaId: string;
    DataPlantio: string | null;
    PlantioId: string | null;
    FazendaNome: string;
}

export const calcularPrevisaoTalhao = async (req: Request, res: Response) => {
    try {
        const { talhaoId } = req.params;

        // Buscar talhão com suas informações relacionadas usando SQL
        const [talhao] = await sequelize.query<TalhaoResult>(`
            SELECT 
                t.*,
                tp.Id as PlantioId,
                tp.Data as DataPlantio
            FROM tbTalhao t
            LEFT JOIN tbPlantio tp ON t.Id = tp.TalhaoId
            WHERE t.Id = :talhaoId
        `, {
            replacements: { talhaoId },
            type: QueryTypes.SELECT
        });

        if (!talhao) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        // Buscar última análise do talhão
        const ultimaAnalise = await Analise.findOne({
            where: { talhaoId },
            order: [['createdAt', 'DESC']]
        });

        if (!ultimaAnalise) {
            return res.status(404).json({ message: 'Nenhuma análise encontrada para este talhão' });
        }

        // Calcular idade do talhão
        let idadePlantasTalhao = 0;
        if (talhao.DataPlantio) {
            const dataPlantio = new Date(talhao.DataPlantio);
            const hoje = new Date();
            
            if (dataPlantio <= hoje) {
                const diffTime = hoje.getTime() - dataPlantio.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                idadePlantasTalhao = Math.floor(diffDays / 365.25);
            }
        }

        const total = ultimaAnalise.total || 1; // Evita divisão por zero
        const dataUltimaColeta = new Date(ultimaAnalise.createdAt);
        const meses = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
        const mesColeta = meses[dataUltimaColeta.getMonth()];

        // Garantir que as porcentagens somem 1
        const porcentagens = {
            verde: ultimaAnalise.green / total,
            verdeCana: ultimaAnalise.greenYellow / total,
            cereja: ultimaAnalise.cherry / total,
            passa: ultimaAnalise.raisin / total,
            seco: ultimaAnalise.dry / total
        };

        const graosPorEstagio = {
            verde: ultimaAnalise.green || 0,
            verdeCana: ultimaAnalise.greenYellow || 0,
            cereja: ultimaAnalise.cherry || 0,
            passa: ultimaAnalise.raisin || 0,
            seco: ultimaAnalise.dry || 0
        };

        const previsao = PrevisaoService.calcularPrevisoes(
            idadePlantasTalhao,
            graosPorEstagio,
            porcentagens,
            mesColeta
        );

        res.json({
            ...previsao,
            dataUltimaAnalise: ultimaAnalise.createdAt
        });

    } catch (error) {
        console.error('Erro ao calcular previsão:', error);
        res.status(500).json({ message: 'Erro ao calcular previsão' });
    }
};

export const calcularPrevisaoTodasFazendas = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;
        if (!pessoaId) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }

        // Buscar todas as fazendas do usuário usando SQL
        const talhoes = await sequelize.query<TalhaoResult>(`
            SELECT 
                t.*,
                f.Nome as FazendaNome,
                tp.Id as PlantioId,
                tp.Data as DataPlantio
            FROM tbTalhao t
            INNER JOIN tbFazenda f ON t.FazendaId = f.Id
            LEFT JOIN tbPlantio tp ON t.Id = tp.TalhaoId
            WHERE f.Id IN (
                SELECT FazendaId 
                FROM tbPessoaFisicaFazenda 
                WHERE PessoaFisicaId = :pessoaId
            )
        `, {
            replacements: { pessoaId },
            type: QueryTypes.SELECT
        });

        const previsoes: PrevisaoTalhao[] = [];

        for (const talhao of talhoes) {
            try {
                const ultimaAnalise = await Analise.findOne({
                    where: { talhaoId: talhao.Id },
                    order: [['createdAt', 'DESC']]
                });

                if (!ultimaAnalise) continue;

                let idadePlantasTalhao = 0;
                if (talhao.DataPlantio) {
                    const dataPlantio = new Date(talhao.DataPlantio);
                    const hoje = new Date();
                    
                    if (dataPlantio <= hoje) {
                        const diffTime = hoje.getTime() - dataPlantio.getTime();
                        const diffDays = diffTime / (1000 * 60 * 60 * 24);
                        idadePlantasTalhao = Math.floor(diffDays / 365.25);
                    }
                }

                const total = ultimaAnalise.total || 1; // Evita divisão por zero
                const dataUltimaColeta = new Date(ultimaAnalise.createdAt);
                const meses = [
                    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
                ];
                const mesColeta = meses[dataUltimaColeta.getMonth()];

                // Garantir que as porcentagens somem 1
                const porcentagens = {
                    verde: ultimaAnalise.green / total,
                    verdeCana: ultimaAnalise.greenYellow / total,
                    cereja: ultimaAnalise.cherry / total,
                    passa: ultimaAnalise.raisin / total,
                    seco: ultimaAnalise.dry / total
                };

                const graosPorEstagio = {
                    verde: ultimaAnalise.green || 0,
                    verdeCana: ultimaAnalise.greenYellow || 0,
                    cereja: ultimaAnalise.cherry || 0,
                    passa: ultimaAnalise.raisin || 0,
                    seco: ultimaAnalise.dry || 0
                };

                const previsao = PrevisaoService.calcularPrevisoes(
                    idadePlantasTalhao,
                    graosPorEstagio,
                    porcentagens,
                    mesColeta
                );

                previsoes.push({
                    id: talhao.Id,
                    nome: talhao.Nome,
                    fazendaNome: talhao.FazendaNome,
                    ...previsao,
                    dataUltimaAnalise: ultimaAnalise.createdAt
                });

            } catch (error) {
                console.error(`Erro ao calcular previsão para talhão ${talhao.Id}:`, error);
                continue;
            }
        }

        previsoes.sort((a, b) => a.diasParaColheita - b.diasParaColheita);
        res.json(previsoes);

    } catch (error) {
        console.error('Erro ao calcular previsões:', error);
        res.status(500).json({ message: 'Erro ao calcular previsões' });
    }
};