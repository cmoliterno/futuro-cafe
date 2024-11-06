import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteName } from "../routes";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

// Configuração inicial do Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://futurocafe-prod-mobile-api.azurewebsites.net',  //'http://localhost:3000/api',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  },
});

// Adicione um interceptor de requisição para adicionar o token
api.interceptors.request.use(async request => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Iniciando requisição', request);
  return request;
}, error => {
  console.error('Erro na requisição', error);
  return Promise.reject(error);
});

// Adicione um interceptor de resposta para lidar com erros de autenticação
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.data && error.response.data.messages) {
      const messages = error.response.data.messages;
      const unauthorizedMessage = messages.find(
        message => message.systemKey === 'Unauthorized'
      );
      if (unauthorizedMessage) {
        const navigation = useNavigation();
        Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
        await AsyncStorage.removeItem('accessToken');
        navigation.navigate(RouteName.LOGIN_SCREEN);
      }
    }
    return Promise.reject(error);
  }
);

// Função de Registro de Usuário
export const register = async (email, nomeCompleto, cpf, senha) => {
  try {
    const response = await api.post('/registrar', { email, nomeCompleto, cpf, senha });

    // Se o status for 204, considera como sucesso, mesmo sem conteúdo
    if (response.status === 204) {
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
    const formData = new FormData();
    formData.append('user', email);
    formData.append('password', password);
    formData.append('grantType', 'password');

    console.log('Dados do FormData:', formData);

    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json, text/plain, */*',
      },
    });
    console.log('Resposta de login:', response.data); // Adicione este log para verificar a resposta
    return response.data; // Retorna a resposta completa
  } catch (error) {
    console.error('Erro no servico login:', error.response ? error.response.data : error.message);
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

// Função para Obter Fazendas
export const getFarms = async (page, pageSize, searchString) => {
  try {
    const response = await api.get('/fazendas', {
      params: { page, pageSize, searchString },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter fazendas:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para Adicionar Fazenda
export const addFarm = async (nome) => {
  try {
    const response = await api.post('/fazendas', { nome });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar fazenda:', error.response ? error.response.data : error.message);
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
export const getCultivars = async (page, pageSize, searchString) => {
  try {
    const response = await api.get('/cultivares', {
      params: { page, pageSize, searchString },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter cultivares:', error.response ? error.response.data : error.message);
    throw error;
  }
};

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
      params: { page, pageSize, searchString },
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

