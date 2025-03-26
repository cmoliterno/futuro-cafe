import axios from 'axios';

const API_URL = process.env.REACT_BASE_URL || 'https://api.futurocafe.com.br/api/';

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
    // Função para enviar o email com o link de redefinição de senha
    forgotPassword: (data: { email: string }) =>
        api.post('/auth/forgot-password', data), // Envia o email para redefinir a senha

    // Função para redefinir a senha com o token
    resetPassword: (data: { token: string, newPassword: string }) =>
        api.post('/auth/reset-password', data),

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

    // Método para buscar estatísticas específicas de um talhão
    getEstatisticasTalhao: (talhaoId: string, params: { dataInicio: string, dataFim: string }) =>
        api.get(`/talhoes/${talhaoId}/estatisticas`, { params }),

    // Funcionalidades de CRUD para Cultivares
    getAllCultivares: () => api.get('/cultivares'), // Requer autenticação
    getCultivarById: (id: number) => api.get(`/cultivares/${id}`), // Requer autenticação
    getCultivarEspecie: (id: number) => api.get(`/cultivar-especies/${id}`), // Para buscar uma espécie específica pelo ID
    getAllCultivarEspecies: () => api.get('/cultivar-especies'), // Para listar todas as espécies
    createCultivar: (data: { 
      nome: string; 
      especie: string; 
      mantenedor: string;
      registro: string;
      dataPlantio?: string; 
      espacamentoLinhasMetros?: number; 
      espacamentoMudasMetros?: number; 
      talhaoId?: string 
    }) => api.post('/cultivares', data), // Requer autenticação
    updateCultivar: (id: number, data: { 
      nome: string; 
      especie?: string; 
      mantenedor?: string;
      registro?: string;
    }) => api.put(`/cultivares/${id}`, data), // Requer autenticação
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
    getAllTalhoes: async () => {
        return api.get('/talhoes');
    },
    getTalhaoById: async (id: string) => {
        console.log(`API: Buscando talhão com ID ${id}`);
        const response = await api.get(`/talhoes/${id}`);
        console.log(`API: Resposta recebida para talhão ${id}:`, response.data);
        return response;
    },
    createTalhao: async (data: any) => {
        console.log('API: Criando talhão com dados:', data);
        return api.post('/talhoes', data);
    },
    updateTalhao: async (id: string, data: any) => {
        console.log(`API: Atualizando talhão ${id} com dados:`, data);
        return api.put(`/talhoes/${id}`, data);
    },
    deleteTalhao: async (id: string) => {
        return api.delete(`/talhoes/${id}`);
    },
    
    // Plantios
    createPlantio: (data: { 
        data: string | null; 
        espacamentoLinhasMetros: number | null; 
        espacamentoMudasMetros: number | null; 
        cultivarId: number | null;
        talhaoId: string 
    }) => api.post('/plantios', data), // Requer autenticação
    updatePlantio: (id: string, data: { 
        data?: string | null; 
        espacamentoLinhasMetros?: number | null; 
        espacamentoMudasMetros?: number | null; 
        cultivarId?: number | null;
        talhaoId?: string 
    }) => api.put(`/plantios/${id}`, data), // Requer autenticação
    deletePlantio: (id: string) => api.delete(`/plantios/${id}`), // Requer autenticação

    // Métodos para gerenciamento do desenho do talhão
    saveDesenhoTalhao: (talhaoId: string, desenho: any) => 
        api.post(`/talhoes/${talhaoId}/desenho`, { desenhoGeometria: desenho }), // Requer autenticação
    getDesenhoTalhao: (talhaoId: string) => 
        api.get(`/talhoes/${talhaoId}/desenho`), // Requer autenticação

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

    compareAnalises: (data: { filtersLeft: any, filtersRight: any }) => {
        console.log('API compareAnalises sendo chamada com:', JSON.stringify(data, null, 2));
        return api.post('/compare-analises', data).then(response => {
            console.log('API compareAnalises recebeu resposta:', JSON.stringify(response.data, null, 2));
            return response;
        }).catch(error => {
            console.error('API compareAnalises erro:', error);
            throw error;
        });
    },

    // Funções de análise rápida
    createRapidAnalysisGroup: (formData: any) =>
        api.post('/analises-rapidas', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    // Verifica o status do processamento
    async checkProcessingStatus(analiseRapidaId: string) {
        const response = await api.get(`/analise-rapida/status/${analiseRapidaId}`);
        return response.data;
    },

    getRapidAnalysisGroup: (grupoId: string) =>
        api.get(`/analises-rapidas/${grupoId}`),

    compareRapidAnalyses: (data: { analiseRapidaId: string }) =>
        api.post('/analises-rapidas/comparar', data),

    // Método para realizar análise rápida com base em um talhão e período
    realizarAnaliseRapida: (talhaoId: string, params: { tipoAnalise: string, dataInicio: string, dataFim: string }) =>
        api.get(`/talhoes/${talhaoId}/analise-rapida`, { params }),

    // Perfis
    getAllPerfis: () => api.get('/perfis'),
    getPerfilById: (id: string) => api.get(`/perfis/${id}`),
    createPerfil: (data: any) => api.post('/perfis', data),
    updatePerfil: (id: string, data: any) => api.put(`/perfis/${id}`, data),
    deletePerfil: (id: string) => api.delete(`/perfis/${id}`),

    // Roles
    getAllRoles: () => api.get('/roles'),
    getRoleById: (id: string) => api.get(`/roles/${id}`),
    createRole: (data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.post('/roles', data),
    updateRole: (id: string, data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.put(`/roles/${id}`, data),
    deleteRole: (id: string) => api.delete(`/roles/${id}`),

    // Grupos
    getAllGrupos: () => api.get('/grupos'),
    getGrupoById: (id: string) => api.get(`/grupos/${id}`),
    createGrupo: (data: { nome: string; }) => api.post('/grupos', data),
    updateGrupo: (id: string, data: { nome: string; }) => api.put(`/grupos/${id}`, data),
    deleteGrupo: (id: string) => api.delete(`/grupos/${id}`),

    // Projetos
    getAllProjetos: () => api.get('/projetos'),
    getProjetoById: (id: string) => api.get(`/projetos/${id}`),
    createProjeto: (data: { nome: string; grupoId: string }) => api.post('/projetos', data),
    updateProjeto: (id: string, data: { nome: string; grupoId: string }) => api.put(`/projetos/${id}`, data),
    deleteProjeto: (id: string) => api.delete(`/projetos/${id}`),
};