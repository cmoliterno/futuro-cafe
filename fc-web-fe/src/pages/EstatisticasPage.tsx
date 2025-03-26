import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import api from '../services/api';

const EstatisticasContainer = styled.div`
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

const ChartContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-xl);
  height: 500px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Tab = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: var(--spacing-md);
  background-color: ${(props) => (props.isActive ? 'var(--color-secondary)' : 'var(--color-gray-200)')};
  color: ${(props) => (props.isActive ? 'white' : 'var(--color-gray-700)')};
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition-normal);
  
  &:hover {
    background-color: ${(props) => (props.isActive ? 'var(--color-secondary-dark)' : 'var(--color-gray-300)')};
  }
`;

const SelectContainer = styled.div`
  margin-bottom: var(--spacing-md);
`;

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const FormField = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
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
  margin-bottom: var(--spacing-md);
  
  &:focus {
    border-color: var(--color-secondary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.2);
  }
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
  margin: 0 auto;
  min-width: 150px;
  box-shadow: var(--shadow-button);
  
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

const LoadingText = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  text-align: center;
  margin: var(--spacing-lg) 0;
  font-weight: 500;
`;

const NoDataText = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-accent);
  text-align: center;
  margin: var(--spacing-xl) 0;
  font-weight: 500;
`;

interface ChartData {
    talhao?: string;
    date?: string;
    green: number;
    greenYellow: number;
    cherry: number;
    raisin: number;
    dry: number;
}

