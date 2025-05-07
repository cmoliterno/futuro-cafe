import { Router } from 'express';
import {
    registerUser,
    authenticateUser,
    updateUser,
    deleteUser,
    refreshAccessToken,
    getUserDetails, forgotPassword, resetPassword,
    updatePassword
} from '../controllers/UsuarioController';
import { getAllCultivares, getCultivarById, createCultivar, updateCultivar, deleteCultivar } from '../controllers/CultivaresController';
import { getAllFazendas, getFazendaById, createFazenda, updateFazenda, deleteFazenda } from '../controllers/FazendaController';
import {
    getAllTalhoes,
    getTalhaoById,
    createTalhao,
    updateTalhao,
    deleteTalhao,
    getTalhoesByFazenda, addPlotAnalysis, getPlotAnalyses, getFilteredAnalyses, addTalhaoDesenho, getTalhaoDesenho, getUltimaAnaliseTalhao
} from '../controllers/TalhaoController';
import {compareAnalyses, getDataToChartBy, getEstatisticas} from '../controllers/EstatisticasController';
import { getAllPerfis, getPerfilById, createPerfil, updatePerfil, deletePerfil } from '../controllers/PerfisController';
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/RolesController';
import { getAllGrupos, getGrupoById, createGrupo, updateGrupo, deleteGrupo } from '../controllers/GrupoController';
import { getAllProjetos, getProjetoById, createProjeto, updateProjeto, deleteProjeto } from '../controllers/ProjetoController';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import multer from "multer";
import {
    buscarAnalisesRapidasPorGrupo, 
    getAnaliseRapidaHistorico,
    checkProcessingStatus,
    compararAnalisesRapidas,
    criarAnaliseRapida,
    excluirAnaliseRapida,
    getAnaliseRapidaById,
    consultarResultadosAnaliseRapida
} from "../controllers/AnaliseRapidaController";
import express, { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import {pipeline} from "stream";
import { getAllCultivarEspecies, getCultivarEspecieById } from '../controllers/CultivarEspecieController';
import { 
    verificarPermissaoRelatorios, 
    getFazendasParaRelatorio, 
    getTalhoesPorFazendaParaRelatorio, 
    gerarRelatorio 
} from '../controllers/RelatoriosController';
import { calcularPrevisaoTalhao, calcularPrevisaoTodasFazendas } from '../controllers/PrevisaoController';

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


const upload = multer({ storage: multer.memoryStorage() });

// Definição das rotas de usuários (sem autenticação)
router.post('/registrar', registerUser);
router.post('/auth/token', authenticateUser);
router.post('/auth/refresh-token', refreshAccessToken);
router.post('/auth/forgot-password', forgotPassword); // Rota para enviar email de redefinição de senha
router.post('/auth/reset-password', resetPassword); // Rota para redefinir a senha
router.post('/auth/update-password', updatePassword); // Rota para inativar o usuário

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

// Espécies de Cultivares
router.get('/cultivar-especies', getAllCultivarEspecies);
router.get('/cultivar-especies/:id', getCultivarEspecieById);

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

router.post('/talhoes/:id/desenho', addTalhaoDesenho);
router.get('/talhoes/:id/desenho', getTalhaoDesenho);

router.post('/talhoes/:talhaoId/analises', (upload.single('formFile') as unknown) as RequestHandler, addPlotAnalysis);
router.get('/talhoes/:talhaoId/analises', getPlotAnalyses);
router.get('/analises', getFilteredAnalyses);
router.get('/analises/talhao/:talhaoId/ultima', getUltimaAnaliseTalhao);


// Rotas para análise rápida
router.post('/analises-rapidas', (upload.fields([
    { name: 'imagensEsquerdo', maxCount: 20 },
    { name: 'imagensDireito', maxCount: 20 }
]) as unknown) as RequestHandler, criarAnaliseRapida);
router.get('/analises-rapidas/historico', getAnaliseRapidaHistorico);
router.get('/analises-rapidas/resultados/:analiseRapidaId', consultarResultadosAnaliseRapida);
router.get('/analises-rapidas/:id', getAnaliseRapidaById);
router.get('/analise-rapida/status/:analiseRapidaId', checkProcessingStatus);
router.post('/analises-rapidas/comparar', compararAnalisesRapidas);
router.delete('/analises-rapidas/:analiseRapidaId', excluirAnaliseRapida);

// Estatísticas
router.get('/estatisticas', getEstatisticas);
router.get('/chart', getDataToChartBy);
router.post('/compare-analises', compareAnalyses);

// Relatórios (requer permissão de Reports.Access)
router.get('/relatorios/permissao', verificarPermissaoRelatorios, (req, res) => {
  res.json({ permissao: true });
});
router.get('/relatorios/fazendas', verificarPermissaoRelatorios, getFazendasParaRelatorio);
router.get('/relatorios/talhoes', verificarPermissaoRelatorios, getTalhoesPorFazendaParaRelatorio);
router.post('/relatorios/gerar', verificarPermissaoRelatorios, gerarRelatorio);

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

// Previsão de Safra
router.get('/previsao/talhao/:talhaoId', calcularPrevisaoTalhao);
router.get('/previsao/todas-fazendas', calcularPrevisaoTodasFazendas);

export default router;
