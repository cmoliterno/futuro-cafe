import { Request, Response } from 'express';
import { Fazenda } from '../models/Fazenda';
import Talhao from '../models/Talhao';
import Plantio from '../models/Plantio';
import jwt from 'jsonwebtoken';
import Analise from "../models/Analise";
import {Op, Sequelize} from "sequelize";
import axios from "axios";
import FormData from 'form-data';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/AuthService';
import exifReader from 'exifreader';

const authService = new AuthService();
// Função auxiliar p/ converter Buffer => ArrayBuffer
function toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function parseExifDate(dateTimeString: string): Date | null {
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

export async function getAllTalhoes(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const pessoaId = authService.verifyToken(token)?.userId;

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

        const pessoaId = authService.verifyToken(token)?.userId;

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

// Obter análises com filtros
export const getFilteredAnalyses = async (req: Request, res: Response) => {
    const { fazendaId, talhaoId, grupoId, projetoId, startDate, endDate, page = 1, pageSize = 9 } = req.query;

    try {
        // Certifique-se de que os valores sejam números válidos
        const currentPage = Math.max(Number(page) || 1, 1);
        const itemsPerPage = Math.max(Number(pageSize) || 9, 1);

        const whereConditions: any = {};

        if (talhaoId) {
            whereConditions.TalhaoId = talhaoId;
        }

        if (grupoId) {
            whereConditions.grupoId = grupoId;
        }

        if (projetoId) {
            whereConditions.projetoId = projetoId;
        }

        if (startDate && endDate) {
            whereConditions.createdAt = {
                [Op.between]: [startDate, endDate]
            };
        }

        const { count, rows } = await Analise.findAndCountAll({
            where: whereConditions,
            attributes: [
                'id', 'cherry', 'coordenadas', 'dry', 'green', 'greenYellow',
                'grupoId', 'imagemResultadoUrl', 'imagemUrl', 'projetoId',
                'raisin', 'total', 'createdAt', 'lastUpdatedAt'
            ],
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
        });

        // Verificar se a página solicitada está além do limite
        const totalPages = Math.ceil(count / itemsPerPage);

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

        res.json({
            page: currentPage,
            pages: totalPages,
            pageSize: itemsPerPage,
            result: rows,
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
            hasErrors: true
        });
    }
};

export const addPlotAnalysis = async (req: Request, res: Response) => {
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

export default { getAllTalhoes, getTalhaoById, createTalhao, updateTalhao, deleteTalhao, getPlotAnalyses, addPlotAnalysis, getPlotAnalysesChart, getTalhoesByFazenda, getFilteredAnalyses };
