import { Request, Response } from 'express';
import path from "path";
import { Fazenda } from '../models/Fazenda';
import Talhao from '../models/Talhao';
import Plantio from '../models/Plantio';
import jwt from 'jsonwebtoken';
import Analise from "../models/Analise";
import {Op, QueryTypes, Sequelize} from "sequelize";
import axios from "axios";
import FormData from 'form-data';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/AuthService';
import fs from "fs"; // Importação da versão síncrona
import fsp from "fs/promises"; // Importação da versão assíncrona
import * as exifReader from "exifreader";
import TalhaoDesenho from "../models/TalhaoDesenho";
import {sequelize} from "../services/DatabaseService";


const authService = new AuthService();
// Função auxiliar p/ converter Buffer => ArrayBuffer
export function toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

export function parseExifDate(dateTimeString: string): Date | null {
    if (!dateTimeString) return null;

    const parts = dateTimeString.split(' ');
    if (parts.length !== 2) return null;

    const datePart = parts[0]; // "YYYY:MM:DD"
    const timePart = parts[1]; // "HH:MM:SS"
    const [year, month, day] = datePart.split(':');
    const [hour, minute, second] = timePart.split(':');

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    );
}

// Configuração do cliente Azure Blob
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || "teste";
const containerName = 'futurocafe';
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

async function uploadToAzure(fileBuffer: Buffer, fileName: string): Promise<string> {
    const blobName = `analises/${uuidv4()}_${fileName}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: "image/jpeg" },
    });

    return blockBlobClient.url;
}

export async function uploadToAzureByFast(filePath: string, fileName: string): Promise<string> {
    const blobName = `analises/${fileName}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Cria um stream de leitura do arquivo no disco
    const fileStream = fs.createReadStream(filePath);

    // Faz o upload usando o stream
    await blockBlobClient.uploadStream(fileStream, undefined, undefined, {
        blobHTTPHeaders: { blobContentType: "image/jpeg" },
    });

    console.log(`✅ Upload concluído no Azure: ${blobName}`);
    return blockBlobClient.url;
}

export async function getAllTalhoes(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;

        // Busca os talhões com todas as informações necessárias
        const talhoes = await sequelize.query<TalhaoAtualizadoResult>(
            `SELECT 
                t.*,
                f.Nome as FazendaNome,
                td.desenhoGeometria.STAsText() as desenho,
                tp.Id as PlantioId,
                tp.Data as DataPlantio,
                tp.EspacamentoLinhasMetros,
                tp.EspacamentoMudasMetros,
                tp.CultivarId
            FROM tbTalhao t
            INNER JOIN tbFazenda f ON t.FazendaId = f.Id
            LEFT JOIN tbTalhaoDesenho td ON t.Id = td.talhaoId
            LEFT JOIN tbPlantio tp ON t.Id = tp.TalhaoId
            WHERE t.FazendaId IN (
                SELECT FazendaId 
                FROM tbPessoaFisicaFazenda 
                WHERE PessoaFisicaId = :pessoaId
            )
            ORDER BY t.Nome ASC`,
            {
                replacements: { pessoaId },
                type: QueryTypes.SELECT
            }
        );

        // Formatar a resposta para manter a compatibilidade com o frontend
        const response = talhoes.map(talhao => ({
            id: talhao.Id,
            nome: talhao.Nome,
            fazendaId: talhao.FazendaId,
            createdAt: talhao.CreatedAt,
            lastUpdatedAt: talhao.LastUpdatedAt,
            Fazenda: {
                id: talhao.FazendaId,
                nome: talhao.FazendaNome
            },
            TalhaoDesenho: talhao.desenho ? {
                talhaoId: talhao.Id,
                desenhoGeometria: talhao.desenho
            } : null,
            Plantio: talhao.PlantioId ? {
                id: talhao.PlantioId,
                data: talhao.DataPlantio,
                espacamentoLinhasMetros: talhao.EspacamentoLinhasMetros,
                espacamentoMudasMetros: talhao.EspacamentoMudasMetros,
                cultivarId: talhao.CultivarId,
                talhaoId: talhao.Id
            } : null
        }));

        res.json(response);
    } catch (error) {
        console.error('Erro ao buscar talhões:', error);
        res.status(500).json({ message: 'Erro ao buscar talhões', error });
    }
}

// Interface para os resultados da query
interface TalhaoQueryResult {
    Id: string;
    Nome: string;
    FazendaId: string;
    CreatedAt: Date;
    LastUpdatedAt: Date;
    FazendaNome: string;
    desenho: any;
    // Campos do Plantio
    PlantioId: string;
    DataPlantio: Date;
    EspacamentoLinhasMetros: number;
    EspacamentoMudasMetros: number;
    CultivarId: string;
}

