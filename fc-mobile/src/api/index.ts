import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteName } from "../routes";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

// Configuração inicial do Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL2 || 'http://52.91.164.75:3000/api/',  //'http://localhost:3000/api',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  },
});

// Adicionando interceptor de requisição para api
api.interceptors.request.use(async request => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Requisição API:', request); // Log de requisição da api
  return request;
}, error => {
  console.error('Erro na requisição API:', error);
  return Promise.reject(error);
});

// Adicionando interceptor de requisição para api
api.interceptors.request.use(async request => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Requisição api:', request); // Log de requisição da api
  return request;
}, error => {
  console.error('Erro na requisição api:', error);
  return Promise.reject(error);
});

// Função de Registro de Usuário
export const register = async (email, nomeCompleto, cpf, password) => {
  try {
    console.log("Chamando a API Nova no endpoint /registrar"); // Log de chamada da api
    const response = await api.post('/registrar', { nomeCompleto, email, password, cpf });

    if (response.status === 204 || response.status === 201) {
      return { success: true };
    }

    return response.data;
  } catch (error) {
    console.error('Erro no registro:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função de Login de Usuário
export const login = async (email, password) => {
  try {
    // Criando o objeto com os dados
    const data = { email, password };

    console.log("Chamando a API Nova no endpoint /auth/token");

    // Fazendo a requisição com o objeto de dados
    const response = await api.post('/auth/token', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Resposta de login:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro no serviço de login:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// Função para Obter Projetos
export const getProjectsByFilter = async (page, pageSize, searchString) => {
  try {
    const response = await api.get('/projetos', {
      params: { page, pageSize, searchString },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter projetos:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Fazendas com paginação
export const getFarms = async (page, pageSize, searchString) => {
  try {
    const response = await api.get('/fazendas'); // Não precisa de parâmetros adicionais
    return response.data;
  } catch (error) {
    console.error('Erro ao obter todas as fazendas:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Fazenda por ID
export const getFazendaById = async (id) => {
  try {
    const response = await api.get(`/fazendas/${id}`); // Passando ID diretamente
    return response.data;
  } catch (error) {
    console.error('Erro ao obter fazenda por ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Adicionar Fazenda (ajustada para padrão)
export const addFarm = async (nome) => {
  try {
    // Agora esta função também segue a estrutura de passar um objeto com o nome da fazenda
    const response = await api.post('/fazendas', { nome });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar fazenda:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Atualizar Fazenda
export const updateFazenda = async (id, data) => {
  try {
    // Dados para atualização devem ser passados no formato { nome: "Novo Nome da Fazenda" }
    const response = await api.put(`/fazendas/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar fazenda:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Excluir Fazenda
export const deleteFazenda = async (id) => {
  try {
    const response = await api.delete(`/fazendas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir fazenda:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// Função para Adicionar Grupo
export const addGroup = async (nome) => {
  try {
    const response = await api.post('/grupos', { nome });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar grupo:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Adicionar Grupo
export const getGroups = async () => {
  try {
    const response = await api.get('/grupos', {

    });
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar grupo:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Projetos
export const getGroupsByFilter = async (page, pageSize, searchString) => {
  try {
    const response = await api.get('/grupos', {
      params: { page, pageSize, searchString },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar grupos por filtro:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Projetos
export const getProjects = async () => {
  try {
    const response = await api.get('/projetos', {

    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter projetos:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Adicionar Projeto
export const addProject = async (nome) => {
  try {
    const response = await api.post('/projetos', { nome });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar projeto:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Cultivares
export const getAllCultivars = async () => {
  try {
    const response = await api.get('/cultivares', {
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter todos os cultivares:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Talhões
export const getPlots = async (page, pageSize, searchString) => {
  try {
    const response = await api.get('/talhoes', {
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter talhões:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Adicionar Talhão
export const addPlot = async (nome, cultivarId, data, espacamentoLinhas, espacamentoMudas, fazendaId) => {
  try {
    const response = await api.post('/talhoes', {
      nome, cultivarId, data, espacamentoLinhas, espacamentoMudas, fazendaId
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar talhão:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Análises de um Talhão
export const getPlotAnalyses = async (talhaoId, page, pageSize) => {
  try {
    const response = await api.get(`/talhoes/${talhaoId}/analises`, {

    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter análises do talhão:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPlotAnalysesChart = async (talhaoId) => {
  try {
    const response = await api.get(`https://futuro-cafe-portal-web.vercel.app/chart-mobile/${talhaoId}`, {

    });
    return response;
  } catch (error) {
    console.error('Erro ao obter análises do talhão:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Adicionar Análise a um Talhão
export const addPlotAnalysis = async (talhaoId, formData) => {
  try {
    const response = await api.post(`/talhoes/${talhaoId}/analises`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar análise ao talhão:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Obter Imagem de Análise
export const getAnalysisImage = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter imagem de análise:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/conta');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await api.post('/conta/esqueci-senha', {
      usuario: email,
    });
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao enviar email de redefinição de senha:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Função para Atualizar Perfil do Usuário
export const updateUserProfile = async (profile) => {
  try {
    const response = await api.post('/conta', profile);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Atualizar Senha do Usuário
export const updateUserPassword = async (newPassword) => {
  try {
    const formData = new FormData();
    formData.append('password', newPassword);
    const response = await api.post('/conta/alterar-senha', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar senha do usuário:', error.response ? error.response.data : error.message);
    throw error;
  }
};

