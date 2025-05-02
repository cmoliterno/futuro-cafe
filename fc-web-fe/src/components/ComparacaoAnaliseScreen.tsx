import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    LabelList,
    Line, BarChart,
    ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import { getFirstDayOfCurrentMonth, getCurrentDate } from '../utils/dateUtils';
import { percentFormatter } from '../utils/formatUtils';

interface ChartData {
    nome: string;

    // Frutos (quantidade)
    green: number;
    greenYellow: number;
    cherry: number;
    raisin: number;
    dry: number;
    total: number;

    // Pesos (se vier do backend)
    greenWeight?: number;
    greenYellowWeight?: number;
    cherryWeight?: number;
    raisinWeight?: number;
    dryWeight?: number;
    totalWeight?: number;
}

// Exemplo de enum para referência de nomes de pesos (caso queira usar no front)
enum GrainWeight {
    GREEN = 0.94,
    GREEN_YELLOW = 1.05,
    CHERRY = 1.13,
    RAISIN = 0.67,
    DRY = 0.34
}

// ----- Estilos -----
const Container = styled.div`
  padding: var(--spacing-xl);
  background-color: var(--color-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  margin: var(--spacing-md);
`;

const Title = styled.h1`
  color: var(--color-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--color-gray-700);
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  background-color: white;
  
  &:focus {
    border-color: var(--color-secondary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: bold;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: var(--shadow-button);
  margin: var(--spacing-md) auto;
  min-width: 200px;
  
  &:hover {
    background-color: var(--color-secondary-dark);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
    transform: none;
  }
`;

const Loading = styled.div`
  color: var(--color-primary);
  text-align: center;
  font-size: var(--font-size-lg);
  margin-top: var(--spacing-lg);
  font-weight: 500;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 1000px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--color-error);
  color: white;
  border: none;
  font-size: 20px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: var(--border-radius-round);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background: #c0392b;
    transform: scale(1.1);
    transition: all 0.3s ease;
  }
`;

const ComparisonSection = styled.div`
  flex: 1;
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const ComparisonTitle = styled.h3`
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
`;

const DateInput = styled.input`
  padding: 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  width: 100%;
  margin-bottom: var(--spacing-md);
  
  &:focus {
    border-color: var(--color-secondary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.2);
  }