export async function getTalhaoById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        console.log(`Buscando talhão com ID: ${id}`);
        
        // Consulta SQL para buscar o talhão e suas informações relacionadas
        const [results] = await sequelize.query<TalhaoQueryResult>(`
            SELECT 
                t.*,
                f.Nome as FazendaNome,
                td.DesenhoGeometria.STAsText() as desenho,
                tp.Id as PlantioId,
                tp.Data as DataPlantio,
                tp.EspacamentoLinhasMetros,
                tp.EspacamentoMudasMetros,
                tp.CultivarId
            FROM tbTalhao t
            LEFT JOIN tbPlantio tp ON tp.TalhaoId = t.Id  
            INNER JOIN tbFazenda f ON t.FazendaId = f.Id
            LEFT JOIN tbTalhaoDesenho td ON t.Id = td.TalhaoId
            WHERE t.Id = :talhaoId
        `, {
            replacements: { talhaoId: id },
            type: QueryTypes.SELECT
        });

        if (!results) {
            console.log(`Talhão não encontrado com ID: ${id}`);
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        console.log(`Talhão encontrado: ${results.Nome}, desenho: ${results.desenho ? 'Sim' : 'Não'}`);

        // Converter o texto WKT para formato GeoJSON para o frontend
        let desenhoGeoJSON = null;
        if (results.desenho) {
            try {
                console.log(`Desenho WKT: ${results.desenho}`);
                // Parse do formato WKT para extrair as coordenadas
                // Corrigindo a regex para corresponder ao formato real retornado pelo SQL Server
                const wktRegex = /POLYGON\s*\(\((.*)\)\)/;
                const match = results.desenho.match(wktRegex);
                
                if (match && match[1]) {
                    const coordsText = match[1];
                    console.log(`Coordenadas extraídas: ${coordsText}`);
                    const coordPairs = coordsText.split(',').map((pair: string) => {
                        const [lng, lat] = pair.trim().split(' ').map(Number);
                        return [lat, lng]; // Inverter para o formato [latitude, longitude]
                    });
                    
                    desenhoGeoJSON = {
                        type: 'Polygon',
                        coordinates: [coordPairs]
                    };
                    console.log(`Desenho GeoJSON gerado com ${coordPairs.length} pontos`);
                } else {
                    console.log(`Regex não encontrou coordenadas no desenho: ${results.desenho}`);
                }
            } catch (error) {
                console.error('Erro ao converter WKT para GeoJSON:', error);
            }
        } else {
            console.log('Talhão não possui desenho');
        }

        // Formatar a resposta para manter a compatibilidade com o frontend
        const response = {
            id: results.Id,
            nome: results.Nome,
            fazendaId: results.FazendaId,
            createdAt: results.CreatedAt,
            lastUpdatedAt: results.LastUpdatedAt,
            Fazenda: {
                id: results.FazendaId,
                nome: results.FazendaNome
            },
            TalhaoDesenho: desenhoGeoJSON ? {
                talhaoId: results.Id,
                desenhoGeometria: desenhoGeoJSON
            } : null,
            Plantio: results.PlantioId ? {
                id: results.PlantioId,
                data: results.DataPlantio,
                espacamentoLinhasMetros: results.EspacamentoLinhasMetros,
                espacamentoMudasMetros: results.EspacamentoMudasMetros,
                cultivarId: results.CultivarId,
                talhaoId: results.Id
            } : null
        };

        console.log(`Resposta formatada. TalhaoDesenho: ${response.TalhaoDesenho ? 'Presente' : 'Ausente'}`);
        res.json(response);
    } catch (error) {
        console.error('Erro ao buscar talhão:', error);
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
            where: { fazendaId },
            order: [['nome', 'ASC']] // Ordenar por nome em ordem alfabética
        });

        res.json(talhoes);
    } catch (error) {
        console.error('Erro ao buscar talhões por fazenda:', error);
        res.status(500).json({ message: 'Erro ao buscar talhões por fazenda', error });
    }
}

type Coordinate = [number, number]; // [latitude, longitude]

