import { Request, Response } from "express";
import AnaliseRapida from "../models/AnaliseRapida";
import Analise from "../models/Analise";
import {Op, QueryTypes} from "sequelize";
import {sequelize} from "../services/DatabaseService";

export const criarAnaliseRapida = async (req: Request, res: Response) => {
    const { nomeGrupo, lado, imagens } = req.body;

    try {
        const grupo = await AnaliseRapida.create({ nomeGrupo, lado });

        const analises = imagens.map((imagem: string) => ({
            imagemUrl: imagem,
            analiseRapidaId: grupo.id,
            PlugAndPlay: true,
        }));

        await Analise.bulkCreate(analises);

        res.status(201).json({ grupo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar análise rápida." });
    }
};

export const buscarAnalisesRapidasPorGrupo = async (req: Request, res: Response) => {
    const { grupoId } = req.params;

    try {
        const grupo = await AnaliseRapida.findByPk(grupoId, {
            include: [{ model: Analise }],
        });

        if (!grupo) {
            return res.status(404).json({ error: "Grupo não encontrado." });
        }

        res.status(200).json({ grupo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar análises rápidas." });
    }
};

export const compararAnalisesRapidas = async (req: Request, res: Response) => {
    const { grupoEsquerdoId, grupoDireitoId } = req.body;

    try {
        // Função para consolidar estatísticas via query
        const consolidarEstatisticas = async (grupoId: string) => {
            const result = await sequelize.query(
                `
                SELECT 
                    COALESCE(SUM(green), 0) AS green,
                    COALESCE(SUM(greenYellow), 0) AS greenYellow,
                    COALESCE(SUM(cherry), 0) AS cherry,
                    COALESCE(SUM(raisin), 0) AS raisin,
                    COALESCE(SUM(dry), 0) AS dry,
                    COALESCE(SUM(total), 0) AS total
                FROM tbAnalise
                WHERE analiseRapidaId = :grupoId
            `,
                {
                    replacements: { grupoId },
                    type: QueryTypes.SELECT,
                }
            );

            return result[0]; // Retorna a primeira (e única) linha
        };

        // Consolidar estatísticas dos dois grupos
        const estatisticasEsquerdo = await consolidarEstatisticas(grupoEsquerdoId);
        const estatisticasDireito = await consolidarEstatisticas(grupoDireitoId);

        // Calcular percentuais
        const calcularPercentuais = (estatisticas: any) => {
            const total = estatisticas.total || 1; // Evitar divisão por zero
            return {
                greenPercent: ((estatisticas.green / total) * 100).toFixed(2),
                greenYellowPercent: ((estatisticas.greenYellow / total) * 100).toFixed(2),
                cherryPercent: ((estatisticas.cherry / total) * 100).toFixed(2),
                raisinPercent: ((estatisticas.raisin / total) * 100).toFixed(2),
                dryPercent: ((estatisticas.dry / total) * 100).toFixed(2),
            };
        };

        const percentuaisEsquerdo = calcularPercentuais(estatisticasEsquerdo);
        const percentuaisDireito = calcularPercentuais(estatisticasDireito);

        // Responder com os dados consolidados
        res.status(200).json({
            grupoEsquerdo: {
                id: grupoEsquerdoId,
                estatisticas: estatisticasEsquerdo,
                percentuais: percentuaisEsquerdo,
            },
            grupoDireito: {
                id: grupoDireitoId,
                estatisticas: estatisticasDireito,
                percentuais: percentuaisDireito,
            },
        });
    } catch (error) {
        console.error("Erro ao comparar análises rápidas:", error);
        res.status(500).json({ error: "Erro ao comparar análises rápidas." });
    }
};
