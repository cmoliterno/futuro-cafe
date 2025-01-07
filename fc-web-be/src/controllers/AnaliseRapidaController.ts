import { Request, Response } from "express";
import AnaliseRapida from "../models/AnaliseRapida";
import Analise from "../models/Analise";
import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../services/DatabaseService";
import Grupo from "../models/Grupo";
import { AuthService } from "../services/AuthService";
import { addPlotAnalysis } from "../controllers/TalhaoController";

const authService = new AuthService();

// Serviço para criar análise rápida
export const criarAnaliseRapida = async (req: Request, res: Response): Promise<any> => {
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
        console.log("🔧 Criando grupo...");
        const grupo = await Grupo.create({
            nome: descricao,
            pessoaFisicaId: pessoaId,
        });

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const imagensEsquerdo = files?.["imagensEsquerdo"] || [];
        const imagensDireito = files?.["imagensDireito"] || [];

        if (!imagensEsquerdo.length || !imagensDireito.length) {
            return res.status(400).json({ error: "As imagens dos lados esquerdo e direito são obrigatórias." });
        }

        console.log(`📸 Recebidas ${imagensEsquerdo.length} imagens do lado esquerdo.`);
        console.log(`📸 Recebidas ${imagensDireito.length} imagens do lado direito.`);

        const processImagens = async (imagens: Express.Multer.File[]) => {
            return Promise.all(
                imagens.map(async (imagem) => {
                    const reqMock = {
                        file: imagem,
                        params: { talhaoId: null },
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

        const analisesEsquerdo = await processImagens(imagensEsquerdo);
        const analisesDireito = await processImagens(imagensDireito);

        res.status(201).json({ message: "Análises rápidas e completas criadas com sucesso.", grupo, analisesEsquerdo, analisesDireito });
    } catch (error) {
        console.error("❌ Erro ao criar análise rápida:", error);
        res.status(500).json({ error: "Erro ao criar análise rápida.", details: error });
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
    const { grupoId } = req.body;

    try {
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
                    WHERE grupoId = :grupoId AND lado = :lado
                `,
                {
                    replacements: { grupoId, lado },
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
                id: grupoId,
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