export async function createTalhao(req: Request, res: Response) {
    try {
        const { nome, nomeResponsavel, fazendaId, dataPlantio, espacamentoLinhas, espacamentoMudas, cultivarId, desenho } = req.body;

        // Verificar todos os campos obrigatórios e retornar uma mensagem específica para cada um
        const camposObrigatorios = [];
        if (!nome) camposObrigatorios.push('Nome');
        if (!fazendaId) camposObrigatorios.push('Fazenda');
        if (!dataPlantio) camposObrigatorios.push('Data de plantio');
        if (!espacamentoLinhas) camposObrigatorios.push('Espaçamento entre linhas');
        if (!espacamentoMudas) camposObrigatorios.push('Espaçamento entre mudas');
        if (!cultivarId) camposObrigatorios.push('Cultivar');

        if (camposObrigatorios.length > 0) {
            return res.status(400).json({ 
                message: `Os seguintes campos são obrigatórios: ${camposObrigatorios.join(', ')}` 
            });
        }

        const fazendaExists = await Fazenda.findByPk(fazendaId);
        if (!fazendaExists) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;

        // Usar uma transação para garantir a consistência dos dados
        const result = await sequelize.transaction(async (t) => {
            // Criar o talhão
            const talhao = await Talhao.create({ 
                nome, 
                fazendaId,
                createdAt: new Date(),
                lastUpdatedAt: new Date()
            }, { transaction: t });

            // Criar o plantio associado ao talhão
            const plantio = await Plantio.create({
                data: new Date(dataPlantio),
                espacamentoLinhasMetros: espacamentoLinhas,
                espacamentoMudasMetros: espacamentoMudas,
                cultivarId,
                talhaoId: talhao.id
            }, { transaction: t });

            // Se tiver desenho, salvar
            if (desenho?.type === 'Polygon' && desenho.coordinates && Array.isArray(desenho.coordinates[0])) {
                // Formatar as coordenadas para o formato WKT - IMPORTANTE: Inverter lat/long para long/lat
                const polygonPoints = desenho.coordinates[0].map(coord => `${coord[1]} ${coord[0]}`).join(',');
                // Fechar o polígono repetindo o primeiro ponto se necessário
                const firstCoord = desenho.coordinates[0][0];
                const lastCoord = desenho.coordinates[0][desenho.coordinates[0].length - 1];
                const wktPolygon = `POLYGON((${polygonPoints}${firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1] ? `,${firstCoord[1]} ${firstCoord[0]}` : ''}))`;
                
                await sequelize.query(
                    `INSERT INTO tbTalhaoDesenho (TalhaoId, DesenhoGeometria, CreatedAt, LastUpdatedAt)
                     VALUES (:talhaoId, geography::STGeomFromText(:wktPolygon, 4326), :createdAt, :lastUpdatedAt)`,
                    {
                        replacements: {
                            talhaoId: talhao.id,
                            wktPolygon,
                            createdAt: new Date(),
                            lastUpdatedAt: new Date()
                        },
                        type: QueryTypes.INSERT,
                        transaction: t
                    }
                );
            }

            return { talhao, plantio };
        });

        // Retornar a estrutura esperada pelo APP
        res.status(201).json({
            id: result.talhao.id,
            nome: result.talhao.nome,
            fazendaId: result.talhao.fazendaId,
            createdAt: result.talhao.createdAt,
            lastUpdatedAt: result.talhao.lastUpdatedAt,
            Plantio: {
                id: result.plantio.id,
                data: result.plantio.data,
                espacamentoLinhasMetros: result.plantio.espacamentoLinhasMetros,
                espacamentoMudasMetros: result.plantio.espacamentoMudasMetros,
                cultivarId: result.plantio.cultivarId,
                talhaoId: result.talhao.id
            }
        });
    } catch (error) {
        console.error('Erro ao criar talhão:', error);
        res.status(500).json({ message: 'Erro ao criar talhão', error });
    }
}

// Interface para os resultados da query de atualização
interface TalhaoAtualizadoResult {
    Id: string;
    Nome: string;
    FazendaId: string;
    CreatedAt: Date;
    LastUpdatedAt: Date;
    FazendaNome: string;
    desenho: string | null;
    PlantioId: string;
    DataPlantio: Date;
    EspacamentoLinhasMetros: number;
    EspacamentoMudasMetros: number;
    CultivarId: string;
}

