import { Request, Response } from "express";
import AnaliseRapida from "../models/AnaliseRapida";
import Analise from "../models/Analise";
import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../services/DatabaseService";
import Grupo from "../models/Grupo";
import { AuthService } from "../services/AuthService";
import {addFastAnalysis} from "../controllers/TalhaoController";
import fs from "fs";
import path from "path";

const authService = new AuthService();

// Serviço para criar análise rápida de forma assíncrona
export const criarAnaliseRapida = async (req: Request, res: Response): Promise<Response> => {
    console.log("Iniciando criarAnaliseRapida");
    const { descricao } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!descricao) {
        return res.status(400).json({ error: "A descrição do grupo é obrigatória." });
    }

    if (!files || !files.imagensEsquerdo || !files.imagensDireito) {
        return res.status(400).json({ error: "Imagens dos dois lados são obrigatórias." });
    }

    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    const pessoaId: string | undefined = authService.verifyToken(token)?.userId;
    if (!pessoaId) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    const transaction = await sequelize.transaction();

    try {
        console.log("Criando grupo...");
        // 1. Criar grupo
        const grupo = await Grupo.create({
            nome: descricao,
            pessoaFisicaId: pessoaId
        }, { transaction });

        console.log("Grupo criado:", grupo.id);

        // 2. Criar análise rápida
        const analiseRapida = await AnaliseRapida.create({
            nomeGrupo: descricao,
            grupoId: grupo.id,
            status: "PENDING"
        }, { transaction });

        console.log("Análise rápida criada:", analiseRapida.id);

        await transaction.commit();

        // 3. Retornar ID da análise para acompanhamento
        res.status(201).json({
            message: "Análise rápida criada com sucesso",
            analiseRapidaId: analiseRapida.id,
            grupoId: grupo.id
        });

        // 4. Iniciar processamento em background
        processImages(files.imagensEsquerdo, files.imagensDireito, analiseRapida.id, grupo.id)
            .catch(async (error) => {
                console.error("Erro no processamento das imagens:", error);
                await AnaliseRapida.update(
                    { status: "ERROR" },
                    { where: { id: analiseRapida.id } }
                );
            });

        return res;

    } catch (error) {
        await transaction.rollback();
        console.error("Erro ao criar análise rápida:", error);
        return res.status(500).json({ error: "Erro ao criar análise rápida." });
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
        console.log(`Iniciando processamento de imagens para análise ${analiseRapidaId}`);
        
        // Atualiza o status para "PROCESSING"
        await AnaliseRapida.update(
            { status: "PROCESSING" },
            { where: { id: analiseRapidaId } }
        );

        // Processa as imagens dos dois lados
        const processImagesForSide = async (imagens: Express.Multer.File[], lado: "Esquerdo" | "Direito") => {
            console.log(`Processando ${imagens.length} imagens do lado ${lado}`);
            
            for (const imagem of imagens) {
                try {
                    console.log(`Processando imagem ${imagem.filename}`);
                    
                    const reqMock = {
                        file: imagem,
                        params: { talhaoId: null },
                        body: {
                            lado,
                            analiseRapidaId,
                            grupoId
                        }
                    } as unknown as Request;

                    await new Promise<void>((resolve, reject) => {
                        const resMock = {
                            status: (code: number) => ({
                                json: (data: any) => {
                                    if (code >= 400) {
                                        reject(new Error(`Erro ${code}: ${JSON.stringify(data)}`));
                                    } else {
                                        resolve();
                                    }
                                }
                            })
                        } as unknown as Response;

                        addFastAnalysis(reqMock, resMock).catch(reject);
                    });

                    console.log(`Imagem ${imagem.filename} processada com sucesso`);
                } catch (error) {
                    console.error(`Erro ao processar imagem ${imagem.filename}:`, error);
                    throw error; // Propaga o erro para interromper o processamento
                }
            }
        };

        // Processa primeiro o lado esquerdo, depois o direito
        await processImagesForSide(imagensEsquerdo, "Esquerdo");
        await processImagesForSide(imagensDireito, "Direito");

        // Atualiza o status para "COMPLETED"
        await AnaliseRapida.update(
            { status: "COMPLETED" },
            { where: { id: analiseRapidaId } }
        );

        console.log(`✅ Processamento concluído para análise ${analiseRapidaId}`);
    } catch (error) {
        console.error(`❌ Erro no processamento da análise ${analiseRapidaId}:`, error);
        await AnaliseRapida.update(
            { status: "ERROR" },
            { where: { id: analiseRapidaId } }
        );
        throw error;
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

        // Primeiro, vamos verificar se existem análises para este ID
        const totalAnalises = await Analise.count({
            where: { analiseRapidaId }
        });

        if (totalAnalises === 0) {
            console.log("Nenhuma análise encontrada para o ID:", analiseRapidaId);
            return res.status(404).json({ error: "Nenhuma análise encontrada para esta comparação." });
        }

        // Definindo um tipo para as estatísticas
        interface EstatisticasGraos {
            green: number;
            greenYellow: number;
            cherry: number;
            raisin: number;
            dry: number;
            total: number;
        }

        const consolidarEstatisticas = async (lado: string): Promise<EstatisticasGraos> => {
            console.log(`Buscando estatísticas para o lado ${lado} da análise ${analiseRapidaId}`);
            
            const queryStr = `
            SELECT
                COALESCE(SUM(green), 0) as green,
                COALESCE(SUM(greenYellow), 0) as greenYellow,
                COALESCE(SUM(cherry), 0) as cherry,
                COALESCE(SUM(raisin), 0) as raisin,
                COALESCE(SUM(dry), 0) as dry,
                COALESCE(SUM(total), 0) as total
            FROM tbAnalise
            WHERE AnaliseRapidaId = :analiseRapidaId 
            AND Lado = :lado
            `;
            
            console.log("Executando query SQL:", queryStr);
            console.log("Com parâmetros:", { analiseRapidaId, lado });
            
            const result = await sequelize.query(
                queryStr,
                {
                    replacements: { analiseRapidaId, lado },
                    type: QueryTypes.SELECT,
                    logging: console.log // Ativa o log da query
                }
            );

            console.log(`Resultado para ${lado}:`, result[0]);
            return result[0] as EstatisticasGraos;
        };

        const estatisticasEsquerdo = await consolidarEstatisticas("Esquerdo");
        const estatisticasDireito = await consolidarEstatisticas("Direito");

        const calcularPercentuais = (estatisticas: any) => {
            const total = Number(estatisticas.total) || 1; // Garante que seja número
            return {
                greenPercent: ((Number(estatisticas.green) / total) * 100).toFixed(2),
                greenYellowPercent: ((Number(estatisticas.greenYellow) / total) * 100).toFixed(2),
                cherryPercent: ((Number(estatisticas.cherry) / total) * 100).toFixed(2),
                raisinPercent: ((Number(estatisticas.raisin) / total) * 100).toFixed(2),
                dryPercent: ((Number(estatisticas.dry) / total) * 100).toFixed(2),
            };
        };

        const percentuaisEsquerdo = calcularPercentuais(estatisticasEsquerdo);
        const percentuaisDireito = calcularPercentuais(estatisticasDireito);

        // Log dos resultados finais
        console.log("Estatísticas calculadas:", {
            estatisticasEsquerdo,
            estatisticasDireito,
            percentuaisEsquerdo,
            percentuaisDireito
        });

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

// Novo endpoint para buscar histórico de análises rápidas com filtros
export const getAnaliseRapidaHistorico = async (req: Request, res: Response) => {
    try {
        // Parâmetros de paginação e ordenação
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        
        // Parâmetros de ordenação
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortDirection = req.query.sortDirection as string || 'desc';
        
        // Parâmetros de filtro
        const dataInicio = req.query.dataInicio as string;
        const dataFim = req.query.dataFim as string;
        
        console.log("Filtros recebidos brutos:", { dataInicio, dataFim, page, limit, sortBy, sortDirection });
        
        // Construir condições de filtro
        const whereConditions: any = {};
        
        // Função para ajustar o fuso horário corretamente
        const ajustarDataUTC = (dataStr: string, ehFimDoDia = false) => {
            // Criar data local a partir da string YYYY-MM-DD
            const [ano, mes, dia] = dataStr.split('-').map(num => parseInt(num));
            
            // Criar objeto de data no fuso UTC com os componentes corretos
            const data = new Date(Date.UTC(ano, mes - 1, dia, 
                ehFimDoDia ? 23 : 0, 
                ehFimDoDia ? 59 : 0, 
                ehFimDoDia ? 59 : 0,
                ehFimDoDia ? 999 : 0));
            
            return data;
        };
        
        if (dataInicio && dataFim) {
            // Cria as datas início (00:00:00) e fim (23:59:59) diretamente no UTC
            const dataInicioUTC = ajustarDataUTC(dataInicio);
            const dataFimUTC = ajustarDataUTC(dataFim, true);
            
            console.log("Filtro de data entre (UTC):", {
                dataInicio: dataInicioUTC.toISOString(),
                dataFim: dataFimUTC.toISOString()
            });
            
            whereConditions.createdAt = {
                [Op.between]: [dataInicioUTC, dataFimUTC]
            };
        } else if (dataInicio) {
            const dataInicioUTC = ajustarDataUTC(dataInicio);
            console.log("Filtro de data início (UTC):", dataInicioUTC.toISOString());
            
            whereConditions.createdAt = {
                [Op.gte]: dataInicioUTC
            };
        } else if (dataFim) {
            const dataFimUTC = ajustarDataUTC(dataFim, true);
            console.log("Filtro de data fim (UTC):", dataFimUTC.toISOString());
            
            whereConditions.createdAt = {
                [Op.lte]: dataFimUTC
            };
        }
        
        console.log("Condições de consulta:", JSON.stringify(whereConditions));
        
        // Buscar registros com paginação e contagem total
        const { count, rows } = await AnaliseRapida.findAndCountAll({
            where: whereConditions,
            order: [[sortBy, sortDirection.toUpperCase()]],
            limit,
            offset,
            logging: console.log // Adiciona log da query SQL
        });
        
        console.log(`Encontrados ${count} registros`);
        
        // Retorna resultados paginados
        res.status(200).json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page,
            items: rows
        });
    } catch (error) {
        console.error("Erro ao buscar histórico de análises rápidas:", error);
        res.status(500).json({ message: "Erro ao buscar histórico de análises rápidas" });
    }
};

