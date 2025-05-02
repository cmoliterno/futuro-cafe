import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaDownload, FaRedo, FaImage, FaCheck, FaExpand, FaChartBar, FaColumns, FaCamera, FaSearch, FaEraser } from 'react-icons/fa';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList, ResponsiveContainer} from 'recharts';
import ModalColetaImagens from './ModalColetaImagens';
import { getFirstDayOfCurrentMonth, getCurrentDate } from '../utils/dateUtils';
import { percentFormatter } from '../utils/formatUtils';

const Container = styled.div`
  padding: 30px;
  background-color: var(--color-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  margin: 20px;
`;

const Title = styled.h1`
  color: var(--color-primary);
  margin-bottom: 30px;
  text-align: center;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  background-color: var(--color-surface);
  padding: 25px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 8px;
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
  gap: 8px;
  
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

const SortingSection = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ResultsSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  justify-items: center;
`;

const ResultCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
  text-align: center;
  color: #333;
  border: 1px solid #ddd;

  &:hover {
    transform: scale(1.03);
    transition: 0.3s;
  }
`;

const ResultImage = styled.img`
  width: 100%;
  height: 200px; /* Altura maior para melhorar o layout */
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
  cursor: pointer;
`;

const ResultInfo = styled.div`
  margin-top: 10px;
  text-align: left;
  padding: 10px;
`;

const ColorLabel = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 14px;

  span {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-color: ${(props) => props.color};
    margin-right: 10px;
    border-radius: 50%;
  }
`;

const PaginationSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
  gap: 10px;

  span {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
  }
`;

const PaginationButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  border: none;

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: #28a745;
  color: white;
  padding: 15px;
  border-radius: 50%;
  border: none;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 18px;
  z-index: 1000;

  &:hover {
    background-color: #218838;
  }
`;

const Loading = styled.div`
  color: #fff;
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
`;

const ChartModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  flex-direction: column; /* Mantém a flexibilidade */
`;

const ChartContainer = styled.div`
  width: 80%;
  height: 60%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1020;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary-dark);
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  max-height: 90%;
  overflow: auto; /* Permite rolagem em telas menores */
  z-index: 1010;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const SingleImage = styled.img`
  max-width: 80%;
  max-height: 80%;
  border-radius: 10px;
  object-fit: contain;
`;

const DualImage = styled.img`
  max-width: 45%;
  height: auto;
  max-height: 500px;
  border-radius: 10px;
  object-fit: cover;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  
  button {
    background-color: var(--color-secondary);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: var(--border-radius-round);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-normal);
    padding: 0;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:nth-child(2) {
      background-color: var(--color-info);
    }
    
    &:nth-child(3) {
      background-color: var(--color-accent);
    }
    
    &:nth-child(4) {
      background-color: var(--color-primary-light);
    }
  }
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  
  span {
    font-weight: bold;
    margin-left: 5px;
    background-color: var(--color-warning);
    color: var(--color-primary);
    padding: 2px 8px;
    border-radius: var(--border-radius-sm);
  }
`;

interface ModalProps {
    isVisible: boolean;
    isSideBySide: boolean;
    originalImage?: string | null;
    analyzedImage?: string | null;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, isSideBySide, originalImage, analyzedImage, onClose }) => {
    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ModalContent>
                <CloseButton onClick={onClose}>×</CloseButton>
                <ImageContainer>
                    {isSideBySide ? (
                        <>
                            <DualImage src={originalImage || ''} alt="Imagem Original" />
                            <DualImage src={analyzedImage || ''} alt="Imagem Analisada" />
                        </>
                    ) : (
                        <SingleImage src={analyzedImage || originalImage || ''} alt="Imagem" />
                    )}
                </ImageContainer>
            </ModalContent>
        </div>
    );
};

