import numpy as np
from scipy.optimize import minimize_scalar
from datetime import timedelta

####################################################################################################
##### Retorna as taxas de transição de maturação dos frutos do café com base no mês informado #####
####################################################################################################

def obterIntervaloBoundsPorMes(strMes: str) -> tuple:
    strMes = strMes.lower()

    tabBounds = {
        'janeiro': (90, 210),
        'fevereiro': (75, 195),
        'março': (60, 180),
        'abril': (45, 150),
        'maio': (30, 120),
        'junho': (15, 90),
        'julho': (0, 60),
        'agosto': (0, 45),
        'setembro': (0, 30),
        'outubro': (180, 270),
        'novembro': (150, 240),
        'dezembro': (120, 210)
    }

    if strMes not in tabBounds:
        raise ValueError("Mês inválido!")

    return tabBounds[strMes]


####################################################################################################
##### Retorna as taxas de transição de maturação dos frutos do café com base no mês informado #####
####################################################################################################

def obterTaxasTransicaoFrutosMes(strMes):
    
    dicTaxas = {
        "janeiro":  (0.010, 0.005, 0.002, 0.001),
        "fevereiro": (0.011, 0.1, 0.0014, 0.000),
        "março":    (0.015, 0.01, 0.005, 0.003),
        "abril":    (0.010, 0.02, 0.0047, 0.002),
        "maio":     (0.020, 0.015, 0.010, 0.005),
        "junho":    (0.018, 0.013, 0.007, 0.004),
        "julho":    (0.015, 0.010, 0.005, 0.003),
        "agosto":   (0.010, 0.007, 0.003, 0.002)
    }
    
    strMes = strMes.lower()
    
    if strMes in dicTaxas:
        return dicTaxas[strMes]
    else:
        raise ValueError("Mês inválido!")


#############################################################################################
##### Função que calcula a proporção dos frutos em cada estágio para um dado tempo t.   #####
#############################################################################################

def evoluirEstagios(t, p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S):

    p_V = p_V0 * np.exp(-k_V_VC * t)
    
    p_VC = (p_VC0 + p_V0 * (1 - np.exp(-k_V_VC * t))) * np.exp(-k_VC_C * t)
    
    p_C = ((p_C0 + p_VC0 * (1 - np.exp(-k_VC_C * t))) * np.exp(-k_C_P * t)
           + p_V0 * (1 - np.exp(-k_V_VC * t)) * (1 - np.exp(-k_VC_C * t)) * np.exp(-k_C_P * t))
    
    p_P = ((p_P0 + p_C0 * (1 - np.exp(-k_C_P * t))) * np.exp(-k_P_S * t)
           + p_VC0 * (1 - np.exp(-k_VC_C * t)) * (1 - np.exp(-k_C_P * t)) * np.exp(-k_P_S * t)
           + p_V0 * (1 - np.exp(-k_V_VC * t)) * (1 - np.exp(-k_VC_C * t)) * (1 - np.exp(-k_C_P * t)) * np.exp(-k_P_S * t))
    
    p_S = 1 - (p_V + p_VC + p_C + p_P)

    return p_V, p_VC, p_C, p_P, p_S


###################################################################################################
##### Função que encontra o tempo ótimo de colheita, maximizando a proporção de frutos cereja #####
###################################################################################################

def preverDataColheita(p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S, strMes):
    
    resultado = minimize_scalar(lambda t: -evoluirEstagios(t, p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S)[2], 
                                bounds=obterIntervaloBoundsPorMes(strMes), method='bounded')
    
    return resultado.x  # Retorna o tempo ótimo de colheita


######################################
##### Função que calcula a safra #####
######################################