`;

const ComparacaoAnaliseScreen = () => {
    const [fazendas, setFazendas] = useState<any[]>([]);
    const [talhoesLeft, setTalhoesLeft] = useState<any[]>([]);
    const [talhoesRight, setTalhoesRight] = useState<any[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [filtersLeft, setFiltersLeft] = useState({
        fazenda: '',
        talhao: '',
        startDate: getFirstDayOfCurrentMonth(),
        endDate: getCurrentDate(),
    });
    const [filtersRight, setFiltersRight] = useState({
        fazenda: '',
        talhao: '',
        startDate: getFirstDayOfCurrentMonth(),
        endDate: getCurrentDate(),
    });

    // Carrega listas iniciais de fazendas
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fazendasData = await api.getAllFazendas();
                setFazendas(fazendasData.data);
            } catch (err) {
                console.error('Erro ao carregar dados iniciais:', err);
            }
        };
        fetchInitialData();
    }, []);

    // Ao selecionar fazenda, carrega talhões
    const fetchTalhoes = async (fazendaId: string, setTalhoes: React.Dispatch<React.SetStateAction<any[]>>) => {
        if (fazendaId) {
            try {
                const response = await api.getTalhoesByFazenda(fazendaId);
                setTalhoes(response.data);
            } catch (error) {
                console.error('Erro ao buscar talhões:', error);
            }
        } else {
            setTalhoes([]);
        }
    };

    // Função para formatar a porcentagem das barras
    const formatPercent = (value: number, total: number) => {
        return total > 0 ? `${((value / total) * 100).toFixed(2)}%` : '0%';
    };

    // Ao clicar em "Comparar"
    const handleCompare = async () => {
        setLoading(true);

        try {
            // Verificações antes de enviar a requisição
            if (JSON.stringify(filtersLeft) === JSON.stringify(filtersRight)) {
                console.warn('Os filtros esquerdo e direito são idênticos!');
                
                // Verifica quais campos específicos são iguais
                for (const key in filtersLeft) {
                    if (filtersLeft[key] === filtersRight[key]) {
                        console.log(`O campo "${key}" é igual nos dois lados: "${filtersLeft[key]}"`);
                    }
                }
            }

            // Obter nomes dos talhões selecionados
            const getSelectedTalhaoName = (talhaoId, talhoes) => {
                const talhao = talhoes.find(t => t.id === talhaoId);
                return talhao ? talhao.nome : 'Desconhecido';
            };
            
            const leftTalhaoName = filtersLeft.talhao ? getSelectedTalhaoName(filtersLeft.talhao, talhoesLeft) : '';
            const rightTalhaoName = filtersRight.talhao ? getSelectedTalhaoName(filtersRight.talhao, talhoesRight) : '';

            // Monta objeto com os dois conjuntos de filtros
            const requestBody = {
                filtersLeft,
                filtersRight,
            };
            
            console.log('Enviando filtros para comparação:', JSON.stringify(requestBody, null, 2));
            
            // Faz a requisição ao backend no endpoint compare-analises
            const response = await api.compareAnalises(requestBody);
            const { leftData, rightData } = response.data;
            
            console.log('Dados recebidos do lado esquerdo:', JSON.stringify(leftData, null, 2));
            console.log('Dados recebidos do lado direito:', JSON.stringify(rightData, null, 2));
            
            // Verificação para alertar quando os dados são idênticos
            const areIdentical = JSON.stringify(leftData) === JSON.stringify(rightData);
            if (areIdentical) {
                console.warn('AVISO: Os dados do lado esquerdo e direito são idênticos!');
                //alert('Atenção! Os dados retornados para os dois lados são idênticos. Verifique se os filtros estão corretos.');
            }

            // Ajusta dados para o chart
            const leftChart: ChartData = {
                nome: '',
                green: leftData.green,
                greenYellow: leftData.greenYellow,
                cherry: leftData.cherry,
                raisin: leftData.raisin,
                dry: leftData.dry,
                total: leftData.total,
                greenWeight: leftData.greenWeight / 1000,
                greenYellowWeight: leftData.greenYellowWeight / 1000,
                cherryWeight: leftData.cherryWeight / 1000,
                raisinWeight: leftData.raisinWeight / 1000,
                dryWeight: leftData.dryWeight / 1000,
                totalWeight: leftData.totalWeight / 1000,
            };

            const rightChart: ChartData = {
                nome: '',
                green: rightData.green,
                greenYellow: rightData.greenYellow,
                cherry: rightData.cherry,
                raisin: rightData.raisin,
                dry: rightData.dry,
                total: rightData.total,
                greenWeight: rightData.greenWeight / 1000,
                greenYellowWeight: rightData.greenYellowWeight / 1000,
                cherryWeight: rightData.cherryWeight / 1000,
                raisinWeight: rightData.raisinWeight / 1000,
                dryWeight: rightData.dryWeight / 1000,
                totalWeight: rightData.totalWeight / 1000,
            };

            setChartData([leftChart, rightChart]);
            setModalVisible(true);
        } catch (error) {
            console.error('Erro ao buscar dados de comparação:', error);
            alert('Erro ao buscar dados de comparação. Verifique o console para mais detalhes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Comparação de Análises</Title>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <ComparisonSection>
                    <ComparisonTitle>Lado Esquerdo</ComparisonTitle>
                    <FilterLabel>Fazenda</FilterLabel>
                    <Select
                        value={filtersLeft.fazenda}
                        onChange={(e) => {
                            const fazendaId = e.target.value;
                            setFiltersLeft({ ...filtersLeft, fazenda: fazendaId });
                            fetchTalhoes(fazendaId, setTalhoesLeft);
                        }}
                    >
                        <option value="">Selecione</option>
                        {fazendas.map((f: any) => (
                            <option key={f.id} value={f.id}>
                                {f.nome}
                            </option>
                        ))}
                    </Select>

                    <FilterLabel>Talhão</FilterLabel>
                    <Select
                        value={filtersLeft.talhao}
                        onChange={(e) =>
                            setFiltersLeft({ ...filtersLeft, talhao: e.target.value })
                        }
                    >
                        <option value="">Selecione</option>
                        {talhoesLeft.map((t: any) => (
                            <option key={t.id} value={t.id}>
                                {t.nome}
                            </option>
                        ))}
                    </Select>

                    <FilterLabel>Data Início</FilterLabel>
                    <DateInput
                        type="date"
                        value={filtersLeft.startDate}
                        onChange={(e) =>
                            setFiltersLeft({ ...filtersLeft, startDate: e.target.value })
                        }
                    />

                    <FilterLabel>Data Fim</FilterLabel>
                    <DateInput
                        type="date"
                        value={filtersLeft.endDate}
                        onChange={(e) =>
                            setFiltersLeft({ ...filtersLeft, endDate: e.target.value })
                        }
                    />
                </ComparisonSection>

                <ComparisonSection>
                    <ComparisonTitle>Lado Direito</ComparisonTitle>
                    <FilterLabel>Fazenda</FilterLabel>
                    <Select
                        value={filtersRight.fazenda}
                        onChange={(e) => {
                            const fazendaId = e.target.value;
                            setFiltersRight({ ...filtersRight, fazenda: fazendaId });
                            fetchTalhoes(fazendaId, setTalhoesRight);
                        }}
                    >
                        <option value="">Selecione</option>
                        {fazendas.map((f: any) => (
                            <option key={f.id} value={f.id}>
                                {f.nome}
                            </option>
                        ))}
                    </Select>

                    <FilterLabel>Talhão</FilterLabel>
                    <Select
                        value={filtersRight.talhao}
                        onChange={(e) =>
                            setFiltersRight({ ...filtersRight, talhao: e.target.value })
                        }
                    >
                        <option value="">Selecione</option>
                        {talhoesRight.map((t: any) => (
                            <option key={t.id} value={t.id}>
                                {t.nome}
                            </option>
                        ))}
                    </Select>

                    <FilterLabel>Data Início</FilterLabel>
                    <DateInput
                        type="date"
                        value={filtersRight.startDate}
                        onChange={(e) =>
                            setFiltersRight({ ...filtersRight, startDate: e.target.value })
                        }
                    />

                    <FilterLabel>Data Fim</FilterLabel>
                    <DateInput
                        type="date"
                        value={filtersRight.endDate}
                        onChange={(e) =>
                            setFiltersRight({ ...filtersRight, endDate: e.target.value })
                        }
                    />
                </ComparisonSection>
            </div>

            <Button onClick={handleCompare}>Comparar</Button>
            {loading && <Loading>Carregando...</Loading>}

            {modalVisible && (
                <Modal>
                    <ModalContent>
                        <CloseButton onClick={() => setModalVisible(false)}>&times;</CloseButton>

                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                            Comparação de Dados
                        </h2>

                        <BarChart width={900} height={600} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="nome"
                                tick={{ fill: '#000', fontSize: 14, fontWeight: 'bold' }}
                            />
                            <YAxis />
                            <Tooltip 
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div style={{ 
                                                backgroundColor: 'white', 
                                                padding: '10px', 
                                                border: '1px solid #ccc',
                                                borderRadius: '5px' 
                                            }}>
                                                <p>{data.nome}</p>
                                                <p style={{ color: '#34A853' }}>Verde: {data.green} ({formatPercent(data.green, data.total)})</p>
                                                <p style={{ color: '#FFD700' }}>Verde Cana: {data.greenYellow} ({formatPercent(data.greenYellow, data.total)})</p>
                                                <p style={{ color: '#FF6347' }}>Cherry: {data.cherry} ({formatPercent(data.cherry, data.total)})</p>
                                                <p style={{ color: '#8B4513' }}>Raisin: {data.raisin} ({formatPercent(data.raisin, data.total)})</p>
                                                <p style={{ color: '#A9A9A9' }}>Dry: {data.dry} ({formatPercent(data.dry, data.total)})</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />

                            {/* Barras com percentual */}
                            <Bar dataKey="green" fill="#34A853" name="Verde">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.green, entry.total)}
                                    position="top"
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                                <LabelList
                                    dataKey={(entry: any) => `Peso: ${(entry.greenWeight).toFixed(2)} kg`}
                                    position="bottom"
                                    style={{ fontSize: 12, fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="greenYellow" fill="#FFD700" name="Verde Cana">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.greenYellow, entry.total)}
                                    position="top"
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                                <LabelList
                                    dataKey={(entry: any) => `Peso: ${(entry.greenYellowWeight).toFixed(2)} kg`}
                                    position="bottom"
                                    style={{ fontSize: 12, fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="cherry" fill="#FF6347" name="Cereja">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.cherry, entry.total)}
                                    position="top"
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                                <LabelList
                                    dataKey={(entry: any) => `Peso: ${(entry.cherryWeight).toFixed(2)} kg`}
                                    position="bottom"
                                    style={{ fontSize: 12, fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="raisin" fill="#8B4513" name="Passa">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.raisin, entry.total)}
                                    position="top"
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                                <LabelList
                                    dataKey={(entry: any) => `Peso: ${(entry.raisinWeight).toFixed(2)} kg`}
                                    position="bottom"
                                    style={{ fontSize: 12, fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="dry" fill="#A9A9A9" name="Seco">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.dry, entry.total)}
                                    position="top"
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                                <LabelList
                                    dataKey={(entry: any) => `Peso: ${(entry.dryWeight).toFixed(2)} kg`}
                                    position="bottom"
                                    style={{ fontSize: 12, fill: 'black' }}
                                />
                            </Bar>
                        </BarChart>

                        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Resumo</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                {chartData.map((data, index) => (
                                    <div key={index} style={{ flex: 1, padding: '10px' }}>
                                        <h4>{data.nome}</h4>
                                        <p><strong>Total de grãos:</strong> {data.total.toLocaleString()}</p>
                                        <p><strong>Peso total estimado:</strong> {data.totalWeight?.toFixed(2)} kg</p>
                                        <div>
                                            <p><strong>Verde:</strong> {data.green} ({formatPercent(data.green, data.total)})</p>
                                            <p><strong>Verde Cana:</strong> {data.greenYellow} ({formatPercent(data.greenYellow, data.total)})</p>
                                            <p><strong>Cereja:</strong> {data.cherry} ({formatPercent(data.cherry, data.total)})</p>
                                            <p><strong>Passa:</strong> {data.raisin} ({formatPercent(data.raisin, data.total)})</p>
                                            <p><strong>Seco:</strong> {data.dry} ({formatPercent(data.dry, data.total)})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}

        </Container>
    );
};

export default ComparacaoAnaliseScreen;