// Botão de nova análise
const NewAnalysisButton = styled(Button)`
  margin-left: auto; /* Empurra para a direita */
  background-color: #4CAF50;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ResultadosAnaliseScreen: React.FC = () => {
    const { talhaoId } = useParams<{ talhaoId: string }>();

    const [fazendas, setFazendas] = useState<any[]>([]);
    const [talhoes, setTalhoes] = useState<any[]>([]);
    const [grupos, setGrupos] = useState<any[]>([]);
    const [projetos, setProjetos] = useState<any[]>([]);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [selectedFazenda, setSelectedFazenda] = useState<string>('');
    const [selectedTalhao, setSelectedTalhao] = useState<string>(talhaoId || '');
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedProjeto, setSelectedProjeto] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(getFirstDayOfCurrentMonth());
    const [endDate, setEndDate] = useState<string>(getCurrentDate());
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [chartVisible, setChartVisible] = useState(false);
    const [selectedFarmName, setSelectedFarmName] = useState<string>('Fazenda não selecionada');
    const [selectedPlotName, setSelectedPlotName] = useState<string>('Talhão não selecionado');
    const [isSideBySide, setIsSideBySide] = useState(false);
    const [selectedOriginalImage, setSelectedOriginalImage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingTalhoes, setLoadingTalhoes] = useState(false);
    const [sortConfig, setSortConfig] = useState<{
        key: 'createdAt';
        direction: 'asc' | 'desc';
    }>({ key: 'createdAt', direction: 'desc' });

    // Adicionando estados para o modal de coleta de imagens
    const [modalColetaVisible, setModalColetaVisible] = useState(false);
    const [selectedTalhaoId, setSelectedTalhaoId] = useState<string | null>(null);
    const [selectedTalhaoNome, setSelectedTalhaoNome] = useState<string>('');

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                setLoading(true)
                const fazendasData = await api.getAllFazendas();
                const projetosData = await api.getAllProjetos();
                const gruposData = await api.getAllGrupos();
                setFazendas(fazendasData.data);
                setProjetos(projetosData.data);
                setGrupos(gruposData.data);
                setLoading(false)
            } catch (error) {
                console.error('Erro ao carregar filtros:', error);
            }
        };

        fetchFilters();
        // Buscar análises com as datas iniciais ao carregar a tela
        if (selectedFazenda && selectedTalhao) {
            fetchAnalyses(1);
        }
    }, []);

    useEffect(() => {
        if (selectedFazenda) {
            const fetchTalhoes = async () => {
                setLoadingTalhoes(true);
                try {
                    const talhoesData = await api.getTalhoesByFazenda(selectedFazenda);
                    setTalhoes(talhoesData.data);
                } catch (error) {
                    console.error('Erro ao buscar talhões:', error);
                } finally {
                    setLoadingTalhoes(false);
                }
            };

            fetchTalhoes();
        }
    }, [selectedFazenda]);

    useEffect(() => {
        if (talhaoId) {
            fetchAnalyses(1);
        }
    }, [talhaoId]);

    const fetchAnalyses = async (page: number) => {
        if (page < 1) return;

        setLoading(true);
        try {
            const params = {
                fazendaId: selectedFazenda,
                talhaoId: selectedTalhao,
                grupoId: selectedGrupo,
                projetoId: selectedProjeto,
                startDate,
                endDate,
                page,
                sortDirection: sortConfig.direction
            };
            const { data } = await api.getFilteredAnalyses(params);

            setAnalyses(data.result || []);
            
            // Atualizar os nomes apenas se houver seleção específica
            if (selectedFazenda) {
            setSelectedFarmName(
                fazendas.find((f) => f.id === selectedFazenda)?.nome || "Fazenda não selecionada"
            );
            }
            if (selectedTalhao) {
            setSelectedPlotName(
                talhoes.find((t) => t.id === selectedTalhao)?.nome || "Talhão não selecionado"
            );
            }
            
            setPagination({
                currentPage: data.page,
                totalPages: data.pages,
            });
        } catch (error) {
            console.error("Erro ao carregar análises:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (image: string) => {
        setModalImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalImage(null);
        setIsSideBySide(false); // Resetar a visualização de comparação lado a lado
    };

    const handleSelectImage = (analysis: any) => {
        setSelectedImages((prev) => {
            const isAlreadySelected = prev.some((item) => item.id === analysis.id);

            if (isAlreadySelected) {
                // Remove a imagem caso já esteja selecionada
                return prev.filter((item) => item.id !== analysis.id);
            } else {
                // Adiciona a imagem com o próximo nome (A, B, C...)
                const nextName = String.fromCharCode(65 + prev.length); // Gera A, B, C, etc.
                return [...prev, { ...analysis, name: nextName }];
            }
        });
    };

    const openComparisonChart = () => {
        if (selectedImages.length === 0) {
            alert('Selecione pelo menos uma imagem para exibir o gráfico.');
            return;
        }
        setChartVisible(true);
    };

    const handleReanalyzeImage = async (imageId: string) => {
        try {
            const formData = new FormData();
            formData.append('imageId', imageId);

            await api.addPlotAnalysis(selectedTalhao, formData);

            alert('Imagem reenviada para análise com sucesso!');

            const analysisData = await api.getPlotAnalyses(selectedTalhao);
            setAnalyses(analysisData.data);
        } catch (error) {
            console.error('Erro ao reenviar a imagem para análise:', error);
        }
    };

    const handleDownloadImage = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'imagem.jpg';
        link.click();
    };

    const handleImagePressSideBySide = (item: any) => {
        setSelectedImage(item.imagemResultadoUrl);
        setSelectedOriginalImage(item.imagemUrl);
        setIsSideBySide(true);
        setModalVisible(true);
    };

    const handleSort = (key: 'createdAt') => {
        const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
        fetchAnalyses(pagination.currentPage); // Recarrega a página atual com a nova ordenação
    };

    // Modificar o handler de limpar filtros para resetar as datas aos valores padrão
    const handleClearFilters = () => {
        setSelectedFazenda('');
        setSelectedTalhao('');
        setStartDate(getFirstDayOfCurrentMonth());
        setEndDate(getCurrentDate());
        setAnalyses([]);
        setPagination({ currentPage: 1, totalPages: 1 });
    };

    // Handler para abrir o modal de coleta de imagens
    const handleOpenColetaModal = () => {
        if (!selectedTalhaoId) {
            alert('Por favor, selecione um talhão antes de coletar imagens');
            return;
        }
        setModalColetaVisible(true);
    };

    // Handler para quando o upload for bem-sucedido
    const handleSuccessfulUpload = () => {
        // Recarregar análises para mostrar as novas
        fetchAnalyses(pagination.currentPage);
    };

    // Modificar o handler existente para seleção de talhão
    const handleTalhaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const talhaoId = e.target.value;
        const talhaoNome = e.target.options[e.target.selectedIndex].text;
        
        // Atualizar os estados já existentes
        setSelectedTalhao(talhaoId);
        setSelectedPlotName(talhaoNome);
        
        // Atualizar estado para o modal
        setSelectedTalhaoId(talhaoId || null);
        setSelectedTalhaoNome(talhaoId ? talhaoNome : '');
    };

    return (
        <Container>
            <Title>Resultados da Análise</Title>

            <FiltersContainer>
                <FilterGroup>
                    <FilterLabel>Fazenda</FilterLabel>
                    <Select
                        value={selectedFazenda}
                        onChange={(e) => {
                            setSelectedFazenda(e.target.value);
                            setSelectedFarmName(e.target.name);
                        }}
                    >
                        <option value="">Selecione</option>
                        {fazendas.map((fazenda) => (
                            <option key={fazenda.id} value={fazenda.id}>
                                {fazenda.nome}
                            </option>
                        ))}
                    </Select>
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Talhão</FilterLabel>
                    <Select
                        value={selectedTalhao}
                        onChange={handleTalhaoChange}
                        disabled={!selectedFazenda || loadingTalhoes}
                    >
                        <option value="">{loadingTalhoes ? "Carregando talhões..." : "Selecione"}</option>
                        {!loadingTalhoes && talhoes.map((talhao) => (
                            <option key={talhao.id} value={talhao.id}>
                                {talhao.nome}
                            </option>
                        ))}
                    </Select>
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Data Início</FilterLabel>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--color-gray-300)',
                            borderRadius: 'var(--border-radius-md)',
                        }}
                    />
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Data Fim</FilterLabel>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--color-gray-300)',
                            borderRadius: 'var(--border-radius-md)',
                        }}
                    />
                </FilterGroup>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <Button onClick={() => fetchAnalyses(1)}>
                        <FaSearch /> Buscar Análises
                    </Button>
                    <Button onClick={handleClearFilters} style={{ backgroundColor: '#e74c3c' }}>
                        <FaEraser /> Limpar Filtros
                    </Button>
                    <NewAnalysisButton 
                        onClick={handleOpenColetaModal}
                        disabled={!selectedTalhaoId}
                        title={!selectedTalhaoId ? "Selecione um talhão primeiro" : "Coletar novas imagens para análise"}
                    >
                        <FaCamera /> Nova Análise
                    </NewAnalysisButton>
                </div>
            </FiltersContainer>

            {/* Carregando */}
            {loading && <Loading>Carregando, por favor, aguarde...</Loading>}

            {/* Seção de Resultados */}
            <ResultsSection>
                <SortingSection>
                    <Button onClick={() => handleSort('createdAt')}>
                        {sortConfig.direction === 'asc' ? 'Mais antigas primeiro ↑' : 'Mais recentes primeiro ↓'}
                    </Button>
                </SortingSection>

                <ResultsGrid>
                    {analyses.map((analysis) => (
                        <ResultCard key={analysis.id}>
                            <ResultImage
                                src={analysis.imagemResultadoUrl}
                                alt={`Análise ${analysis.id}`}
                                onClick={() => handleImageClick(analysis.imagemResultadoUrl)}
                            />
                            <ResultInfo>
                                <ColorLabel color="#34A853">
                                    <span /> Verde: {((analysis.green / analysis.total) * 100).toFixed(2)}%
                                </ColorLabel>
                                <ColorLabel color="#FFD700">
                                    <span /> Verde Cana: {((analysis.greenYellow / analysis.total) * 100).toFixed(2)}%
                                </ColorLabel>
                                <ColorLabel color="#FF6347">
                                    <span /> Cereja: {((analysis.cherry / analysis.total) * 100).toFixed(2)}%
                                </ColorLabel>
                                <ColorLabel color="#8B4513">
                                    <span /> Passa: {((analysis.raisin / analysis.total) * 100).toFixed(2)}%
                                </ColorLabel>
                                <ColorLabel color="#A9A9A9">
                                    <span /> Seco: {((analysis.dry / analysis.total) * 100).toFixed(2)}%
                                </ColorLabel>
                                <ColorLabel color="#FFFFFF">
                                    <span /> Total: {analysis.total}
                                </ColorLabel>
                                <p>Data da Análise: {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}</p>
                                <p>Fazenda: {analysis.fazendaNome}</p>
                                <p>Talhão: {analysis.talhaoNome}</p>
                            </ResultInfo>
                            <Actions>
                                <input
                                    type="checkbox"
                                    checked={selectedImages.some((item) => item.id === analysis.id)}
                                    onChange={() => handleSelectImage(analysis)}
                                />
                                <button onClick={() => handleReanalyzeImage(analysis.id)}>
                                    <FaRedo color="#FFF" />
                                </button>
                                <button onClick={() => handleDownloadImage(analysis.imagemResultadoUrl)}>
                                    <FaDownload color="#FFF" />
                                </button>
                                <button onClick={() => handleImagePressSideBySide(analysis)}>
                                    <FaColumns color="#FFF" />
                                </button>
                                {selectedImages.some((item) => item.id === analysis.id) && (
                                    <span>
                                        {selectedImages.find((item) => item.id === analysis.id)?.name}
                                    </span>
                                )}
                            </Actions>
                        </ResultCard>
                    ))}
                </ResultsGrid>

                {analyses.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        Nenhuma análise encontrada para os filtros selecionados.
                    </div>
                )}
            </ResultsSection>

            {/* Paginação */}
            <PaginationSection>
                <PaginationButton
                    onClick={() => {
                        if (pagination.currentPage > 1) {
                            fetchAnalyses(pagination.currentPage - 1);
                        }
                    }}
                    disabled={pagination.currentPage === 1}
                >
                    Anterior
                </PaginationButton>
                <span>
                    Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <PaginationButton
                    onClick={() => {
                        if (pagination.currentPage < pagination.totalPages) {
                            fetchAnalyses(pagination.currentPage + 1);
                        }
                    }}
                    disabled={pagination.currentPage === pagination.totalPages}
                >
                    Próximo
                </PaginationButton>
            </PaginationSection>

            {/* Botão flutuante */}
            <FloatingButton onClick={openComparisonChart}>
                <FaChartBar />
            </FloatingButton>

            {modalVisible && (
                <Modal
                    isVisible={modalVisible}
                    isSideBySide={isSideBySide}
                    originalImage={selectedOriginalImage}
                    analyzedImage={selectedImage || modalImage}
                    onClose={closeModal}
                />
            )}

            {chartVisible && (
                <ChartModal>
                    <CloseButton onClick={() => setChartVisible(false)}>×</CloseButton>
                    <ChartContainer>
                        <BarChart
                            width={800}
                            height={500}
                            data={selectedImages.map((image) => ({
                                ...image,
                                nome: image.name,
                                verde: ((image.green / image.total) * 100).toFixed(2),
                                verdeCana: ((image.greenYellow / image.total) * 100).toFixed(2),
                                cereja: ((image.cherry / image.total) * 100).toFixed(2),
                                passa: ((image.raisin / image.total) * 100).toFixed(2),
                                seco: ((image.dry / image.total) * 100).toFixed(2),
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nome" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="verde" name="Verde" stackId="a" fill="#34A853">
                                <LabelList
                                    dataKey="verde"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="verdeCana" name="Verde Cana" stackId="a" fill="#FFD700">
                                <LabelList
                                    dataKey="verdeCana"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="cereja" name="Cereja" stackId="a" fill="#FF6347">
                                <LabelList
                                    dataKey="cereja"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="passa" name="Passa" stackId="a" fill="#8B4513">
                                <LabelList
                                    dataKey="passa"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="seco" name="Seco" stackId="a" fill="#A9A9A9">
                                <LabelList
                                    dataKey="seco"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </ChartModal>
            )}

            {/* Modal para coleta de imagens */}
            <ModalColetaImagens
                isOpen={modalColetaVisible}
                onClose={() => setModalColetaVisible(false)}
                talhaoId={selectedTalhaoId || ''}
                talhaoNome={selectedTalhaoNome}
                onSuccessfulUpload={handleSuccessfulUpload}
            />
        </Container>
    );
};

export default ResultadosAnaliseScreen;
