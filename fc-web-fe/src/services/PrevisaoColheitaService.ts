import api from './api';
import PrevisaoService from './PrevisaoService';

export interface PrevisaoTalhao {
  id: string;
  nome: string;
  fazendaNome: string;
  sacasPorHectare: number;
  diasParaColheita: number;
  dataIdealColheita: Date;
  dataUltimaAnalise: Date;
}

const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

class PrevisaoColheitaService {
  static async buscarTodasPrevisoes(): Promise<PrevisaoTalhao[]> {
    try {
      // Primeiro buscar todas as fazendas do usuário
      const { data: fazendas } = await api.getAllFazendas();
      
      if (!fazendas || !Array.isArray(fazendas) || fazendas.length === 0) {
        console.warn('Nenhuma fazenda encontrada para o usuário');
        return [];
      }

      const todasPrevisoes: PrevisaoTalhao[] = [];
      
      // Para cada fazenda, buscar seus talhões e calcular previsões
      for (const fazenda of fazendas) {
        if (!fazenda.id) {
          console.warn(`Fazenda sem ID: ${fazenda.nome}`);
          continue;
        }

        try {
          // Buscar talhões da fazenda
          const { data: talhoes } = await api.getTalhoesByFazenda(fazenda.id);
          
          if (!talhoes || !Array.isArray(talhoes)) {
            console.warn(`Nenhum talhão encontrado para a fazenda ${fazenda.nome}`);
            continue;
          }

          // Para cada talhão, calcular previsão
          for (const talhao of talhoes) {
            try {
              const previsao = await this.calcularPrevisaoTalhao(talhao);
              if (previsao) {
                todasPrevisoes.push({
                  ...previsao,
                  fazendaNome: fazenda.nome
                });
              }
            } catch (error) {
              console.error(`Erro ao calcular previsão para talhão ${talhao.nome} da fazenda ${fazenda.nome}:`, error);
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar talhões da fazenda ${fazenda.nome}:`, error);
        }
      }
      
      // Ordenar por dias para colheita (mais próximos primeiro)
      return todasPrevisoes.sort((a, b) => a.diasParaColheita - b.diasParaColheita);
    } catch (error) {
      console.error('Erro ao buscar previsões:', error);
      throw new Error('Não foi possível buscar as previsões: ' + getErrorMessage(error));
    }
  }

  private static async calcularPrevisaoTalhao(talhao: any): Promise<PrevisaoTalhao | null> {
    if (!talhao.id) {
      console.warn(`Talhão sem ID: ${talhao.nome}`);
      return null;
    }

    try {
      const { data: analiseResponse } = await api.getUltimaAnaliseTalhao(talhao.id);
      
      if (!analiseResponse?.result) {
        console.warn(`Nenhuma análise encontrada para o talhão ${talhao.nome}`);
        return null;
      }
      
      const ultimaAnalise = analiseResponse.result;
      const total = ultimaAnalise.total;
      
      if (!total || total <= 0) {
        console.warn(`Análise inválida para o talhão ${talhao.nome}: total = ${total}`);
        return null;
      }

      const dataUltimaColeta = new Date(ultimaAnalise.createdAt);
      const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ];
      const mesColeta = meses[dataUltimaColeta.getMonth()];
      
      const porcentagens = {
        verde: ultimaAnalise.green / total,
        verdeCana: ultimaAnalise.greenYellow / total,
        cereja: ultimaAnalise.cherry / total,
        passa: ultimaAnalise.raisin / total,
        seco: ultimaAnalise.dry / total
      };
      
      const graosPorEstagio = {
        verde: ultimaAnalise.green || 0,
        verdeCana: ultimaAnalise.greenYellow || 0,
        cereja: ultimaAnalise.cherry || 0,
        passa: ultimaAnalise.raisin || 0,
        seco: ultimaAnalise.dry || 0
      };
      
      let idadePlantasTalhao = 0;
      try {
        const { data: talhaoDetalhes } = await api.getTalhao(talhao.id);
        
        if (talhaoDetalhes?.Plantio?.data) {
          const dataPlantio = new Date(talhaoDetalhes.Plantio.data);
          const hoje = new Date();
          
          if (dataPlantio > hoje) {
            idadePlantasTalhao = 0;
          } else {
            const diffTime = hoje.getTime() - dataPlantio.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            const idadeEmAnos = Math.floor(diffDays / 365.25);
            idadePlantasTalhao = idadeEmAnos;
          }
        }
      } catch (error) {
        console.warn(`Erro ao obter idade do talhão ${talhao.nome}:`, error);
        idadePlantasTalhao = 0;
      }
      
      const previsao = PrevisaoService.calcularPrevisoes(
        idadePlantasTalhao,
        graosPorEstagio,
        porcentagens,
        mesColeta
      );
      
      return {
        id: talhao.id,
        nome: talhao.nome,
        fazendaNome: '', // Será preenchido no nível superior
        dataUltimaAnalise: dataUltimaColeta,
        ...previsao
      };
    } catch (error) {
      console.error(`Erro ao calcular previsão para talhão ${talhao.nome}:`, error);
      return null;
    }
  }
}

export default PrevisaoColheitaService; 