import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
        if (error.response && error.response.status === 401) {
            // Se o token estiver expirado, tenta refresh
            const newToken = await refreshToken();
            if (newToken) {
                // Se o refresh do token foi bem-sucedido, refaz a requisição original com o novo token
                error.config.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(error.config);  // Refaz a requisição com o novo token
            } else {
                // Se o refresh falhou, remove o token e redireciona para login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';  // Redireciona para a tela de login
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Funções da API
export default {
    loginUser: (data: { email: string; password: string }) =>
        api.post('/auth/token', data),
    refreshAccessToken: (data: { refreshToken: string }) =>
        api.post('/auth/refresh-token', data),
    registerUser: (data: { nomeCompleto: string; email: string; password: string }) =>
        api.post('/registrar', data), // Este endpoint não requer autenticação
    authenticateUser: (data: { email: string; password: string }) =>
        api.post('/auth/token', data), // Este endpoint não requer autenticação
    updateUser: (id: number, data: { nomeCompleto: string; email: string }) =>
        api.put(`/usuarios/${id}`, data), // Requer autenticação
    deleteUser: (id: number) =>
        api.delete(`/usuarios/${id}`), // Requer autenticação

    // Cultivares
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
    getFazendaById: (id: number) => api.get(`/fazendas/${id}`), // Requer autenticação
    createFazenda: (data: { nome: string }) =>
        api.post('/fazendas', data), // Requer autenticação
    updateFazenda: (id: number, data: { nome: string }) =>
        api.put(`/fazendas/${id}`, data), // Requer autenticação
    deleteFazenda: (id: number) =>
        api.delete(`/fazendas/${id}`), // Requer autenticação

    // Talhões
    getAllTalhoes: () => api.get('/talhoes'), // Requer autenticação
    getTalhaoById: (id: number) => api.get(`/talhoes/${id}`), // Requer autenticação
    createTalhao: (data: {
        nome: string;
        fazendaId: string;
        dataPlantio: string; // Data do plantio
        espacamentoLinhas: number; // Espaçamento entre linhas
        espacamentoMudas: number; // Espaçamento entre mudas
        cultivarId: number; // ID do cultivar
    }) => api.post('/talhoes', data), // Requer autenticação
    updateTalhao: (id: string, data: {
        nome: string;
        fazendaId: string;
        dataPlantio: string; // Data do plantio
        espacamentoLinhas: number; // Espaçamento entre linhas
        espacamentoMudas: number; // Espaçamento entre mudas
        cultivarId: number; // ID do cultivar
    }) => api.put(`/talhoes/${id}`, data), // Requer autenticação
    deleteTalhao: (id: string) => api.delete(`/talhoes/${id}`), // Requer autenticação
    // Estatísticas
    getEstatisticas: () => api.get('/estatisticas'), // Requer autenticação

    // Perfis
    getAllPerfis: () => api.get('/perfis'), // Requer autenticação
    getPerfilById: (id: number) => api.get(`/perfis/${id}`), // Requer autenticação
    createPerfil: (data: { nome: string; descricao: string; systemKey: string }) =>
        api.post('/perfis', data), // Requer autenticação
    updatePerfil: (id: number, data: { nome: string; descricao: string; systemKey: string }) =>
        api.put(`/perfis/${id}`, data), // Requer autenticação
    deletePerfil: (id: number) =>
        api.delete(`/perfis/${id}`), // Requer autenticação

    // Roles
    getAllRoles: () => api.get('/roles'), // Requer autenticação
    getRoleById: (id: number) => api.get(`/roles/${id}`), // Requer autenticação
    createRole: (data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.post('/roles', data), // Requer autenticação
    updateRole: (id: number, data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.put(`/roles/${id}`, data), // Requer autenticação
    deleteRole: (id: number) =>
        api.delete(`/roles/${id}`), // Requer autenticação

    // Grupos
    getAllGrupos: () => api.get('/grupos'), // Requer autenticação
    getGrupoById: (id: number) => api.get(`/grupos/${id}`), // Requer autenticação
    createGrupo: (data: { nome: string; descricao: string }) =>
        api.post('/grupos', data), // Requer autenticação
    updateGrupo: (id: number, data: { nome: string; descricao: string }) =>
        api.put(`/grupos/${id}`, data), // Requer autenticação
    deleteGrupo: (id: number) =>
        api.delete(`/grupos/${id}`), // Requer autenticação

    // Projetos
    getAllProjetos: () => api.get('/projetos'), // Requer autenticação
    getProjetoById: (id: number) => api.get(`/projetos/${id}`), // Requer autenticação
    createProjeto: (data: { nome: string; descricao: string; dataInicio: Date; dataFim: Date; grupoId: number }) =>
        api.post('/projetos', data), // Requer autenticação
    updateProjeto: (id: number, data: { nome: string; descricao: string; dataInicio: Date; dataFim: Date; grupoId: number }) =>
        api.put(`/projetos/${id}`, data), // Requer autenticação
    deleteProjeto: (id: number) =>
        api.delete(`/projetos/${id}`), // Requer autenticação
};
