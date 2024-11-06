import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar o token de autorização e o Content-Type em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Verifica se config.headers está definido, caso contrário, inicializa como um objeto vazio
  config.headers = config.headers || {};
  
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});


export default {
    // Usuários
    loginUser: (data: { email: string; password: string }) =>
      api.post('/usuarios/authenticate', data),
    registerUser: (data: { nomeCompleto: string; email: string; password: string }) =>
        api.post('/usuarios/register', data),
    authenticateUser: (data: { email: string; password: string }) =>
        api.post('/usuarios/authenticate', data),
    updateUser: (id: number, data: { nomeCompleto: string; email: string }) =>
        api.put(`/usuarios/${id}`, data),
    deleteUser: (id: number) => api.delete(`/usuarios/${id}`),

    // Cultivares
    getAllCultivares: () => api.get('/cultivares'),
    getCultivarById: (id: number) => api.get(`/cultivares/${id}`),
    createCultivar: (data: { nome: string; especie: string }) => api.post('/cultivares', data),
    updateCultivar: (id: number, data: { nome: string; especie: string }) =>
        api.put(`/cultivares/${id}`, data),
    deleteCultivar: (id: number) => api.delete(`/cultivares/${id}`),

    // Fazendas
    getAllFazendas: () => api.get('/fazendas'),
    getFazendaById: (id: number) => api.get(`/fazendas/${id}`),
    createFazenda: (data: { nome: string; area: number }) => api.post('/fazendas', data),
    updateFazenda: (id: number, data: { nome: string; area: number }) =>
        api.put(`/fazendas/${id}`, data),
    deleteFazenda: (id: number) => api.delete(`/fazendas/${id}`),

    // Talhões
    getAllTalhoes: () => api.get('/talhoes'),
    getTalhaoById: (id: number) => api.get(`/talhoes/${id}`),
    createTalhao: (data: { nome: string; nomeResponsavel: string; fazendaId: number }) =>
        api.post('/talhoes', data),
    updateTalhao: (id: number, data: { nome: string; nomeResponsavel: string; fazendaId: number }) =>
        api.put(`/talhoes/${id}`, data),
    deleteTalhao: (id: number) => api.delete(`/talhoes/${id}`),

    // Estatísticas
    getEstatisticas: () => api.get('/estatisticas'),

    // Perfis
    getAllPerfis: () => api.get('/perfis'),
    getPerfilById: (id: number) => api.get(`/perfis/${id}`),
    createPerfil: (data: { nome: string; descricao: string; systemKey: string }) =>
        api.post('/perfis', data),
    updatePerfil: (id: number, data: { nome: string; descricao: string; systemKey: string }) =>
        api.put(`/perfis/${id}`, data),
    deletePerfil: (id: number) => api.delete(`/perfis/${id}`),

    // Roles
    getAllRoles: () => api.get('/roles'),
    getRoleById: (id: number) => api.get(`/roles/${id}`),
    createRole: (data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.post('/roles', data),
    updateRole: (id: number, data: { nome: string; descricao: string; systemKey: string; aplicacao: string }) =>
        api.put(`/roles/${id}`, data),
    deleteRole: (id: number) => api.delete(`/roles/${id}`),

    // Grupos
    getAllGrupos: () => api.get('/grupos'),
    getGrupoById: (id: number) => api.get(`/grupos/${id}`),
    createGrupo: (data: { nome: string; descricao: string }) => api.post('/grupos', data),
    updateGrupo: (id: number, data: { nome: string; descricao: string }) =>
        api.put(`/grupos/${id}`, data),
    deleteGrupo: (id: number) => api.delete(`/grupos/${id}`),

    // Projetos
    getAllProjetos: () => api.get('/projetos'),
    getProjetoById: (id: number) => api.get(`/projetos/${id}`),
    createProjeto: (data: { nome: string; descricao: string; dataInicio: Date; dataFim: Date; grupoId: number }) =>
        api.post('/projetos', data),
    updateProjeto: (id: number, data: { nome: string; descricao: string; dataInicio: Date; dataFim: Date; grupoId: number }) =>
        api.put(`/projetos/${id}`, data),
    deleteProjeto: (id: number) => api.delete(`/projetos/${id}`),
};
