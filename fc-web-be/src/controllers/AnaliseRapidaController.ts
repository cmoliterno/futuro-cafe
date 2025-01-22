import { Request, Response } from "express";
import AnaliseRapida from "../models/AnaliseRapida";
import Analise from "../models/Analise";
import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../services/DatabaseService";
import Grupo from "../models/Grupo";
import { AuthService } from "../services/AuthService";
import {addPlotAnalysis} from "../controllers/TalhaoController";
import fs from "fs";
import path from "path";

const authService = new AuthService();

// Serviço para criar análise rápida de forma assíncrona
export const criarAnaliseRapida = async (req: Request, res: Response): Promise<Response> => {
    //console.log("Entrou criarAnaliseRapida:", req.body);
    const { descricao } = req.body;

    if (!descricao) {
        return res.status(400).json({ error: "A descrição do grupo é obrigatória." });
    }

    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    const pessoaId: string | undefined = authService.verifyToken(token)?.userId;

    try {
        //console.log("🔧 Criando grupo...");
        const grupo = await Grupo.create({
            nome: descricao,
            pessoaFisicaId: pessoaId,
        });

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imagensEsquerdo = files?.["imagensEsquerdo"] || [];
        const imagensDireito = files?.["imagensDireito"] || [];

        if (!imagensEsquerdo.length || !imagensDireito.length) {
            return res.status(400).json({ error: "As imagens dos lados esquerdo e direito são obrigatórias." });
        }

        // Cria a análise rápida com status inicial "PENDING"
        const analiseRapida = await AnaliseRapida.create({
            nomeGrupo: descricao,
            grupoId: grupo.id,
            status: "PENDING",
        });

        // Processa as imagens em background
        processImages(imagensEsquerdo, imagensDireito, analiseRapida.id, grupo.id, );

        return res.status(201).json({ message: "Imagens enviadas para análise.", grupoId: grupo.id, analiseRapidaId: analiseRapida.id });
    } catch (error) {
        console.error("❌ Erro ao criar análise rápida:", error);
        return res.status(500).json({ error: "Erro ao criar análise rápida.", details: error });
    }
};


// Função para processar as imagens em background
const processImages = async (
    imagensEsquerdo: Express.Multer.File[],
    imagensDireito: Express.Multer.File[],
    analiseRapidaId: string,
    grupoId: string
): Promise<void> => {
    try {
        // Atualiza o status para "PROCESSING"
        await AnaliseRapida.update({ status: "PROCESSING" }, { where: { id: analiseRapidaId } });

        // Função para processar as imagens e enviar para análise
        const processImages = async (imagens: Express.Multer.File[], lado: string) => {
            return Promise.all(
                imagens.map(async (imagem) => {
                    const reqMock = {
                        file: imagem,
                        params: { talhaoId: null },
                        body: { lado, analiseRapidaId }, // Adiciona o lado aqui
                    } as unknown as Request;

                    return new Promise((resolve, reject) => {
                        const resMock = {
                            status: (statusCode: number) => {
                                if (statusCode >= 400) reject(new Error(`Erro ${statusCode}`));
                                return resMock;
                            },
                            json: (data: any) => resolve(data),
                        } as unknown as Response;

                        addPlotAnalysis(reqMock, resMock);
                    });
                })
            );
        };


        // Processa as imagens dos dois lados
        const analisesEsquerdo = await processImages(imagensEsquerdo, "Esquerdo");
        const analisesDireito = await processImages(imagensDireito, "Direito");

        // Atualiza o status para "COMPLETED"
        await AnaliseRapida.update({ status: "COMPLETED" }, { where: { id: analiseRapidaId } });

        console.log("✅ Processamento das imagens concluído.");
    } catch (error) {
        console.error("❌ Erro ao processar imagens:", error);
        // Atualiza o status para "ERROR" em caso de falha
        await AnaliseRapida.update({ status: "ERROR" }, { where: { id: analiseRapidaId } });
    }
};

export const buscarAnalisesRapidasPorGrupo = async (req: Request, res: Response) => {
    const { grupoId } = req.params;

    try {
        const grupo = await Grupo.findByPk(grupoId, {
            include: [
                {
                    model: AnaliseRapida,
                },
            ],
        });

        if (!grupo) {
            return res.status(404).json({ error: "Grupo não encontrado." });
        }

        res.status(200).json(grupo);
    } catch (error) {
        console.error("Erro ao buscar análises por grupo:", error);
        res.status(500).json({ error: "Erro ao buscar análises por grupo." });
    }
};

export const compararAnalisesRapidas = async (req: Request, res: Response) => {
    const { analiseRapidaId } = req.body;

    try {
        const analiseRapida = await AnaliseRapida.findOne({
            where: { id: analiseRapidaId },
        });

        if (!analiseRapida) {
            return res.status(400).json({ error: "Análise ainda não concluída." });
        }

        const consolidarEstatisticas = async (lado: string) => {
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
                    WHERE AnaliseRapidaId = :analiseRapidaId AND Lado = :lado
                `,
                {
                    replacements: { analiseRapidaId: analiseRapida.id, lado },
                    type: QueryTypes.SELECT,
                }
            );

            return result[0];
        };

        const estatisticasEsquerdo = await consolidarEstatisticas("Esquerdo");
        const estatisticasDireito = await consolidarEstatisticas("Direito");

        const calcularPercentuais = (estatisticas: any) => {
            const total = estatisticas.total || 1;
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

        res.status(200).json({
            grupo: {
                estatisticasEsquerdo,
                estatisticasDireito,
                percentuaisEsquerdo,
                percentuaisDireito,
            },
        });
    } catch (error) {
        console.error("Erro ao comparar análises rápidas:", error);
        res.status(500).json({ error: "Erro ao comparar análises rápidas." });
    }
};

export const checkProcessingStatus = async (req: Request, res: Response) => {
    const { analiseRapidaId } = req.params;

    try {
        const analiseRapida = await AnaliseRapida.findByPk(analiseRapidaId);

        if (!analiseRapida) {
            return res.status(404).json({ error: "Análise rápida não encontrada." });
        }

        res.status(200).json({ status: analiseRapida.status });
    } catch (error) {
        console.error("Erro ao verificar status de processamento:", error);
        res.status(500).json({ error: "Erro ao verificar status de processamento." });
    }
};
