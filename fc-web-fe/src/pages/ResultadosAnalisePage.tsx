import React, { useState } from 'react';
import {
    Container,
    Title,
    FilterContainer,
    FormGroup,
    Label,
    Select,
    Input,
    ButtonGroup,
    Button,
    ResultsContainer,
    ResultCard,
    ResultHeader,
    ResultContent,
    ResultItem,
    Value,
    NoDataMessage,
    LoadingMessage
} from './styles';

interface Fazenda {
    id: string;
    nome: string;
}

interface Talhao {
    id: string;
    nome: string;
}

interface Analysis {
    id: string;
    talhao: {
        nome: string;
    };
    createdAt: string;
    green: number;
    greenYellow: number;
    cherry: number;
    raisin: number;
    dry: number;
    total: number;
}

const ResultadosAnalisePage: React.FC = () => {
    const [filters, setFilters] = useState({
        fazenda: '',
        talhao: '',
        dataInicio: '',
        dataFim: ''
    });
    const [fazendas, setFazendas] = useState<Fazenda[]>([]);
    const [talhoes, setTalhoes] = useState<Talhao[]>([]);
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            // Simulação de busca
            const response = await fetch('/api/analyses');
            const data = await response.json();
            setAnalyses(data);
        } catch (error) {
            console.error('Erro ao buscar análises:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            fazenda: '',
            talhao: '',
            dataInicio: '',
            dataFim: ''
        });
    };

    return (
        <Container>
            <Title>Resultados da Análise</Title>

            <FilterContainer>
                <FormGroup>
                    <Label>Fazenda</Label>
                    <Select
                        value={filters.fazenda}
                        onChange={(e) => handleFilterChange('fazenda', e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {fazendas.map(fazenda => (
                            <option key={fazenda.id} value={fazenda.id}>{fazenda.nome}</option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Talhão</Label>
                    <Select
                        value={filters.talhao}
                        onChange={(e) => handleFilterChange('talhao', e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {talhoes.map(talhao => (
                            <option key={talhao.id} value={talhao.id}>{talhao.nome}</option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Data Início</Label>
                    <Input
                        type="date"
                        value={filters.dataInicio}
                        onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Data Fim</Label>
                    <Input
                        type="date"
                        value={filters.dataFim}
                        onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                    />
                </FormGroup>

                <ButtonGroup>
                    <Button onClick={handleSearch}>Buscar Análises</Button>
                    <Button onClick={handleClearFilters} variant="secondary">Limpar Filtros</Button>
                </ButtonGroup>
            </FilterContainer>

            {loading ? (
                <LoadingMessage>Carregando análises...</LoadingMessage>
            ) : analyses.length > 0 ? (
                <ResultsContainer>
                    {analyses.map(analysis => (
                        <ResultCard key={analysis.id}>
                            <ResultHeader>
                                <h3>{analysis.talhao?.nome || 'Talhão não especificado'}</h3>
                                <span>{new Date(analysis.createdAt).toLocaleDateString('pt-BR')}</span>
                            </ResultHeader>
                            <ResultContent>
                                <ResultItem>
                                    <Label>Verde:</Label>
                                    <Value>{((analysis.green / analysis.total) * 100).toFixed(2)}%</Value>
                                </ResultItem>
                                <ResultItem>
                                    <Label>Verde Cana:</Label>
                                    <Value>{((analysis.greenYellow / analysis.total) * 100).toFixed(2)}%</Value>
                                </ResultItem>
                                <ResultItem>
                                    <Label>Cereja:</Label>
                                    <Value>{((analysis.cherry / analysis.total) * 100).toFixed(2)}%</Value>
                                </ResultItem>
                                <ResultItem>
                                    <Label>Passa:</Label>
                                    <Value>{((analysis.raisin / analysis.total) * 100).toFixed(2)}%</Value>
                                </ResultItem>
                                <ResultItem>
                                    <Label>Seco:</Label>
                                    <Value>{((analysis.dry / analysis.total) * 100).toFixed(2)}%</Value>
                                </ResultItem>
                                <ResultItem>
                                    <Label>Total:</Label>
                                    <Value>{analysis.total} grãos</Value>
                                </ResultItem>
                            </ResultContent>
                        </ResultCard>
                    ))}
                </ResultsContainer>
            ) : (
                <NoDataMessage>
                    Nenhuma análise encontrada com os filtros selecionados.
                </NoDataMessage>
            )}
        </Container>
    );
};

export default ResultadosAnalisePage;
 