// Novo endpoint para excluir uma análise rápida
export const excluirAnaliseRapida = async (req: Request, res: Response) => {
    const { analiseRapidaId } = req.params;
    
    console.log(`Solicitação para excluir análise rápida ${analiseRapidaId}`);
    
    try {
        // Verificar se a análise existe
        const analiseRapida = await AnaliseRapida.findByPk(analiseRapidaId);
        
        if (!analiseRapida) {
            console.log(`Análise rápida ${analiseRapidaId} não encontrada`);
            return res.status(404).json({ message: "Análise rápida não encontrada." });
        }
        
        console.log(`Análise rápida ${analiseRapidaId} encontrada, grupoId: ${analiseRapida.grupoId}`);
        
        // Primeiro excluir as análises associadas
        const analisesExcluidas = await Analise.destroy({
            where: {
                analiseRapidaId
            }
        });
        
        console.log(`${analisesExcluidas} análises associadas excluídas`);
        
        // Excluir a análise rápida
        await analiseRapida.destroy();
        
        console.log(`Análise rápida ${analiseRapidaId} excluída com sucesso`);
        res.status(200).json({ message: "Análise rápida excluída com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir análise rápida:", error);
        res.status(500).json({ message: "Erro ao excluir análise rápida." });
    }
};

// Exportações dos controladores para uso nas rotas
export const createAnaliseRapidaGroup = criarAnaliseRapida;
export const getAnaliseRapidaById = buscarAnalisesRapidasPorGrupo;
export const compareAnaliseRapida = compararAnalisesRapidas;
export const deleteAnaliseRapida = excluirAnaliseRapida;

// Método para consultar os resultados de uma análise rápida existente via GET
export const consultarResultadosAnaliseRapida = async (req: Request, res: Response) => {
    const { analiseRapidaId } = req.params;

    try {
        console.log(`Consultando resultados da análise ${analiseRapidaId}`);
        
        const analiseRapida = await AnaliseRapida.findOne({
            where: { id: analiseRapidaId },
        });

        if (!analiseRapida) {
            console.log(`Análise rápida ${analiseRapidaId} não encontrada`);
            return res.status(404).json({ error: "Análise rápida não encontrada." });
        }

        console.log(`Status da análise ${analiseRapidaId}: ${analiseRapida.status}`);

        if (analiseRapida.status !== "COMPLETED") {
            return res.status(400).json({ error: `Análise ainda não concluída. Status atual: ${analiseRapida.status}` });
        }

        // Primeiro, vamos verificar se existem análises para este ID
        const totalAnalises = await Analise.count({
            where: { analiseRapidaId }
        });

        console.log(`Total de análises encontradas para ${analiseRapidaId}: ${totalAnalises}`);

        if (totalAnalises === 0) {
            // Se a análise foi marcada como concluída mas não tem dados, definimos um status de erro
            console.log(`Análise ${analiseRapidaId} marcada como COMPLETED mas não possui dados. Corrigindo status para ERROR.`);
            
            await AnaliseRapida.update(
                { status: "ERROR" },
                { where: { id: analiseRapidaId } }
            );
            
            return res.status(404).json({ 
                error: "Dados da análise não encontrados. Esta análise foi marcada com erro, tente criar uma nova." 
            });
        }

        // Definindo um tipo para as estatísticas
        interface EstatisticasGraos {
            green: number;
            greenYellow: number;
            cherry: number;
            raisin: number;
            dry: number;
            total: number;
        }

        const consolidarEstatisticas = async (lado: string): Promise<EstatisticasGraos> => {
            console.log(`Buscando estatísticas para o lado ${lado} da análise ${analiseRapidaId}`);
            
            const queryStr = `
            SELECT
                COALESCE(SUM(green), 0) as green,
                COALESCE(SUM(greenYellow), 0) as greenYellow,
                COALESCE(SUM(cherry), 0) as cherry,
                COALESCE(SUM(raisin), 0) as raisin,
                COALESCE(SUM(dry), 0) as dry,
                COALESCE(SUM(total), 0) as total
            FROM tbAnalise
            WHERE AnaliseRapidaId = :analiseRapidaId 
            AND Lado = :lado
            `;
            
            console.log("Executando query SQL:", queryStr);
            console.log("Com parâmetros:", { analiseRapidaId, lado });
            
            const result = await sequelize.query(
                queryStr,
                {
                    replacements: { analiseRapidaId, lado },
                    type: QueryTypes.SELECT,
                    logging: console.log // Ativa o log da query
                }
            );

            console.log(`Resultado para ${lado}:`, result[0]);
            return result[0] as EstatisticasGraos;
        };

        const estatisticasEsquerdo = await consolidarEstatisticas("Esquerdo");
        const estatisticasDireito = await consolidarEstatisticas("Direito");

        // Verifica se os resultados têm valores maiores que zero
        const totalGraosEsquerdo = Number(estatisticasEsquerdo.total || 0);
        const totalGraosDireito = Number(estatisticasDireito.total || 0);
        
        if (totalGraosEsquerdo === 0 && totalGraosDireito === 0) {
            console.log(`Análise ${analiseRapidaId} não contém contagens de grãos (total = 0)`);
            
            await AnaliseRapida.update(
                { status: "ERROR" },
                { where: { id: analiseRapidaId } }
            );
            
            return res.status(400).json({ 
                error: "Nenhum grão foi detectado nas imagens. Esta análise foi marcada com erro, tente novamente com outras imagens." 
            });
        }

        const calcularPercentuais = (estatisticas: any) => {
            const total = Number(estatisticas.total) || 1; // Garante que seja número
            return {
                greenPercent: ((Number(estatisticas.green) / total) * 100).toFixed(2),
                greenYellowPercent: ((Number(estatisticas.greenYellow) / total) * 100).toFixed(2),
                cherryPercent: ((Number(estatisticas.cherry) / total) * 100).toFixed(2),
                raisinPercent: ((Number(estatisticas.raisin) / total) * 100).toFixed(2),
                dryPercent: ((Number(estatisticas.dry) / total) * 100).toFixed(2),
            };
        };

        const percentuaisEsquerdo = calcularPercentuais(estatisticasEsquerdo);
        const percentuaisDireito = calcularPercentuais(estatisticasDireito);

        // Log dos resultados finais
        console.log("Estatísticas calculadas:", {
            estatisticasEsquerdo,
            estatisticasDireito,
            percentuaisEsquerdo,
            percentuaisDireito
        });

        res.status(200).json({
            grupo: {
                estatisticasEsquerdo,
                estatisticasDireito,
                percentuaisEsquerdo,
                percentuaisDireito,
            },
        });
    } catch (error) {
        console.error("Erro ao consultar resultados da análise rápida:", error);
        res.status(500).json({ error: "Erro ao consultar resultados da análise rápida." });
    }
};
