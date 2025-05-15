interface EstagiosMaturacao {
    verde: number;
    verde_cana: number;
    cereja: number;
    passa: number;
    seco: number;
}

interface GraosPorEstagio {
    verde: number;
    verde_cana: number;
    cereja: number;
    passa: number;
    seco: number;
}

interface PrevisaoSafra {
    sacasPorHectare: string;
    diasParaColheita: number;
    dataIdealColheita: Date;
}

export class PrevisaoService {
    private static readonly FRUTOS_POR_LITRO: EstagiosMaturacao = {
        verde: 612,
        verde_cana: 551,
        cereja: 500,
        passa: 683,
        seco: 926
    };

    private static readonly RENDIMENTO: EstagiosMaturacao = {
        verde: 493,
        verde_cana: 548,
        cereja: 604,
        passa: 442,
        seco: 326
    };

    private static readonly BOUNDS_COLHEITA_POR_MES: { [key: string]: [number, number] } = {
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

    private static readonly TAXAS_TRANSICAO_MES: { [key: string]: [number, number, number, number] } = {
        janeiro: [0.010, 0.005, 0.002, 0.001],
        fevereiro: [0.011, 0.1, 0.0014, 0.000],
        março: [0.015, 0.01, 0.005, 0.003],
        abril: [0.010, 0.02, 0.0047, 0.002],
        maio: [0.020, 0.015, 0.010, 0.005],
        junho: [0.018, 0.013, 0.007, 0.004],
        julho: [0.015, 0.010, 0.005, 0.003],
        agosto: [0.010, 0.007, 0.003, 0.002]
    };

    private static minimizarFuncao(funcao: (t: number) => number, limiteInferior: number, limiteSuperior: number, passos: number = 1000): number {
        let melhorT = limiteInferior;
        let melhorValor = funcao(limiteInferior);
        const passo = (limiteSuperior - limiteInferior) / passos;
        
        for (let t = limiteInferior; t <= limiteSuperior; t += passo) {
            const valor = funcao(t);
            if (valor < melhorValor) {
                melhorValor = valor;
                melhorT = t;
            }
        }
        
        return melhorT;
    }

    private static calcularPlantasPorHectare(espacamentoEntreLinhas: number, espacamentoEntrePlantas: number): number {
        const AREA_HECTARE = 10000;
        const areaPorPlanta = espacamentoEntreLinhas * espacamentoEntrePlantas;
        return Math.floor(AREA_HECTARE / areaPorPlanta);
    }

    private static calcularIdadeEmMeses(dataPlantio: Date): number {
        const hoje = new Date();
        const diffMeses = (hoje.getFullYear() - dataPlantio.getFullYear()) * 12 + 
                         (hoje.getMonth() - dataPlantio.getMonth());
        return Math.max(0, diffMeses);
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
    ): [number, number, number, number, number] {
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

    private static calcularPrevisaoSafraComAjusteTemporal(
        plantasPorHectare: number,
        mediaFrutosPorEstagio: GraosPorEstagio,
        porcentagemEstagios: EstagiosMaturacao,
        mesColeta: string,
        idadeMesesPlantasTalhao: number
    ): { sacas: string, diasParaColheita: number } {
        const mesColetaLower = mesColeta.toLowerCase();
        const taxas = this.TAXAS_TRANSICAO_MES[mesColetaLower];
        
        if (!taxas) {
            throw new Error("Mês inválido! Previsão disponível apenas de Janeiro a Agosto.");
        }

        const [k_V_VC, k_VC_C, k_C_P, k_P_S] = taxas;

        const { verde: p_V0, verde_cana: p_VC0, cereja: p_C0, passa: p_P0 } = porcentagemEstagios;

        const diasParaColheita = this.minimizarFuncao(
            (t) => -this.evoluirEstagios(t, p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S)[2],
            this.BOUNDS_COLHEITA_POR_MES[mesColetaLower][0],
            this.BOUNDS_COLHEITA_POR_MES[mesColetaLower][1]
        );

        const [p_V, p_VC, p_C, p_P, p_S] = this.evoluirEstagios(
            diasParaColheita, p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S
        );

        const proporcaoFinal = {
            verde: p_V,
            verde_cana: p_VC,
            cereja: p_C,
            passa: p_P,
            seco: p_S
        };

        const totalFrutosPorPlanta = Object.values(mediaFrutosPorEstagio).reduce((a, b) => a + b, 0);

        const qtdeMediaFrutosEstagioFinal: EstagiosMaturacao = {
            verde: totalFrutosPorPlanta * proporcaoFinal.verde,
            verde_cana: totalFrutosPorPlanta * proporcaoFinal.verde_cana,
            cereja: totalFrutosPorPlanta * proporcaoFinal.cereja,
            passa: totalFrutosPorPlanta * proporcaoFinal.passa,
            seco: totalFrutosPorPlanta * proporcaoFinal.seco
        };

        let totalSacas = 0;
        
        for (const estagio of Object.keys(this.RENDIMENTO) as (keyof EstagiosMaturacao)[]) {
            const qtdeMediaFrutosPorPlanta = qtdeMediaFrutosEstagioFinal[estagio];
            const frutosTotal = qtdeMediaFrutosPorPlanta * plantasPorHectare;
            const litros = frutosTotal / this.FRUTOS_POR_LITRO[estagio];
            const sacas = litros / this.RENDIMENTO[estagio];
            totalSacas += sacas;
        }

        // Correção baseada no total de frutos por planta
        let sacasAntesCorrecao = totalSacas;
        if (totalFrutosPorPlanta <= 50) {
            totalSacas = 15 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 75) {
            totalSacas = 22.5 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 100) {
            totalSacas = 30 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 125) {
            totalSacas = 37.5 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 150) {
            totalSacas = 45 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 175) {
            totalSacas = 52.5 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 200) {
            totalSacas = 60 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 225) {
            totalSacas = 67.5 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 250) {
            totalSacas = 75 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 275) {
            totalSacas = 82.5 + Math.round(totalSacas/2 * 100) / 100;
        }
        else if (totalFrutosPorPlanta <= 300) {
            totalSacas = 90 + Math.round(totalSacas/2 * 100) / 100;
        }

        // Correção baseada na idade do talhão
        if (idadeMesesPlantasTalhao <= 12) {
            totalSacas *= 0.0;
        }
        else if (idadeMesesPlantasTalhao <= 24) {
            totalSacas *= 0.3;
        }
        else if (idadeMesesPlantasTalhao <= 36) {
            totalSacas *= 0.6;
        }
        else if (idadeMesesPlantasTalhao <= 48) {
            totalSacas *= 0.85;
        }
        else if (idadeMesesPlantasTalhao <= 120) {
            totalSacas *= 1;
        }
        else if (idadeMesesPlantasTalhao <= 180) {
            totalSacas *= 0.9;
        }
        else if (idadeMesesPlantasTalhao <= 240) {
            totalSacas *= 0.8;
        }
        else {
            totalSacas *= 0.8;
        }

        // Criando um intervalo de resposta de 5%
        const totalSacasPiso = Math.round(totalSacas * 0.95 * 100) / 100;  // -5%
        const totalSacasTeto = Math.round(totalSacas * 1.05 * 100) / 100;   // +5%

        return {
            sacas: `${totalSacasPiso} a ${totalSacasTeto}`,
            diasParaColheita: Math.round(diasParaColheita)
        };
    }

    public static calcularPrevisoes(
        dataPlantio: Date,
        espacamentoEntreLinhas: number,
        espacamentoEntrePlantas: number,
        graosPorEstagio: GraosPorEstagio,
        porcentagens: EstagiosMaturacao,
        mesColeta: string
    ): PrevisaoSafra {
        const plantasPorHectare = this.calcularPlantasPorHectare(espacamentoEntreLinhas, espacamentoEntrePlantas);
        const idadeMesesPlantasTalhao = this.calcularIdadeEmMeses(dataPlantio);
        
        const { sacas, diasParaColheita } = this.calcularPrevisaoSafraComAjusteTemporal(
            plantasPorHectare,
            graosPorEstagio,
            porcentagens,
            mesColeta,
            idadeMesesPlantasTalhao
        );

        const dataIdealColheita = new Date();
        dataIdealColheita.setDate(dataIdealColheita.getDate() + diasParaColheita);

        return {
            sacasPorHectare: sacas,
            diasParaColheita,
            dataIdealColheita
        };
    }
} 