def calcularPrevisaoSafraComAjusteTemporal(
    intNumPlantasPorHectare,          
    dictNroMedioFrutosPorEstagio,  
    dictPorcentagemEstagios,      
    strMesColeta,             
    dictFrutosPorLitroSaca,           
    dictRendimento,
    intIdadeMesesPlantasTalhao
):
    print('\n=== INÍCIO DO CÁLCULO DE PREVISÃO ===')
    print('Plantas por hectare:', intNumPlantasPorHectare)
    print('Média frutos por estágio:', dictNroMedioFrutosPorEstagio)
    print('Porcentagem estágios:', dictPorcentagemEstagios)
    print('Mês coleta:', strMesColeta)
    print('Idade em meses:', intIdadeMesesPlantasTalhao)

    # Obter taxas para o mês analisado
    k_V_VC, k_VC_C, k_C_P, k_P_S = obterTaxasTransicaoFrutosMes(strMesColeta)
    print('\nTaxas de transição:')
    print('k_V_VC:', k_V_VC)
    print('k_VC_C:', k_VC_C)
    print('k_C_P:', k_C_P)
    print('k_P_S:', k_P_S)

    # Proporções iniciais
    p_V0, p_VC0, p_C0, p_P0 = [dictPorcentagemEstagios[k] for k in ['verde', 'verde_cana', 'cereja', 'passa']]
    print('\nPorcentagens iniciais:')
    print('p_V0:', p_V0)
    print('p_VC0:', p_VC0)
    print('p_C0:', p_C0)
    print('p_P0:', p_P0)

    # Calcular o tempo ótimo de colheita
    intDiasParaColheita = preverDataColheita(p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S, strMesColeta)
    print('\nDias para colheita:', intDiasParaColheita)

    # Calcular novas proporções na data ótima
    p_V, p_VC, p_C, p_P, p_S = evoluirEstagios(intDiasParaColheita, p_V0, p_VC0, p_C0, p_P0, k_V_VC, k_VC_C, k_C_P, k_P_S)
    print('\nProporções após evolução:')
    print('p_V:', p_V)
    print('p_VC:', p_VC)
    print('p_C:', p_C)
    print('p_P:', p_P)
    print('p_S:', p_S)

    dicProporcaoFinal = {
        'verde': p_V,
        'verde_cana': p_VC,
        'cereja': p_C,
        'passa': p_P,
        'seco': p_S
    }    

    intTotalFrutosPorPlanta = sum(dictNroMedioFrutosPorEstagio.values())    
    print('\nTotal de frutos por planta:', intTotalFrutosPorPlanta)
    
    # Redistribuir esse total de acordo com as proporções na data da colheita
    dictQtdeMediaFrutosEstagioFinal = {
        estagio: intTotalFrutosPorPlanta * proporcao
        for estagio, proporcao in dicProporcaoFinal.items()
    }
    print('\nQuantidade média de frutos por estágio final:', dictQtdeMediaFrutosEstagioFinal)
        
    # Estimar safra baseado no número médio de frutos das fotos da última coleta
    fltTotalSacas = 0
    print('\nCálculo de sacas por estágio:')
    
    for estagio in dictRendimento:
        intQtdeMediaFrutosPorPlanta = dictQtdeMediaFrutosEstagioFinal.get(estagio, 0)
        fltFrutosTotal = intQtdeMediaFrutosPorPlanta * intNumPlantasPorHectare
        fltLitros = fltFrutosTotal / dictFrutosPorLitroSaca.get(estagio, 0)
        fltSacas = fltLitros / dictRendimento[estagio]
        print(f'\nEstágio {estagio}:')
        print('Qtde média frutos/planta:', intQtdeMediaFrutosPorPlanta)
        print('Frutos total:', fltFrutosTotal)
        print('Litros:', fltLitros)
        print('Sacas:', fltSacas)
        fltTotalSacas = fltTotalSacas + fltSacas

    print('\nTotal de sacas antes das correções:', fltTotalSacas)
    sacasAntesCorrecao = fltTotalSacas

    # Correção feita para chegar ao número de frutos de todo o pé
    if(intTotalFrutosPorPlanta <= 50):
        fltTotalSacas = 15 + round(fltTotalSacas/2,2)   
        print('\nCorreção para <=50 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 75):
        fltTotalSacas = 22.5 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=75 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 100):
        fltTotalSacas = 30 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=100 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 125):
        fltTotalSacas = 37.5 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=125 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 150):
        fltTotalSacas = 45 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=150 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 175):
        fltTotalSacas = 52.5 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=175 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 200):
        fltTotalSacas = 60 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=200 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 225):
        fltTotalSacas = 67.5 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=225 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 250):
        fltTotalSacas = 75 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=250 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 275):
        fltTotalSacas = 82.5 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=275 frutos:', fltTotalSacas)
    elif (intTotalFrutosPorPlanta <= 300):
        fltTotalSacas = 90 + round(fltTotalSacas/2,2)
        print('\nCorreção para <=300 frutos:', fltTotalSacas)

    print('\nTotal de sacas após correção por quantidade:', fltTotalSacas)
    print('Valor base adicionado:', fltTotalSacas - round(sacasAntesCorrecao/2,2))

    # Correção feita para adequar à idade do talhão
    fatorIdadeAnterior = fltTotalSacas
    if(intIdadeMesesPlantasTalhao <= 12):
        fltTotalSacas = fltTotalSacas * 0.0
        print('\nCorreção idade <=12 meses (0%):', fltTotalSacas)
    elif (intIdadeMesesPlantasTalhao <= 24):
        fltTotalSacas = fltTotalSacas * 0.3
        print('\nCorreção idade <=24 meses (30%):', fltTotalSacas)
    elif (intIdadeMesesPlantasTalhao <= 36):
        fltTotalSacas = fltTotalSacas * 0.6
        print('\nCorreção idade <=36 meses (60%):', fltTotalSacas)
    elif (intIdadeMesesPlantasTalhao <= 48):
        fltTotalSacas = fltTotalSacas * 0.85
        print('\nCorreção idade <=48 meses (85%):', fltTotalSacas)
    elif (intIdadeMesesPlantasTalhao <= 120):
        fltTotalSacas = fltTotalSacas * 1
        print('\nCorreção idade <=120 meses (100%):', fltTotalSacas)
    elif (intIdadeMesesPlantasTalhao <= 180):
        fltTotalSacas = fltTotalSacas * 0.9
        print('\nCorreção idade <=180 meses (90%):', fltTotalSacas)
    elif (intIdadeMesesPlantasTalhao <= 240):
        fltTotalSacas = fltTotalSacas * 0.8
        print('\nCorreção idade <=240 meses (80%):', fltTotalSacas)
    else:
        fltTotalSacas = fltTotalSacas * 0.8
        print('\nCorreção idade >240 meses (80%):', fltTotalSacas)

    print('\nFator de correção por idade:', fltTotalSacas / fatorIdadeAnterior)
    print('Total de sacas final:', fltTotalSacas)

    # Criando um intervalo de resposta de 5%
    fltTotalSacasPiso = round(fltTotalSacas * 0.95, 2)  # -5%
    fltTotalSacasTeto = round(fltTotalSacas * 1.05, 2)   # +5%

    strProducaoAprox = str(fltTotalSacasPiso) + " a " + str(fltTotalSacasTeto)

    return strProducaoAprox


