import api from './api';

export interface PrevisaoTalhao {
  id: string;
  nome: string;
  fazendaNome: string;
  sacasPorHectare: number;
  diasParaColheita: number;
  dataIdealColheita: Date;
  dataUltimaAnalise: Date;
}

class PrevisaoColheitaService {
  static async buscarTodasPrevisoes(): Promise<PrevisaoTalhao[]> {
    try {
      const response = await api.getPrevisaoTodasFazendas();
      const data = response.data;
      return data.map((previsao: any) => ({
        ...previsao,
        dataIdealColheita: new Date(previsao.dataIdealColheita),
        dataUltimaAnalise: new Date(previsao.dataUltimaAnalise)
      }));
    } catch (error) {
      console.error('Erro ao buscar previsões:', error);
      throw new Error('Não foi possível buscar as previsões');
    }
  }

  static async calcularPrevisaoTalhao(talhaoId: string): Promise<PrevisaoTalhao> {
    try {
      const response = await api.getPrevisaoTalhao(talhaoId);
      const data = response.data;
      return {
        ...data,
        dataIdealColheita: new Date(data.dataIdealColheita),
        dataUltimaAnalise: new Date(data.dataUltimaAnalise)
      };
    } catch (error) {
      console.error('Erro ao calcular previsão:', error);
      throw new Error('Não foi possível calcular a previsão');
    }
  }
}

export default PrevisaoColheitaService; 