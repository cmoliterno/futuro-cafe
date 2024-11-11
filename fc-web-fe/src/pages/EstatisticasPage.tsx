import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Importando do recharts
import api from '../services/api';

const EstatisticasContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const Select = styled.select`
  padding: 10px;
  margin: 10px;
  width: 50%;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  &:hover {
    background-color: #45a049;
  }
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #FFA500;
  text-align: center;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  padding: 10px;
  background-color: ${(props) => (props.isActive ? '#34A853' : '#E0E0E0')};
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px;
  width: 49%;
  &:hover {
    background-color: ${(props) => (props.isActive ? '#2A9F41' : '#D1D1D1')};
  }
`;

const DateInput = styled.input`
  padding: 10px;
  margin: 10px 0;
  justify-content: space-between;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
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
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [chartData, setChartData] = useState<ChartData[]>([]); // Agora é um array de objetos
    const [loading, setLoading] = useState(false);
    const [isFarmReport, setIsFarmReport] = useState<boolean>(true);  // Controle de tipo de gráfico (fazenda ou data)

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

        const diffTime = new Date(endDate).getTime() - new Date(startDate).getTime();
        // if (diffTime / (1000 * 3600 * 24) > 7) {
        //     alert('O período máximo para consulta por data é de 7 dias.');
        //     return;
        // }

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
            setChartData(data); // Agora o chartData é um array
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const transformChartData = (data: any): ChartData[] => {
        const chartData: ChartData[] = []; // Agora é um array de objetos

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
                    totalGreen += groupedData[date].Green || 0; // Garantir que valores undefined não causem erro
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
        setSelectedTalhao('');  // Limpar talhão quando mudar para gráfico por fazenda
        setStartDate('');       // Limpar data quando mudar para gráfico por fazenda
        setEndDate('');
    };

    return (
        <EstatisticasContainer>
            <Title>Estatísticas</Title>

            {/* Toggle para selecionar o tipo de relatório */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <ToggleButton
                    isActive={isFarmReport}
                    onClick={() => handleToggleReportType(true)}
                >
                    Por Fazenda
                </ToggleButton>
                <ToggleButton
                    isActive={!isFarmReport}
                    onClick={() => handleToggleReportType(false)}
                >
                    Por Data
                </ToggleButton>
            </div>

            {/* Exibição dos campos de filtro com base no tipo de relatório */}
            <Select
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

            {!isFarmReport && (
                <Select
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
            )}

            <span> Data inicial: </span>
            <DateInput
                type="date"
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
            />
            <span> Data Final: </span>
            <DateInput
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
            />

            {/* Botão de Filtro */}
            <Button onClick={handleFetchData} disabled={loading}>
                {loading ? 'Carregando...' : 'Filtrar'}
            </Button>

            {/* Feedback de Carregamento */}
            {loading && <LoadingText>Carregando...</LoadingText>}

            {/* Exibição do Gráfico */}
            {chartData.length > 0 && !loading && (
                <div style={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            {/* Alterar o eixo X conforme o tipo de relatório */}
                            <XAxis dataKey={isFarmReport ? 'talhao' : 'date'} />  {/* Usar talhao ou date conforme o tipo de relatório */}
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="green"
                                stroke="#34A853"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="greenYellow"
                                stroke="#FFD700"
                            />
                            <Line
                                type="monotone"
                                dataKey="cherry"
                                stroke="#FF6347"
                            />
                            <Line
                                type="monotone"
                                dataKey="raisin"
                                stroke="#8B4513"
                            />
                            <Line
                                type="monotone"
                                dataKey="dry"
                                stroke="#A9A9A9"
                            />
                        </LineChart>


                    </ResponsiveContainer>
                </div>
            )}
        </EstatisticasContainer>
    );
};

export default EstatisticasPage;
