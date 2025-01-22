import { Router } from 'express';
import {
    registerUser,
    authenticateUser,
    updateUser,
    deleteUser,
    refreshAccessToken,
    getUserDetails
} from '../controllers/UsuarioController';
import { getAllCultivares, getCultivarById, createCultivar, updateCultivar, deleteCultivar } from '../controllers/CultivaresController';
import { getAllFazendas, getFazendaById, createFazenda, updateFazenda, deleteFazenda } from '../controllers/FazendaController';
import {
    getAllTalhoes,
    getTalhaoById,
    createTalhao,
    updateTalhao,
    deleteTalhao,
    getTalhoesByFazenda, addPlotAnalysis, getPlotAnalyses, getFilteredAnalyses
} from '../controllers/TalhaoController';
import {compareAnalyses, getDataToChartBy, getEstatisticas} from '../controllers/EstatisticasController';
import { getAllPerfis, getPerfilById, createPerfil, updatePerfil, deletePerfil } from '../controllers/PerfisController';
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/RolesController';
import { getAllGrupos, getGrupoById, createGrupo, updateGrupo, deleteGrupo } from '../controllers/GrupoController';
import { getAllProjetos, getProjetoById, createProjeto, updateProjeto, deleteProjeto } from '../controllers/ProjetoController';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import multer from "multer";
import {
    buscarAnalisesRapidasPorGrupo, checkProcessingStatus,
    compararAnalisesRapidas,
    criarAnaliseRapida
} from "../controllers/AnaliseRapidaController";
import express from "express";
import path from "path";
import fs from "fs";
import {pipeline} from "stream";


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


// Função para salvar imagens em paralelo usando Streams
const saveImageStream = async (file: Express.Multer.File) => {
    const outputPath = path.join(__dirname, "../../uploads", `stream-${file.originalname}`);
    const writeStream = fs.createWriteStream(outputPath);

    // Usamos a função pipeline para lidar com erros automaticamente
    await pipeline(file.stream, writeStream);

    console.log(`✅ Imagem salva via stream: ${outputPath}`);
    return outputPath;
};


const upload = multer({ storage });

// Definição das rotas de usuários (sem autenticação)
router.post('/registrar', registerUser);
router.post('/auth/token', authenticateUser);
router.post('/auth/refresh-token', refreshAccessToken);

// Todas as outras rotas requerem autenticação
router.use(authenticateJWT); // Aplica o middleware a todas as rotas a seguir

// Rotas de usuários
router.put('/usuarios/:id', updateUser);
router.delete('/usuarios/:id', deleteUser);
router.get('/conta', getUserDetails);

// Cultivares
router.get('/cultivares', getAllCultivares);
router.get('/cultivares/:id', getCultivarById);
router.post('/cultivares', createCultivar);
router.put('/cultivares/:id', updateCultivar);
router.delete('/cultivares/:id', deleteCultivar);

// Fazendas
router.get('/fazendas', getAllFazendas);
router.get('/fazendas/:id', getFazendaById);
router.post('/fazendas', createFazenda);
router.put('/fazendas/:id', updateFazenda);
router.delete('/fazendas/:id', deleteFazenda);

// Talhões
router.get('/talhoes', getAllTalhoes);
router.get('/talhoes/:id', getTalhaoById);
router.post('/talhoes', createTalhao);
router.put('/talhoes/:id', updateTalhao);
router.delete('/talhoes/:id', deleteTalhao);
router.get('/talhoes/fazenda/:fazendaId', getTalhoesByFazenda);

router.post('/talhoes/:talhaoId/analises', upload.single('formFile'), addPlotAnalysis);
router.get('/talhoes/:talhaoId/analises', getPlotAnalyses);
router.get('/analises', getFilteredAnalyses);
router.post('/analises-rapidas/comparar', compararAnalisesRapidas);


// Rotas de análise rápida
router.post(
    "/analises-rapidas",
    upload.fields([
        { name: "imagensEsquerdo", maxCount: 20 },
        { name: "imagensDireito", maxCount: 20 },
    ]),
    (req, res, next) => {
        console.log("✅ Upload concluído. Chamando próximo middleware...");
        next();
    },
    criarAnaliseRapida
);


router.get("/analises-rapidas/:grupoId", buscarAnalisesRapidasPorGrupo);
router.post("/analises-rapidas/comparar", compararAnalisesRapidas);
// Rota para verificar o status do processamento de uma análise rápida
router.get('/analise-rapida/status/:analiseRapidaId', checkProcessingStatus);

// Estatísticas
router.get('/estatisticas', getEstatisticas);
router.get('/chart', getDataToChartBy);
router.post('/compare-analises', compareAnalyses);

// Perfis
router.get('/perfis', getAllPerfis);
router.get('/perfis/:id', getPerfilById);
router.post('/perfis', createPerfil);
router.put('/perfis/:id', updatePerfil);
router.delete('/perfis/:id', deletePerfil);

// Roles
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

// Grupos
router.get('/grupos', getAllGrupos);
router.get('/grupos/:id', getGrupoById);
router.post('/grupos', createGrupo);
router.put('/grupos/:id', updateGrupo);
router.delete('/grupos/:id', deleteGrupo);

// Projetos
router.get('/projetos', getAllProjetos);
router.get('/projetos/:id', getProjetoById);
router.post('/projetos', createProjeto);
router.put('/projetos/:id', updateProjeto);
router.delete('/projetos/:id', deleteProjeto);

export default router;