#########################################################
##### Função que calcula a qtde plantas por hectare #####
#########################################################

def calcular_plantas_por_hectare(fltEspacamentoEntreLinha, fltEspacamentoEntrePlantas):
    intAreaHectare_m2 = 10000  # 1 hectare = 10.000 m²
    fltAreaPorPlanta = fltEspacamentoEntreLinha * fltEspacamentoEntrePlantas
    num_plantas = intAreaHectare_m2 / fltAreaPorPlanta
    return int(num_plantas)


if __name__ == "__main__":
    # Parâmetros fixos
    dictFrutosPorLitro = {
        'verde': 612,
        'verde_cana': 551,
        'cereja': 500,
        'passa': 683,
        'seco': 926
    }

    dictRendimento = {
        'verde': 493,
        'verde_cana': 548,
        'cereja': 604,
        'passa': 442,
        'seco': 326
    }

    # Dados do Talhão 2 (dos logs)
    fltEspacamentoEntreLinhas = 2.5  # Valor do backend
    fltEspacamentEnteMudas = 0.7     # Valor do backend
    strMesColeta = "maio"            # Data da última análise: 06/05/2025

    # Dados da última análise (dos logs)
    dictPorcentagemEstagios = {
        'verde': 0.5336538461538461,
        'verde_cana': 0.20192307692307693,
        'cereja': 0.18269230769230768,
        'passa': 0.08173076923076923,
        'seco': 0.0
    }

    # Média de frutos por estágio (dos logs)
    dictMediaFrutosPorEstagio = {
        'verde': 53,
        'verde_cana': 20,
        'cereja': 18,
        'passa': 8,
        'seco': 0
    }

    # Idade do talhão em meses (dos logs)
    intIdadeMesesPlantasTalhao = 70  # Idade em meses

    # Calculando
    intNumPlantasPorHectare = calcular_plantas_por_hectare(fltEspacamentoEntreLinhas, fltEspacamentEnteMudas)
    strTotalSacas = calcularPrevisaoSafraComAjusteTemporal(
        intNumPlantasPorHectare, 
        dictMediaFrutosPorEstagio,
        dictPorcentagemEstagios,
        strMesColeta,
        dictFrutosPorLitro,
        dictRendimento,
        intIdadeMesesPlantasTalhao
    )
    
    print(f"\nTalhão 2 - Previsão de safra: {strTotalSacas} sacas/ha")
    print(f"Plantas por hectare: {intNumPlantasPorHectare}")
    print(f"Total de frutos por planta: {sum(dictMediaFrutosPorEstagio.values())}")
    print(f"Porcentagens: {dictPorcentagemEstagios}") 