const EstatisticasPage: React.FC = () => {
    const [fazendas, setFazendas] = useState<any[]>([]);
    const [talhoes, setTalhoes] = useState<any[]>([]);
    const [selectedFazenda, setSelectedFazenda] = useState<string | null>(null);
    const [selectedTalhao, setSelectedTalhao] = useState<string>('');
    
    // Função para obter o primeiro dia do mês atual formatado como YYYY-MM-DD
    const getFirstDayOfCurrentMonth = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    };

    // Função para obter a data atual formatada como YYYY-MM-DD
    const getCurrentDate = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };
    
    const [startDate, setStartDate] = useState<string>(getFirstDayOfCurrentMonth());
    const [endDate, setEndDate] = useState<string>(getCurrentDate());
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFarmReport, setIsFarmReport] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof ChartData;
        direction: 'asc' | 'desc';
    } | null>(null);

    useEffect(() => {
        fetchFazendas();
    }, []);

    useEffect(() => {
        if (selectedFazenda) {
            fetchTalhoes(selectedFazenda);
        }
    }, [selectedFazenda]);

    const fetchFazendas = async () => {
        try {
            const response = await api.getAllFazendas();
            setFazendas(response.data);
        } catch (error) {
            console.error('Erro ao carregar fazendas:', error);
        }
    };

    const fetchTalhoes = async (fazendaId: string) => {
        try {
            const response = await api.getTalhoesByFazenda(fazendaId);
            setTalhoes(response.data);
        } catch (error) {
            console.error('Erro ao carregar talhões:', error);
        }
    };

    const handleFetchData = async () => {
        // Verificar se todos os campos necessários foram preenchidos
        if (!selectedFazenda) {
            alert('Por favor, selecione uma fazenda.');
            return;
        }

        if (isFarmReport && !startDate) {
            alert('Por favor, selecione uma data para o gráfico por fazenda.');
            return;
        }

        if (!isFarmReport && (!selectedTalhao || !startDate || !endDate)) {
            alert('Por favor, selecione todos os campos para o gráfico por data.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.getDataToChartBy({
                farmId: selectedFazenda,
                plotId: selectedTalhao,  // Será utilizado apenas se for por data
                startDate,
                endDate,
                reportType: isFarmReport ? 'byFarm' : 'byDate', // Envia o tipo de relatório
            });

            const data = transformChartData(response.data);
            setChartData(data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const transformChartData = (data: any): ChartData[] => {
        const chartData: ChartData[] = [];

        if (isFarmReport) {
            // Aqui lidamos com o tipo "Por Fazenda"
            data.forEach((talhaoData: any) => {
                const { talhao, groupedData } = talhaoData;

                // Inicializamos os totais por talhão
                let totalGreen = 0;
                let totalGreenYellow = 0;
                let totalCherry = 0;
                let totalRaisin = 0;
                let totalDry = 0;

                // Para cada talhão, precisamos somar os valores dos dias
                Object.keys(groupedData).forEach((date) => {
                    totalGreen += groupedData[date].Green || 0;
                    totalGreenYellow += groupedData[date].GreenYellow || 0;
                    totalCherry += groupedData[date].Cherry || 0;
                    totalRaisin += groupedData[date].Raisin || 0;
                    totalDry += groupedData[date].Dry || 0;
                });

                // Agora adicionamos os dados consolidados no gráfico
                chartData.push({
                    talhao: talhao,  // Nome do talhão
                    green: totalGreen,
                    greenYellow: totalGreenYellow,
                    cherry: totalCherry,
                    raisin: totalRaisin,
                    dry: totalDry,
                });
            });
        } else {
            // Quando for "Por Data", o formato continua como antes
            const { Green, GreenYellow, Cherry, Raisin, Dry, labels } = data;
            labels.forEach((label: string, index: number) => {
                chartData.push({
                    date: label, // Aqui usamos a data
                    green: Green[index],
                    greenYellow: GreenYellow[index],
                    cherry: Cherry[index],
                    raisin: Raisin[index],
                    dry: Dry[index],
                });
            });
        }

        return chartData;
    };

    // Limpar os campos ao trocar o tipo de relatório
    const handleToggleReportType = (isFarm: boolean) => {
        setIsFarmReport(isFarm);
        setSelectedTalhao('');
        setStartDate(getFirstDayOfCurrentMonth());
        setEndDate(getCurrentDate());
        setChartData([]);
    };

    const handleSort = (key: keyof ChartData) => {
        const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        const sortedData = [...chartData].sort((a, b) => {
            if (key === 'date' || key === 'talhao') {
                const aValue = String(a[key] || '');
                const bValue = String(b[key] || '');
                return direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            const aValue = Number(a[key] || 0);
            const bValue = Number(b[key] || 0);
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
        });

        setChartData(sortedData);
    };

    // Função para calcular o total de cada registro para percentuais
    const calculateTotal = (item: ChartData): number => {
        return item.green + item.greenYellow + item.cherry + item.raisin + item.dry;
    };

    // Formatter para exibir percentuais
    const percentFormatter = (value: number, entry: any) => {
        // Verificar se temos dados válidos para calcular o percentual
        if (value === 0 || !chartData || chartData.length === 0) return '0%';

        // Encontrar o item correspondente nos dados do gráfico
        // Como não podemos confiar em entry.payload, usamos o valor e o dataKey (já temos o value)
        // e encontramos o item pelo índice do elemento no gráfico
        const index = entry?.index ?? 0;
        if (!chartData[index]) return '0%';
        
        const item = chartData[index];
        const total = calculateTotal(item);
        
        if (total === 0) return '0%';
        const percent = (value / total * 100).toFixed(1);
        return `${percent}%`;
    };

    return (
        <EstatisticasContainer>
            <Title>Estatísticas</Title>

            <TabsContainer>
                <Tab
                    isActive={isFarmReport}
                    onClick={() => handleToggleReportType(true)}
                >
                    Por Fazenda
                </Tab>
                <Tab
                    isActive={!isFarmReport}
                    onClick={() => handleToggleReportType(false)}
                >
                    Por Data
                </Tab>
            </TabsContainer>

            <FormContainer>
                <FormField>
                    <Label>Fazenda</Label>
                    <Select
                        value={selectedFazenda || ''}
                        onChange={(e) => setSelectedFazenda(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Selecione a Fazenda</option>
                        {fazendas.map((fazenda) => (
                            <option key={fazenda.id} value={fazenda.id}>
                                {fazenda.nome}
                            </option>
                        ))}
                    </Select>
                </FormField>

                {!isFarmReport && (
                    <FormField>
                        <Label>Talhão</Label>
                        <Select
                            value={selectedTalhao}
                            onChange={(e) => setSelectedTalhao(e.target.value)}
                            disabled={loading || !selectedFazenda}
                        >
                            <option value="">Selecione o Talhão</option>
                            {talhoes.map((talhao) => (
                                <option key={talhao.id} value={talhao.id}>
                                    {talhao.nome}
                                </option>
                            ))}
                        </Select>
                    </FormField>
                )}

                <FormField>
                    <Label>Data Inicial</Label>
                    <DateInput
                        type="date"
                        value={startDate || ''}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={loading}
                    />
                </FormField>

                <FormField>
                    <Label>Data Final</Label>
                    <DateInput
                        type="date"
                        value={endDate || ''}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={loading}
                    />
                </FormField>
            </FormContainer>

            <Button onClick={handleFetchData} disabled={loading}>
                {loading ? 'Carregando...' : 'Filtrar'}
            </Button>

            {loading && <LoadingText>Carregando dados, por favor aguarde...</LoadingText>}

            {chartData.length > 0 && !loading && (
                <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey={isFarmReport ? 'talhao' : 'date'} 
                                tick={{ fill: 'var(--color-primary)', fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: 'var(--color-primary)', fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--color-surface)', 
                                    borderColor: 'var(--color-primary)',
                                    borderRadius: 'var(--border-radius-md)'
                                }} 
                            />
                            <Legend />
                            <Bar
                                dataKey="green"
                                fill="#34A853"
                                name="Verde"
                            >
                                <LabelList 
                                    dataKey="green"
                                    position="center"
                                    formatter={percentFormatter}
                                    style={{ fill: 'black', fontWeight: 'bold', fontSize: 11 }}
                                />
                            </Bar>
                            <Bar
                                dataKey="greenYellow"
                                fill="#FFD700"
                                name="Verde Cana"
                            >
                                <LabelList 
                                    dataKey="greenYellow"
                                    position="center"
                                    formatter={percentFormatter}
                                    style={{ fill: 'black', fontWeight: 'bold', fontSize: 11 }}
                                />
                            </Bar>
                            <Bar
                                dataKey="cherry"
                                fill="#FF6347"
                                name="Cereja"
                            >
                                <LabelList 
                                    dataKey="cherry"
                                    position="center"
                                    formatter={percentFormatter}
                                    style={{ fill: 'black', fontWeight: 'bold', fontSize: 11 }}
                                />
                            </Bar>
                            <Bar
                                dataKey="raisin"
                                fill="#8B4513"
                                name="Passa"
                            >
                                <LabelList 
                                    dataKey="raisin"
                                    position="center"
                                    formatter={percentFormatter}
                                    style={{ fill: 'black', fontWeight: 'bold', fontSize: 11 }}
                                />
                            </Bar>
                            <Bar
                                dataKey="dry"
                                fill="#A9A9A9"
                                name="Seco"
                            >
                                <LabelList 
                                    dataKey="dry"
                                    position="center"
                                    formatter={percentFormatter}
                                    style={{ fill: 'black', fontWeight: 'bold', fontSize: 11 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )}
            
            {chartData.length === 0 && !loading && (
                <NoDataText>Sem dados para exibir. Selecione os filtros e clique em "Filtrar".</NoDataText>
            )}
        </EstatisticasContainer>
    );
};

export default EstatisticasPage;
