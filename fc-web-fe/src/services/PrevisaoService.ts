import { format, addDays } from 'date-fns';

interface EstagiosMaturacao {
  verde: number;
  verdeCana: number;
  cereja: number;
  passa: number;
  seco: number;
}

interface GraosPorEstagio {
  verde: number;
  verdeCana: number;
  cereja: number;
  passa: number;
  seco: number;
}

interface PrevisaoSafra {
  sacasPorHectare: number;
  diasParaColheita: number;
  dataIdealColheita: Date;
}

class PrevisaoService {
  private static taxasTransicaoMes: { [key: string]: number[] } = {
    janeiro: [0.010, 0.005, 0.002, 0.001],
    fevereiro: [0.011, 0.1, 0.0014, 0.000],
    março: [0.015, 0.01, 0.005, 0.003],
    abril: [0.010, 0.02, 0.0047, 0.002],
    maio: [0.020, 0.015, 0.010, 0.005],
    junho: [0.018, 0.013, 0.007, 0.004],
    julho: [0.015, 0.010, 0.005, 0.003],
    agosto: [0.010, 0.007, 0.003, 0.002]
  };

  private static boundsColheitaPorMes: { [key: string]: [number, number] } = {
    janeiro: [90, 210],
    fevereiro: [75, 195],
    março: [60, 180],
    abril: [45, 150],
    maio: [30, 120],
    junho: [15, 90],
    julho: [0, 60],
    agosto: [0, 45],
    setembro: [0, 30],
    outubro: [180, 270],
    novembro: [150, 240],
    dezembro: [120, 210]
  };

  private static calcularPrevisaoSafra(idadePlantasTalhao: number, totalGraosPorPlanta: number): number {
    // Planta não produz no primeiro ano de vida
    if (idadePlantasTalhao <= 1) {
      return 0;
    }
    // Produção no segundo ano
    else if (idadePlantasTalhao === 2) {
      return 9.5;
    }
    // Produção a partir do terceiro ano
    else if (idadePlantasTalhao >= 3) {
      let produtividade = 0;
      if (totalGraosPorPlanta <= 30) {
        produtividade = 12.3;
      }
      else if (totalGraosPorPlanta <= 50) {
        produtividade = 17.6;
      }
      else if (totalGraosPorPlanta <= 100) {
        produtividade = 25.1;
      }
      else if (totalGraosPorPlanta <= 200) {
        produtividade = 31.7;
      }
      else {
        produtividade = 42.9;
      }
      return produtividade;
    }
    
    // Se a idade for 0 ou negativa
    return 0;
  }

  private static evoluirEstagios(
    t: number,
    p_V0: number,
    p_VC0: number,
    p_C0: number,
    p_P0: number,
    k_V_VC: number,
    k_VC_C: number,
    k_C_P: number,
    k_P_S: number
  ): number[] {
    const p_V = p_V0 * Math.exp(-k_V_VC * t);
    
    const p_VC = (p_VC0 + p_V0 * (1 - Math.exp(-k_V_VC * t))) * Math.exp(-k_VC_C * t);
    
    const p_C = ((p_C0 + p_VC0 * (1 - Math.exp(-k_VC_C * t))) * Math.exp(-k_C_P * t)
           + p_V0 * (1 - Math.exp(-k_V_VC * t)) * (1 - Math.exp(-k_VC_C * t)) * Math.exp(-k_C_P * t));
    
    const p_P = ((p_P0 + p_C0 * (1 - Math.exp(-k_C_P * t))) * Math.exp(-k_P_S * t)
           + p_VC0 * (1 - Math.exp(-k_VC_C * t)) * (1 - Math.exp(-k_C_P * t)) * Math.exp(-k_P_S * t)
           + p_V0 * (1 - Math.exp(-k_V_VC * t)) * (1 - Math.exp(-k_VC_C * t)) * (1 - Math.exp(-k_C_P * t)) * Math.exp(-k_P_S * t));
    
    const p_S = 1 - (p_V + p_VC + p_C + p_P);

    return [p_V, p_VC, p_C, p_P, p_S];
  }

  private static minimizarFuncao(
    func: (x: number) => number,
    limiteInferior: number,
    limiteSuperior: number,
    precisao: number = 0.1
  ): number {
    let melhorX = limiteInferior;
    let melhorValor = func(limiteInferior);
    
    for (let x = limiteInferior; x <= limiteSuperior; x += precisao) {
      const valor = func(x);
      if (valor < melhorValor) {
        melhorValor = valor;
        melhorX = x;
      }
    }
    
    return melhorX;
  }

  private static calcularPrevisaoColheita(
    porcentagens: EstagiosMaturacao,
    mesColeta: string
  ): number {
    const taxas = this.taxasTransicaoMes[mesColeta.toLowerCase()];
    if (!taxas) {
      throw new Error('Mês inválido');
    }

    const [k_V_VC, k_VC_C, k_C_P, k_P_S] = taxas;
    const { verde: p_V0, verdeCana: p_VC0, cereja: p_C0, passa: p_P0 } = porcentagens;

    const bounds = this.boundsColheitaPorMes[mesColeta.toLowerCase()];
    if (!bounds) {
      throw new Error('Mês inválido para bounds');
    }

    const [limiteInferior, limiteSuperior] = bounds;

    const funcaoObjetivo = (t: number): number => {
      const [,, cereja] = this.evoluirEstagios(t, p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S);
      return -cereja; // Negativo porque queremos maximizar a quantidade de cereja
    };

    return this.minimizarFuncao(funcaoObjetivo, limiteInferior, limiteSuperior);
  }

  public static calcularPrevisoes(
    idadePlantasTalhao: number,
    graosPorEstagio: GraosPorEstagio,
    porcentagens: EstagiosMaturacao,
    mesColeta: string
  ): PrevisaoSafra {
    // Calcular o total de grãos por planta
    const totalGraosPorPlanta = Object.values(graosPorEstagio).reduce((a, b) => a + b, 0);

    // Calcular sacas por hectare
    const sacasPorHectare = this.calcularPrevisaoSafra(idadePlantasTalhao, totalGraosPorPlanta);
    
    // Calcular dias para colheita
    const diasParaColheita = Math.round(this.calcularPrevisaoColheita(porcentagens, mesColeta));
    
    // Calcular data ideal de colheita
    const dataIdealColheita = addDays(new Date(), diasParaColheita);

    return {
      sacasPorHectare,
      diasParaColheita,
      dataIdealColheita
    };
  }
}

export default PrevisaoService; 