export async function updateTalhao(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, fazendaId, dataPlantio, espacamentoLinhas, espacamentoMudas, cultivarId, desenho } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !fazendaId) {
            return res.status(400).json({ message: 'Nome e Fazenda ID são obrigatórios' });
        }

        // Verificar se o talhão existe
        const talhao = await Talhao.findByPk(id);
        if (!talhao) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        // Verificar se a fazenda existe
        const fazendaExists = await Fazenda.findByPk(fazendaId);
        if (!fazendaExists) {
            return res.status(404).json({ message: 'Fazenda não encontrada' });
        }

        // Usar uma transação para garantir a consistência dos dados
        await sequelize.transaction(async (t) => {
            // Atualizar o talhão
            await talhao.update({
                nome,
                fazendaId,
                lastUpdatedAt: new Date()
            }, { transaction: t });

            // Atualizar ou criar o desenho do talhão
            if (desenho?.type === 'Polygon' && desenho.coordinates && Array.isArray(desenho.coordinates[0])) {
                // Formatar as coordenadas para o formato WKT - IMPORTANTE: Inverter lat/long para long/lat
                const polygonPoints = desenho.coordinates[0].map(coord => `${coord[1]} ${coord[0]}`).join(',');
                // Fechar o polígono repetindo o primeiro ponto se necessário
                const firstCoord = desenho.coordinates[0][0];
                const lastCoord = desenho.coordinates[0][desenho.coordinates[0].length - 1];
                const wktPolygon = `POLYGON((${polygonPoints}${firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1] ? `,${firstCoord[1]} ${firstCoord[0]}` : ''}))`;

                // Verificar se já existe um desenho
                const existingDesenho = await TalhaoDesenho.findOne({
                    where: { talhaoId: id },
                    transaction: t
                });

                if (existingDesenho) {
                    // Se existe, atualiza
                    await sequelize.query(
                        `UPDATE tbTalhaoDesenho 
                         SET DesenhoGeometria = geography::STGeomFromText(:wktPolygon, 4326),
                             LastUpdatedAt = :lastUpdatedAt
                         WHERE TalhaoId = :talhaoId`,
                        {
                            replacements: {
                                talhaoId: id,
                                wktPolygon,
                                lastUpdatedAt: new Date()
                            },
                            type: QueryTypes.UPDATE,
                            transaction: t
                        }
                    );
                } else {
                    // Se não existe, cria um novo
                    await sequelize.query(
                        `INSERT INTO tbTalhaoDesenho (TalhaoId, DesenhoGeometria, CreatedAt, LastUpdatedAt)
                         VALUES (:talhaoId, geography::STGeomFromText(:wktPolygon, 4326), :createdAt, :lastUpdatedAt)`,
                        {
                            replacements: {
                                talhaoId: id,
                                wktPolygon,
                                createdAt: new Date(),
                                lastUpdatedAt: new Date()
                            },
                            type: QueryTypes.INSERT,
                            transaction: t
                        }
                    );
                }
            }

            // Atualizar o plantio associado se necessário
            if (dataPlantio || espacamentoLinhas || espacamentoMudas || cultivarId) {
                const plantio = await Plantio.findOne({ 
                    where: { talhaoId: id },
                    transaction: t 
                });
                
                const plantioData = {
                    data: dataPlantio ? new Date(dataPlantio) : undefined,
                    espacamentoLinhasMetros: espacamentoLinhas,
                    espacamentoMudasMetros: espacamentoMudas,
                    cultivarId,
                    talhaoId: id
                };
                
                if (plantio) {
                    await plantio.update({
                        ...Object.fromEntries(
                            Object.entries(plantioData).filter(([_, value]) => value !== undefined)
                        )
                    }, { transaction: t });
                } else if (Object.values(plantioData).some(value => value !== undefined)) {
                    await Plantio.create(plantioData, { transaction: t });
                }
            }
        });

        // Buscar o talhão atualizado com todas as relações
        const [talhaoAtualizado] = await sequelize.query<TalhaoAtualizadoResult>(
            `SELECT 
                t.*,
                f.Nome as FazendaNome,
                td.DesenhoGeometria.STAsText() as desenho,
                tp.Id as PlantioId,
                tp.Data as DataPlantio,
                tp.EspacamentoLinhasMetros,
                tp.EspacamentoMudasMetros,
                tp.CultivarId
            FROM tbTalhao t
            INNER JOIN tbFazenda f ON t.FazendaId = f.Id
            LEFT JOIN tbTalhaoDesenho td ON t.Id = td.TalhaoId
            LEFT JOIN tbPlantio tp ON t.Id = tp.TalhaoId
            WHERE t.Id = :talhaoId`,
            {
                replacements: { talhaoId: id },
                type: QueryTypes.SELECT
            }
        );

        // Converter o texto WKT para formato GeoJSON para o frontend
        let desenhoGeoJSON = null;
        if (talhaoAtualizado.desenho) {
            try {
                // Parse do formato WKT para extrair as coordenadas
                // Corrigindo a regex para corresponder ao formato real retornado pelo SQL Server
                const wktRegex = /POLYGON\s*\(\((.*)\)\)/;
                const match = talhaoAtualizado.desenho.match(wktRegex);
                
                if (match && match[1]) {
                    const coordsText = match[1];
                    console.log(`Coordenadas extraídas: ${coordsText}`);
                    const coordPairs = coordsText.split(',').map((pair: string) => {
                        const [lng, lat] = pair.trim().split(' ').map(Number);
                        return [lat, lng]; // Inverter para o formato [latitude, longitude]
                    });
                    
                    desenhoGeoJSON = {
                        type: 'Polygon',
                        coordinates: [coordPairs]
                    };
                    console.log(`Desenho GeoJSON gerado com ${coordPairs.length} pontos`);
                } else {
                    console.log(`Regex não encontrou coordenadas no desenho: ${talhaoAtualizado.desenho}`);
                }
            } catch (error) {
                console.error('Erro ao converter WKT para GeoJSON:', error);
            }
        }

        // Formatar a resposta para manter a compatibilidade com o frontend
        const response = {
            id: talhaoAtualizado.Id,
            nome: talhaoAtualizado.Nome,
            fazendaId: talhaoAtualizado.FazendaId,
            createdAt: talhaoAtualizado.CreatedAt,
            lastUpdatedAt: talhaoAtualizado.LastUpdatedAt,
            Fazenda: {
                id: talhaoAtualizado.FazendaId,
                nome: talhaoAtualizado.FazendaNome
            },
            TalhaoDesenho: desenhoGeoJSON ? {
                talhaoId: talhaoAtualizado.Id,
                desenhoGeometria: desenhoGeoJSON
            } : null,
            Plantio: talhaoAtualizado.PlantioId ? {
                id: talhaoAtualizado.PlantioId,
                data: talhaoAtualizado.DataPlantio,
                espacamentoLinhasMetros: talhaoAtualizado.EspacamentoLinhasMetros,
                espacamentoMudasMetros: talhaoAtualizado.EspacamentoMudasMetros,
                cultivarId: talhaoAtualizado.CultivarId,
                talhaoId: talhaoAtualizado.Id
            } : null
        };

        res.json(response);
    } catch (error) {
        console.error('Erro ao atualizar talhão:', error);
        res.status(500).json({ message: 'Erro ao atualizar talhão', error });
    }
}

