import axios from 'axios';

const API_URL = process.env.BASE_URL || 'http://localhost:3000/api/';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Interceptor para adicionar o token de autorização e o Content-Type em cada requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
});

// Função para tentar o refresh do token
const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('Refresh token não encontrado.');
        }

        const response = await api.post('/auth/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.result;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        return accessToken;
    } catch (err) {
        console.error('Erro ao tentar refresh do token:', err);
        return null;
    }
};

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
                error.config.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(error.config);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Funções da API
export default {
    // Funções de autenticação
    loginUser: (data: { email: string; password: string }) =>
        api.post('/auth/token', data),
    refreshAccessToken: (data: { refreshToken: string }) =>
        api.post('/auth/refresh-token', data),
    registerUser: (data: { nomeCompleto: string; email: string; password: string, cpf: string }) =>
        api.post('/registrar', data), // Este endpoint não requer autenticação
    authenticateUser: (data: { email: string; password: string }) =>
        api.post('/auth/token', data), // Este endpoint não requer autenticação
    updateUser: (id: string, data: { nomeCompleto: string; email: string }) =>
        api.put(`/usuarios/${id}`, data), // Requer autenticação
    deleteUser: (id: string) =>
        api.delete(`/usuarios/${id}`), // Requer autenticação

    // Função para obter talhões de uma fazenda (por fazenda)
    getTalhoesByFazenda: (fazendaId: string) =>
        api.get(`/talhoes/fazenda/${fazendaId}`), // Requer autenticação

    // Estatísticas e Dashs
    getEstatisticas: () => api.get('/estatisticas'), // Requer autenticação

    getDataToChartBy: (data: { farmId: string, plotId: string, startDate: string, endDate: string, reportType: string }) =>
        api.get('/chart', { params: data }),

    // Funcionalidades de CRUD para Cultivares
    getAllCultivares: () => api.get('/cultivares'), // Requer autenticação
    getCultivarById: (id: number) => api.get(`/cultivares/${id}`), // Requer autenticação
    createCultivar: (data: { nome: string; especie: string }) =>
        api.post('/cultivares', data), // Requer autenticação
    updateCultivar: (id: number, data: { nome: string; especie: string }) =>
        api.put(`/cultivares/${id}`, data), // Requer autenticação
    deleteCultivar: (id: number) =>
        api.delete(`/cultivares/${id}`), // Requer autenticação

    // Fazendas
    getAllFazendas: () => api.get('/fazendas'), // Requer autenticação
    getFazendaById: (id: string) => api.get(`/fazendas/${id}`), // Requer autenticação
    createFazenda: (data: { nome: string }) =>
        api.post('/fazendas', data), // Requer autenticação
    updateFazenda: (id: string, data: { nome: string }) =>
        api.put(`/fazendas/${id}`, data), // Requer autenticação
    deleteFazenda: (id: string) =>
        api.delete(`/fazendas/${id}`), // Requer autenticação

    // Talhões
    getAllTalhoes: () => api.get('/talhoes'), // Requer autenticação
    getTalhaoById: (id: string) => api.get(`/talhoes/${id}`), // Requer autenticação
    createTalhao: (data: { nome: string; fazendaId: string; dataPlantio: string; espacamentoLinhas: number; espacamentoMudas: number; cultivarId: number }) =>
        api.post('/talhoes', data), // Requer autenticação
    updateTalhao: (id: string, data: { nome: string; fazendaId: string; dataPlantio: string; espacamentoLinhas: number; espacamentoMudas: number; cultivarId: number }) =>
        api.put(`/talhoes/${id}`, data), // Requer autenticação
    deleteTalhao: (id: string) => api.delete(`/talhoes/${id}`), // Requer autenticação

    // Análises de talhões
    addPlotAnalysis: (talhaoId: string, formData: any) =>
        api.post(`/talhoes/${talhaoId}/analises`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }), // Requer autenticação

    getPlotAnalyses: (talhaoId: string) =>
        api.get(`/talhoes/${talhaoId}/analises`), // Requer autenticação

    getFilteredAnalyses : (filters: any) =>
        api.get('/analises', { params: filters }), // Requer autenticação

    compareAnalises: (data: { filtersLeft: any, filtersRight: any }) =>
        api.post('/compare-analises', data),

    // Funções de análise rápida
    createRapidAnalysisGroup: (formData: any) =>
        api.post('/analises-rapidas', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    getRapidAnalysisGroup: (grupoId: string) =>
        api.get(`/analises-rapidas/${grupoId}`),

    compareRapidAnalyses: (data: { grupoId: string }) =>
        api.post('/analises-rapidas/comparar', data),

    // Perfis
    getAllPerfis: () => api.get('/perfis'), // Requer autenticação
    getPerfilById: (id: string) => api.get(`/perfis/${id}`), // Requer autenticação
    createPerfil: (data: { nome: string; descricao: string; systemKey: string }) =>
        api.post('/perfis', data), // Requer autenticação
    updatePerfil: (id: string, data: { nome: string; descricao: string; systemKey: string }) =>
        api.put(`/perfis/${id}`, data), // Requer autenticação
    deletePerfil: (id: string) =>
        api.delete(`/perfis/${id}`), // Requer autenticação

    // Roles
    getAllRoles: () => api.get('/roles'), // Requer autenticação
    getRoleById: (id: string) => api.get(`/roles/${id}`), // Requer autenticação
    createRole: (data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.post('/roles', data), // Requer autenticação
    updateRole: (id: string, data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.put(`/roles/${id}`, data), // Requer autenticação
    deleteRole: (id: string) =>
        api.delete(`/roles/${id}`), // Requer autenticação

    // Grupos
    getAllGrupos: () => api.get('/grupos'), // Requer autenticação
    getGrupoById: (id: string) => api.get(`/grupos/${id}`), // Requer autenticação
    createGrupo: (data: { nome: string; }) =>
        api.post('/grupos', data), // Requer autenticação
    updateGrupo: (id: string, data: { nome: string; }) =>
        api.put(`/grupos/${id}`, data), // Requer autenticação
    deleteGrupo: (id: string) =>
        api.delete(`/grupos/${id}`), // Requer autenticação

    // Projetos
    getAllProjetos: () => api.get('/projetos'), // Requer autenticação
    getProjetoById: (id: string) => api.get(`/projetos/${id}`), // Requer autenticação
    createProjeto: (data: { nome: string;  grupoId: string }) =>
        api.post('/projetos', data), // Requer autenticação
    updateProjeto: (id: string, data: { nome: string; grupoId: string }) =>
        api.put(`/projetos/${id}`, data), // Requer autenticação
    deleteProjeto: (id: string) =>
        api.delete(`/projetos/${id}`), // Requer autenticação
};
