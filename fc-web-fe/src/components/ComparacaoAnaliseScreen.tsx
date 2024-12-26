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
} from 'recharts';
import api from '../services/api';

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
  padding: 20px;
  background-color: #3e2723;
`;

const Title = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 26px;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
`;

const FilterSection = styled.div`
  background-color: #42210b;
  padding: 20px;
  border-radius: 10px;
  width: 48%;
`;

const FilterLabel = styled.label`
  color: #f5f5f5;
  font-size: 14px;
  margin-bottom: 10px;
  display: block;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const FilterButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const Loading = styled.div`
  color: white;
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
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
  padding: 30px;
  border-radius: 12px;
  width: 90%; /* Aumenta o tamanho da modal */
  max-width: 1000px; /* Limite máximo de largura */
  max-height: 90%; /* Limite máximo de altura */
  overflow-y: auto; /* Adiciona scroll se necessário */
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e74c3c;
  color: white;
  border: none;
  font-size: 20px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #c0392b;
    transform: scale(1.1);
    transition: all 0.3s ease;
  }
`;


const ComparacaoAnaliseScreen = () => {
    const [fazendas, setFazendas] = useState<any[]>([]);
    const [grupos, setGrupos] = useState<any[]>([]);
    const [projetos, setProjetos] = useState<any[]>([]);
    const [talhoesLeft, setTalhoesLeft] = useState<any[]>([]);
    const [talhoesRight, setTalhoesRight] = useState<any[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [filtersLeft, setFiltersLeft] = useState({
        fazenda: '',
        talhao: '',
        grupo: '',
        projeto: '',
        startDate: '',
        endDate: '',
    });
    const [filtersRight, setFiltersRight] = useState({
        fazenda: '',
        talhao: '',
        grupo: '',
        projeto: '',
        startDate: '',
        endDate: '',
    });

    // Carrega listas iniciais de fazendas, grupos, projetos
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [fazendasData, gruposData, projetosData] = await Promise.all([
                    api.getAllFazendas(),
                    api.getAllGrupos(),
                    api.getAllProjetos(),
                ]);

                setFazendas(fazendasData.data);
                setGrupos(gruposData.data);
                setProjetos(projetosData.data);
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
            // Monta objeto com os dois conjuntos de filtros
            const requestBody = {
                filtersLeft,
                filtersRight,
            };
            // Faz a requisição ao backend no endpoint compare-analises
            const response = await api.compareAnalises(requestBody);
            const { leftData, rightData } = response.data;

            // Ajusta dados para o chart
            const leftChart: ChartData = {
                nome: 'Esquerda',
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
            };

            const rightChart: ChartData = {
                nome: 'Direita',
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
            };

            setChartData([leftChart, rightChart]);
            setModalVisible(true);
        } catch (error) {
            console.error('Erro ao buscar dados de comparação:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Comparação de Análises</Title>

            <FiltersContainer>
                {[filtersLeft, filtersRight].map((filters, idx) => (
                    <FilterSection key={idx}>
                        <FilterLabel>Fazenda</FilterLabel>
                        <FilterSelect
                            value={filters.fazenda}
                            onChange={(e) => {
                                const fazendaId = e.target.value;
                                if (idx === 0) {
                                    setFiltersLeft({ ...filtersLeft, fazenda: fazendaId });
                                    fetchTalhoes(fazendaId, setTalhoesLeft);
                                } else {
                                    setFiltersRight({ ...filtersRight, fazenda: fazendaId });
                                    fetchTalhoes(fazendaId, setTalhoesRight);
                                }
                            }}
                        >
                            <option value="">Selecione</option>
                            {fazendas.map((f: any) => (
                                <option key={f.id} value={f.id}>
                                    {f.nome}
                                </option>
                            ))}
                        </FilterSelect>

                        <FilterLabel>Talhão</FilterLabel>
                        <FilterSelect
                            value={filters.talhao}
                            onChange={(e) =>
                                idx === 0
                                    ? setFiltersLeft({ ...filtersLeft, talhao: e.target.value })
                                    : setFiltersRight({ ...filtersRight, talhao: e.target.value })
                            }
                        >
                            <option value="">Selecione</option>
                            {(idx === 0 ? talhoesLeft : talhoesRight).map((t: any) => (
                                <option key={t.id} value={t.id}>
                                    {t.nome}
                                </option>
                            ))}
                        </FilterSelect>

                        <FilterLabel>Grupo</FilterLabel>
                        <FilterSelect
                            value={filters.grupo}
                            onChange={(e) =>
                                idx === 0
                                    ? setFiltersLeft({ ...filtersLeft, grupo: e.target.value })
                                    : setFiltersRight({ ...filtersRight, grupo: e.target.value })
                            }
                        >
                            <option value="">Selecione</option>
                            {grupos.map((g: any) => (
                                <option key={g.id} value={g.id}>
                                    {g.nome}
                                </option>
                            ))}
                        </FilterSelect>

                        <FilterLabel>Projeto</FilterLabel>
                        <FilterSelect
                            value={filters.projeto}
                            onChange={(e) =>
                                idx === 0
                                    ? setFiltersLeft({ ...filtersLeft, projeto: e.target.value })
                                    : setFiltersRight({ ...filtersRight, projeto: e.target.value })
                            }
                        >
                            <option value="">Selecione</option>
                            {projetos.map((p: any) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome}
                                </option>
                            ))}
                        </FilterSelect>

                        <FilterLabel>Data Início</FilterLabel>
                        <FilterInput
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                idx === 0
                                    ? setFiltersLeft({ ...filtersLeft, startDate: e.target.value })
                                    : setFiltersRight({ ...filtersRight, startDate: e.target.value })
                            }
                        />

                        <FilterLabel>Data Fim</FilterLabel>
                        <FilterInput
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                idx === 0
                                    ? setFiltersLeft({ ...filtersLeft, endDate: e.target.value })
                                    : setFiltersRight({ ...filtersRight, endDate: e.target.value })
                            }
                        />
                    </FilterSection>
                ))}
            </FiltersContainer>

            <FilterButton onClick={handleCompare}>Comparar</FilterButton>
            {loading && <Loading>Carregando...</Loading>}

            {modalVisible && (
                <Modal>
                    <ModalContent>
                        <CloseButton onClick={() => setModalVisible(false)}>&times;</CloseButton>

                        {/* Nome acima do gráfico */}
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                            Comparação de Dados
                        </h2>

                        {/* Gráfico */}
                        <BarChart width={900} height={600} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                tick={false} // Remove os rótulos no eixo X
                                axisLine={false} // Remove a linha do eixo X (opcional)
                                tickLine={false} // Remove as marcações dos ticks no eixo X
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            {/* Barras com percentual e peso */}
                            <Bar dataKey="green" fill="#34A853" name="Verde">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.green, entry.total)}
                                    position="top"
                                />
                                <LabelList
                                    dataKey="greenWeight"
                                    formatter={(value: number) => `Peso: ${value.toFixed(2)} kg`}
                                    position="bottom"
                                />
                            </Bar>
                            <Bar dataKey="greenYellow" fill="#FFD700" name="Amarelo">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.greenYellow, entry.total)}
                                    position="top"
                                />
                                <LabelList
                                    dataKey="greenYellowWeight"
                                    formatter={(value: number) => `Peso: ${value.toFixed(2)} kg`}
                                    position="bottom"
                                />
                            </Bar>
                            <Bar dataKey="cherry" fill="#FF6347" name="Cherry">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.cherry, entry.total)}
                                    position="top"
                                />
                                <LabelList
                                    dataKey="cherryWeight"
                                    formatter={(value: number) => `Peso: ${value.toFixed(2)} kg`}
                                    position="bottom"
                                />
                            </Bar>
                            <Bar dataKey="raisin" fill="#8B4513" name="Raisin">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.raisin, entry.total)}
                                    position="top"
                                />
                                <LabelList
                                    dataKey="raisinWeight"
                                    formatter={(value: number) => `Peso: ${value.toFixed(2)} kg`}
                                    position="bottom"
                                />
                            </Bar>
                            <Bar dataKey="dry" fill="#A9A9A9" name="Dry">
                                <LabelList
                                    dataKey={(entry: any) => formatPercent(entry.dry, entry.total)}
                                    position="top"
                                />
                                <LabelList
                                    dataKey="dryWeight"
                                    formatter={(value: number) => `Peso: ${value.toFixed(2)} kg`}
                                    position="bottom"
                                />
                            </Bar>
                        </BarChart>
                    </ModalContent>
                </Modal>
            )}

        </Container>
    );
};

export default ComparacaoAnaliseScreen;