export async function deleteTalhao(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Verificar se o talhão existe
        const talhao = await Talhao.findByPk(id);
        if (!talhao) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        // Usar uma transação para garantir que todas as exclusões sejam feitas ou nenhuma
        await sequelize.transaction(async (t) => {
            // 1. Excluir todas as análises associadas ao talhão
            await Analise.destroy({ 
                where: { talhaoId: id },
                transaction: t
            });

            // 2. Excluir o desenho do talhão
            await TalhaoDesenho.destroy({ 
                where: { talhaoId: id },
                transaction: t
            });

            // 3. Excluir todos os plantios associados ao talhão
            await Plantio.destroy({ 
                where: { talhaoId: id },
                transaction: t
            });

            // 4. Finalmente, excluir o talhão
            await talhao.destroy({ transaction: t });
        });

        res.json({ 
            message: 'Talhão e todos os seus registros associados foram excluídos com sucesso',
            success: true
        });
    } catch (error) {
        console.error('Erro ao excluir talhão:', error);
        res.status(500).json({ 
            message: 'Erro ao excluir talhão', 
            error,
            success: false
        });
    }
}


// Obter análises de um talhão
export const getPlotAnalyses = async (req: Request, res: Response) => {
    const { talhaoId } = req.params;
    const { projetoId, grupoId } = req.body; // Agora usando o body para receber os IDs

    try {
        // Verifica se o talhão existe
        const talhaoExists = await Talhao.findByPk(talhaoId);
        if (!talhaoExists) {
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        // Define as condições de filtro para o banco de dados
        const whereConditions: any = { TalhaoId: talhaoId };

        if (projetoId) {
            whereConditions.projetoId = projetoId;
        }

        if (grupoId) {
            whereConditions.grupoId = grupoId;
        }

        // Obtém todas as análises do talhão com os filtros aplicados
        const analyses = await Analise.findAll({
            where: whereConditions,
            attributes: [
                'id', 'cherry', 'coordenadas', 'dry', 'green', 'greenYellow',
                'grupoId', 'imagemResultadoUrl', 'imagemUrl', 'projetoId',
                'raisin', 'total', 'createdAt', 'lastUpdatedAt'
            ],
            order: [
                ['lastUpdatedAt', 'DESC'],  // Ordena primeiro por lastUpdatedAt
                ['createdAt', 'DESC']       // Depois, se necessário, por createdAt
            ]
        });

        // Estrutura do retorno conforme solicitado
        res.json({
            page: 1,            // Definido como 1 por padrão, já que não haverá paginação
            pages: 1,           // Definido como 1 por padrão
            pageSize: analyses.length,
            result: analyses,
            success: true,
            messages: [],
            hasErrors: false,
            hasImpediments: false,
            hasWarnings: false
        });
    } catch (error) {
        console.error('Erro ao obter análises do talhão:', error);
        res.status(500).json({
            message: 'Erro ao obter análises do talhão',
            success: false,
            hasErrors: true
        });
    }
};

interface AnaliseResult {
    Id: string;
    Cherry: number;
    Coordenadas: string;
    Dry: number;
    Green: number;
    GreenYellow: number;
    GrupoId: string;
    ImagemResultadoUrl: string;
    ImagemUrl: string;
    ProjetoId: string;
    Raisin: number;
    Total: number;
    CreatedAt: Date;
    LastUpdatedAt: Date;
    TalhaoId: string;
    TalhaoNome: string;
    FazendaNome: string;
    FazendaId: string;
}

// Obter análises com filtros
export const getFilteredAnalyses = async (req: Request, res: Response) => {
    const { fazendaId, talhaoId, grupoId, projetoId, startDate, endDate, page = 1, pageSize = 9, sortDirection = 'desc' } = req.query;

    try {
        // Obtém o token do cabeçalho
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Obtém o ID do usuário do token
        const pessoaId = authService.verifyToken(token)?.userId;
        if (!pessoaId) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Certifique-se de que os valores sejam números válidos
        const currentPage = Math.max(Number(page) || 1, 1);
        const itemsPerPage = Math.max(Number(pageSize) || 9, 1);

        // Validar a direção da ordenação
        const validSortDirection = sortDirection === 'asc' ? 'ASC' : 'DESC';

        // Se não houver fazenda ou talhão selecionado, precisamos filtrar apenas as fazendas do usuário
        const userFazendasQuery = !fazendaId ? `
            AND f.Id IN (
                SELECT FazendaId 
                FROM tbPessoaFisicaFazenda 
                WHERE PessoaFisicaId = :pessoaId
            )
        ` : '';

        // Buscar análises com joins para Talhao e Fazenda
        const results = await sequelize.query<AnaliseResult>(`
            SELECT 
                a.*,
                t.Nome as TalhaoNome,
                f.Nome as FazendaNome,
                f.Id as FazendaId
            FROM tbAnalise a
            LEFT JOIN tbTalhao t ON a.TalhaoId = t.Id
            LEFT JOIN tbFazenda f ON t.FazendaId = f.Id
            WHERE 1=1
            ${talhaoId ? ' AND a.TalhaoId = :talhaoId' : ''}
            ${fazendaId ? ' AND f.Id = :fazendaId' : ''}
            ${grupoId ? ' AND a.GrupoId = :grupoId' : ''}
            ${projetoId ? ' AND a.ProjetoId = :projetoId' : ''}
            ${startDate && endDate ? ' AND a.CreatedAt BETWEEN :startDate AND :endDate' : ''}
            ${userFazendasQuery}
            ORDER BY a.CreatedAt ${validSortDirection}
            OFFSET :offset ROWS
            FETCH NEXT :limit ROWS ONLY
        `, {
            replacements: {
                talhaoId,
                fazendaId,
                grupoId,
                projetoId,
                startDate,
                endDate,
                pessoaId,
            offset: (currentPage - 1) * itemsPerPage,
                limit: itemsPerPage
            },
            type: QueryTypes.SELECT
        });

        // Contar total de registros para paginação
        const [countResult] = await sequelize.query(`
            SELECT COUNT(*) as total
            FROM tbAnalise a
            LEFT JOIN tbTalhao t ON a.TalhaoId = t.Id
            LEFT JOIN tbFazenda f ON t.FazendaId = f.Id
            WHERE 1=1
            ${talhaoId ? ' AND a.TalhaoId = :talhaoId' : ''}
            ${fazendaId ? ' AND f.Id = :fazendaId' : ''}
            ${grupoId ? ' AND a.GrupoId = :grupoId' : ''}
            ${projetoId ? ' AND a.ProjetoId = :projetoId' : ''}
            ${startDate && endDate ? ' AND a.CreatedAt BETWEEN :startDate AND :endDate' : ''}
            ${userFazendasQuery}
        `, {
            replacements: {
                talhaoId,
                fazendaId,
                grupoId,
                projetoId,
                startDate,
                endDate,
                pessoaId
            },
            type: QueryTypes.SELECT
        });

        const total = (countResult as any).total;
        const totalPages = Math.ceil(total / itemsPerPage);

        if (currentPage > totalPages) {
            return res.status(404).json({
                message: 'Página não encontrada',
                success: false,
                hasErrors: true,
                result: [],
                page: currentPage,
                pages: totalPages,
            });
        }

        // Formatar os resultados
        const formattedResults = (results as AnaliseResult[]).map(row => ({
            id: row.Id,
            cherry: row.Cherry,
            coordenadas: row.Coordenadas,
            dry: row.Dry,
            green: row.Green,
            greenYellow: row.GreenYellow,
            grupoId: row.GrupoId,
            imagemResultadoUrl: row.ImagemResultadoUrl,
            imagemUrl: row.ImagemUrl,
            projetoId: row.ProjetoId,
            raisin: row.Raisin,
            total: row.Total,
            createdAt: row.CreatedAt,
            lastUpdatedAt: row.LastUpdatedAt,
            talhaoId: row.TalhaoId,
            talhaoNome: row.TalhaoNome || 'Talhão não encontrado',
            fazendaNome: row.FazendaNome || 'Fazenda não encontrada',
            fazendaId: row.FazendaId
        }));

        res.json({
            page: currentPage,
            pages: totalPages,
            pageSize: itemsPerPage,
            result: formattedResults,
            success: true,
            messages: [],
            hasErrors: false,
            hasImpediments: false,
            hasWarnings: false
        });
    } catch (error) {
        console.error('Erro ao obter análises com filtros:', error);
        res.status(500).json({
            message: 'Erro ao obter análises com filtros',
            success: false,
            hasErrors: true,
            error
        });
    }
};

// Novo método para obter a última análise de um talhão
export const getUltimaAnaliseTalhao = async (req: Request, res: Response) => {
    const { talhaoId } = req.params;

    try {
        const analise = await Analise.findOne({
            where: { TalhaoId: talhaoId },
            order: [['createdAt', 'DESC']],
            attributes: [
                'id', 'cherry', 'coordenadas', 'dry', 'green', 'greenYellow',
                'grupoId', 'imagemResultadoUrl', 'imagemUrl', 'projetoId',
                'raisin', 'total', 'createdAt', 'lastUpdatedAt'
            ]
        });

        if (!analise) {
            return res.status(404).json({
                message: 'Nenhuma análise encontrada para este talhão',
                success: false
            });
        }

        res.json({
            success: true,
            result: analise
        });
    } catch (error) {
        console.error('Erro ao buscar última análise:', error);
        res.status(500).json({
            message: 'Erro ao buscar última análise',
            success: false,
            error
        });
    }
};

export const addFastAnalysis = async (req: Request, res: Response) => {
    console.log("Iniciando addFastAnalysis");
    const { lado, analiseRapidaId, grupoId } = req.body;
    const formFile = req.file;

    if (!formFile) {
        console.error("Erro: Arquivo de imagem não detectado");
        return res.status(400).json({ message: "Arquivo de imagem não detectado" });
    }

    if (!lado || !analiseRapidaId) {
        console.error("Erro: Parâmetros obrigatórios não fornecidos", { lado, analiseRapidaId });
        return res.status(400).json({ message: "Lado e analiseRapidaId são obrigatórios" });
    }

    const transaction = await sequelize.transaction();

    try {
        // Gera um nome único para o arquivo usando UUID
        const fileExtension = formFile.originalname.split('.').pop() || 'jpg';
        const fileName = `${uuidv4()}.${fileExtension}`;
        console.log(`Nome do arquivo gerado: ${fileName}`);

        // Salva o arquivo no disco
        const uploadsDir = path.join(__dirname, "../../uploads");
        
        // Certifica que o diretório existe
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log(`Diretório de uploads criado: ${uploadsDir}`);
        }
        
        const filePath = path.join(uploadsDir, fileName);
        console.log(`Caminho do arquivo: ${filePath}`);

        // Se tiver buffer, salva o buffer
        if (formFile.buffer) {
            await fsp.writeFile(filePath, formFile.buffer);
            console.log("Arquivo salvo do buffer");
        }

        // 1) Upload imagem original no Azure
        const originalImageUrl = await uploadToAzureByFast(filePath, fileName);
        console.log(`URL da imagem original: ${originalImageUrl}`);

        // 2) Ler metadados EXIF (data e coordenadas)
        let photoDate: Date | null = null;
        let photoCoords: string | null = null;

        try {
            const fileBuffer = formFile.buffer || await fsp.readFile(filePath);
            const tags = exifReader.load(fileBuffer);

            const dateTimeOriginal = tags.DateTimeOriginal?.description;
            if (dateTimeOriginal) {
                photoDate = new Date(dateTimeOriginal);
            }

            const gpsLat = tags.GPSLatitude?.description;
            const gpsLon = tags.GPSLongitude?.description;
            if (gpsLat && gpsLon) {
                photoCoords = `${gpsLat},${gpsLon}`;
            }
        } catch (exifError) {
            console.warn("Não foi possível ler metadados EXIF:", exifError);
        }

        // 3) Chamar a API de predição
        const formData = new FormData();
        formData.append("image", fs.createReadStream(filePath), fileName);

        const predictionResponse = await axios.post(
            `${process.env.PREDICTION_REQUEST_URL}`,
            formData,
            { headers: formData.getHeaders() }
        );
        
        const predictionResult = predictionResponse.data;
        console.log("Resultado da predição:", predictionResult);

        const { cherry, dry, green, greenYellow, raisin, total } = predictionResult.dataframe;

        if (cherry == null || dry == null || green == null || greenYellow == null || raisin == null || total == null) {
            console.error("Erro: Dados incompletos recebidos da API externa.");
            await transaction.rollback();
            return res.status(500).json({ message: "A API externa retornou dados incompletos." });
        }

        // 4) Se tiver imagem processada, subir também
        let processedImageUrl: string | null = null;
        if (predictionResult.image) {
            const processedImageBuffer = Buffer.from(predictionResult.image, "base64");
            const processedFileName = `resultado_${fileName}`;
            const processedFilePath = path.join(uploadsDir, processedFileName);
            await fsp.writeFile(processedFilePath, processedImageBuffer);

            processedImageUrl = await uploadToAzureByFast(processedFilePath, processedFileName);
            console.log(`URL da imagem processada: ${processedImageUrl}`);

            // Remove a imagem processada do disco
            await fsp.unlink(processedFilePath);
        }

        // 5) Inserir no banco (tbAnalise)
        console.log("Criando registro de análise com os dados:", {
            analiseRapidaId,
            grupoId,
            lado,
            cherry,
            dry,
            green,
            greenYellow,
            raisin,
            total,
            imagemUrl: originalImageUrl,
            imagemResultadoUrl: processedImageUrl,
            coordenadas: photoCoords,
            createdAt: photoDate || new Date()
        });

        const newAnalysis = await Analise.create({
            analiseRapidaId,
            grupoId,
            lado,
            cherry,
            dry,
            green,
            greenYellow,
            raisin,
            total,
            imagemUrl: originalImageUrl,
            imagemResultadoUrl: processedImageUrl,
            coordenadas: photoCoords,
            createdAt: photoDate || new Date(),
            lastUpdatedAt: new Date()
        }, { transaction });

        await transaction.commit();
        console.log("Análise criada com sucesso:", newAnalysis.id);

        // Remove o arquivo original do disco
        await fsp.unlink(filePath);

        res.status(200).json({
            message: "Análise efetuada com sucesso",
            analiseId: newAnalysis.id
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Erro ao adicionar análise:", error);
        res.status(500).json({ message: "Erro ao adicionar análise", error });
    }
};

export const addPlotAnalysis = async (req: Request, res: Response) => {

    console.log("Entrando no: addPlotAnalysis", req.params);

    const { talhaoId } = req.params;
    const formFile = req.file;

    if (!formFile) {
        console.log('Erro: Arquivo de imagem não detectado');
        return res.status(400).json({ message: 'Arquivo de imagem não detectado' });
    }

    try {
        const talhaoExists = await Talhao.findByPk(talhaoId);
        if (!talhaoExists) {
            console.log(`Erro: Talhão com ID ${talhaoId} não encontrado`);
            return res.status(404).json({ message: 'Talhão não encontrado' });
        }

        // 1) Upload imagem original no Azure
        const originalImageUrl = await uploadToAzure(formFile.buffer, formFile.originalname);
        console.log(`URL da imagem original: ${originalImageUrl}`);

        // 2) Ler metadados EXIF (data e coordenadas)
        let photoDate: Date | null = null;
        let photoCoords: string | null = null;

        try {
            // Converter para ArrayBuffer
            const arrayBuffer = toArrayBuffer(formFile.buffer);
            // Carregar tags
            const tags = exifReader.load(arrayBuffer);

            // Data
            // exifReader geralmente armazena a data em `tags.DateTimeOriginal.description`
            const dateTimeOriginal = tags.DateTimeOriginal?.description;
            if (dateTimeOriginal) {
                photoDate = parseExifDate(dateTimeOriginal);
            }

            // GPS
            // Se existirem, ficam em tags.GPSLatitude, tags.GPSLongitude
            const gpsLat = tags.GPSLatitude?.description;
            const gpsLon = tags.GPSLongitude?.description;
            if (gpsLat && gpsLon) {
                // ex: "12° 34' 56\" N" e "98° 76' 54\" W"
                // Você pode armazenar "12° 34' 56\" N,98° 76' 54\" W"
                // ou tentar converter para decimal; aqui faço algo simples:
                photoCoords = gpsLat + ',' + gpsLon;
            }
        } catch (exifError) {
            // Se não conseguir ler EXIF, não aborta, só loga
            console.warn('Não foi possível ler metadados EXIF:', exifError);
        }

        // 3) Chamar a API de predição
        const formData = new FormData();
        formData.append('image', formFile.buffer, formFile.originalname);

        const predictionResponse = await axios.post(
            `${process.env.PREDICTION_REQUEST_URL}`,
            formData,
            {
                headers: formData.getHeaders(),
            }
        );
        const predictionResult = predictionResponse.data;
        console.log('Resultado da previsão:', predictionResult);

        const { cherry, dry, green, greenYellow, raisin, total } = predictionResult.dataframe;

        if (cherry == null || dry == null || green == null || greenYellow == null || raisin == null || total == null) {
            console.log('Erro: Dados incompletos recebidos da API externa.');
            return res.status(500).json({ message: 'A API externa retornou dados incompletos.' });
        }

        // 4) Se tiver imagem processada, subir também
        let processedImageUrl: string | null = null;
        if (predictionResult.image) {
            const processedImageBuffer = Buffer.from(predictionResult.image, 'base64');
            processedImageUrl = await uploadToAzure(processedImageBuffer, `resultado_${formFile.originalname}`);
            console.log(`URL da imagem processada: ${processedImageUrl}`);
        }

        console.log('Criando análise no banco de dados com os seguintes dados:', {
            talhaoId,
            cherry,
            dry,
            green,
            greenYellow,
            raisin,
            total,
            imagemUrl: originalImageUrl,
            imagemResultadoUrl: processedImageUrl,
            coordenadas: photoCoords,
            createdAt: photoDate || new Date() // se não tiver data EXIF, pega data atual
        });

        // 5) Inserir no banco (tabela tbAnalise)
        const newAnalysis = await Analise.create({
            talhaoId,
            cherry,
            dry,
            green,
            greenYellow,
            raisin,
            total,
            imagemUrl: originalImageUrl,
            imagemResultadoUrl: processedImageUrl,
            coordenadas: photoCoords,
            createdAt: photoDate || new Date(),
            lastUpdatedAt: new Date()
        });

        console.log('Análise criada com sucesso no banco de dados:', newAnalysis);

        res.status(200).json({
            message: 'Análise efetuada.',
            analiseId: newAnalysis.id
        });
    } catch (error) {
        console.error('Erro ao adicionar análise ao talhão:', error);
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

export const addTalhaoDesenho = async (req: Request, res: Response) => {
    const { talhaoId, coordenadas } = req.body;

    if (!talhaoId || !coordenadas || coordenadas.length === 0) {
        return res.status(400).json({ message: 'Talhão ID e coordenadas são obrigatórios' });
    }

    try {
        const desenho = await TalhaoDesenho.create({
            talhaoId,
            desenhoGeometria: Sequelize.fn('ST_GeomFromText', `POLYGON((${coordenadas.join(',')}))`),
        });

        res.status(201).json(desenho);
    } catch (error) {
        console.error('Erro ao salvar desenho:', error);
        res.status(500).json({ message: 'Erro ao salvar desenho', error });
    }
};

export const getTalhaoDesenho = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const desenho = await TalhaoDesenho.findOne({
            where: { talhaoId: id }
        });

        if (!desenho) {
            return res.status(404).json({ message: 'Desenho do talhão não encontrado' });
        }

        res.json(desenho);
    } catch (error) {
        console.error('Erro ao buscar desenho do talhão:', error);
        res.status(500).json({ message: 'Erro ao buscar desenho do talhão', error });
    }
};

export default { getAllTalhoes, getTalhaoById, createTalhao, updateTalhao, deleteTalhao, getPlotAnalyses, addPlotAnalysis, getPlotAnalysesChart, getTalhoesByFazenda, getFilteredAnalyses, addTalhaoDesenho, getTalhaoDesenho };

