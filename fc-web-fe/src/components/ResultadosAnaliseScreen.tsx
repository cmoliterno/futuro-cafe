import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaDownload, FaRedo, FaImage, FaCheck, FaExpand, FaChartBar, FaColumns } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Container = styled.div`
  padding: 20px;
  background-color: #3E2723;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #fff;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;

const FilterSelect = styled.select`
  width: 200px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 14px;
`;

const FilterButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const ResultCard = styled.div`
  background-color: #4E342E;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 280px;
  text-align: center;
  color: #fff;
`;

const ResultImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
  cursor: pointer;
`;

const ResultInfo = styled.div`
  margin-top: 10px;
  text-align: left;
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
`;

const PaginationButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 14px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Modal = styled.div`
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
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ChartModal = styled(Modal)`
  flex-direction: column;
`;

const ChartContainer = styled.div`
  width: 80%;
  height: 60%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SideBySideContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const SideBySideImage = styled.img`
  max-width: 45%;
  height: auto;
  max-height: 500px;
  border-radius: 10px;
  object-fit: cover;
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
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [chartVisible, setChartVisible] = useState(false);
    const [selectedFarmName, setSelectedFarmName] = useState<string>('Fazenda não selecionada');
    const [selectedPlotName, setSelectedPlotName] = useState<string>('Talhão não selecionado');
    const [isSideBySide, setIsSideBySide] = useState(false); // Para comparar lado a lado
    const [selectedOriginalImage, setSelectedOriginalImage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const fazendasData = await api.getAllFazendas();
                const projetosData = await api.getAllProjetos();
                const gruposData = await api.getAllGrupos();
                setFazendas(fazendasData.data);
                setProjetos(projetosData.data);
                setGrupos(gruposData.data);
            } catch (error) {
                console.error('Erro ao carregar filtros:', error);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        if (selectedFazenda) {
            const fetchTalhoes = async () => {
                try {
                    const talhoesData = await api.getTalhoesByFazenda(selectedFazenda);
                    setTalhoes(talhoesData.data);
                } catch (error) {
                    console.error('Erro ao buscar talhões:', error);
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
        try {
            const params = {
                fazendaId: selectedFazenda,
                talhaoId: selectedTalhao,
                grupoId: selectedGrupo,
                projetoId: selectedProjeto,
                startDate,
                endDate,
                page,
            };
            const { data } = await api.getFilteredAnalyses(params);
            setAnalyses(data.result || []);
            setPagination({ currentPage: data.page, totalPages: data.totalPages });
        } catch (error) {
            console.error('Erro ao carregar análises:', error);
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
            if (prev.includes(analysis)) {
                return prev.filter((item) => item !== analysis);
            } else {
                return [...prev, analysis];
            }
        });
    };

    const openComparisonChart = () => {
        if (selectedImages.length > 1) {
            setChartVisible(true);
        } else {
            alert('Selecione pelo menos duas imagens para comparar.');
        }
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

    return (
        <Container>
            <Title>Resultados da Análise</Title>

            <FilterSection>
                <div>
                    <FilterLabel>Fazenda</FilterLabel>
                    <FilterSelect
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
                    </FilterSelect>
                </div>

                <div>
                    <FilterLabel>Talhão</FilterLabel>
                    <FilterSelect
                        value={selectedTalhao}
                        onChange={(e) => {
                            setSelectedTalhao(e.target.value);
                            setSelectedPlotName(e.target.name);
                        }}
                        disabled={!selectedFazenda}
                    >
                        <option value="">Selecione</option>
                        {talhoes.map((talhao) => (
                            <option key={talhao.id} value={talhao.id}>
                                {talhao.nome}
                            </option>
                        ))}
                    </FilterSelect>
                </div>

                <div>
                    <FilterLabel>Grupo</FilterLabel>
                    <FilterSelect
                        value={selectedGrupo}
                        onChange={(e) => setSelectedGrupo(e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {grupos.map((grupo) => (
                            <option key={grupo.id} value={grupo.id}>
                                {grupo.nome}
                            </option>
                        ))}
                    </FilterSelect>
                </div>

                <div>
                    <FilterLabel>Projeto</FilterLabel>
                    <FilterSelect
                        value={selectedProjeto}
                        onChange={(e) => setSelectedProjeto(e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {projetos.map((projeto) => (
                            <option key={projeto.id} value={projeto.id}>
                                {projeto.nome}
                            </option>
                        ))}
                    </FilterSelect>
                </div>

                <div>
                    <FilterLabel>Data Início</FilterLabel>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div>
                    <FilterLabel>Data Fim</FilterLabel>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <FilterButton onClick={() => fetchAnalyses(1)}>Buscar Análises</FilterButton>
            </FilterSection>

            <ResultsContainer>
                {analyses.map((analysis) => (
                    <ResultCard key={analysis.id}>
                        <ResultImage
                            src={analysis.imagemResultadoUrl}
                            alt={`Análise ${analysis.id}`}
                            onClick={() => handleImageClick(analysis.imagemResultadoUrl)}
                        />
                        <ResultInfo>
                            <ColorLabel color="#34A853">
                                <span /> Green: {((analysis.green / analysis.total) * 100).toFixed(2)}%
                            </ColorLabel>
                            <ColorLabel color="#FFD700">
                                <span /> Green-Yellow: {((analysis.greenYellow / analysis.total) * 100).toFixed(2)}%
                            </ColorLabel>
                            <ColorLabel color="#FF6347">
                                <span /> Cherry: {((analysis.cherry / analysis.total) * 100).toFixed(2)}%
                            </ColorLabel>
                            <ColorLabel color="#8B4513">
                                <span /> Raisin: {((analysis.raisin / analysis.total) * 100).toFixed(2)}%
                            </ColorLabel>
                            <ColorLabel color="#A9A9A9">
                                <span /> Dry: {((analysis.dry / analysis.total) * 100).toFixed(2)}%
                            </ColorLabel>
                            <ColorLabel color="#FFFFFF">
                                <span /> Total: {analysis.total}
                            </ColorLabel>
                            <p>Data da Análise: {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}</p>
                            <p>Fazenda: {selectedFarmName}</p>
                            <p>Talhão: {selectedPlotName}</p>
                        </ResultInfo>
                        <Actions>
                            <input
                                type="checkbox"
                                checked={selectedImages.includes(analysis)}
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
                        </Actions>
                    </ResultCard>
                ))}

                <button onClick={openComparisonChart}>
                    <FaChartBar color="#FFF" />
                </button>
            </ResultsContainer>

            <PaginationSection>
                <PaginationButton
                    onClick={() => fetchAnalyses(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Anterior
                </PaginationButton>
                <span>
                    Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <PaginationButton
                    onClick={() => fetchAnalyses(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                >
                    Próximo
                </PaginationButton>
            </PaginationSection>

            {/* Modal de Comparação lado a lado */}
            {modalVisible && isSideBySide && (
                <Modal>
                    <CloseButton onClick={closeModal}>×</CloseButton>
                    <SideBySideContainer>
                        <SideBySideImage src={selectedOriginalImage || ''} alt="Imagem Original" />
                        <SideBySideImage src={selectedImage || ''} alt="Imagem Analisada" />
                    </SideBySideContainer>
                </Modal>
            )}

            {modalVisible && (
                <Modal>
                    <CloseButton onClick={closeModal}>×</CloseButton>
                    <ModalImage src={modalImage || ''} />
                </Modal>
            )}

            {chartVisible && (
                <ChartModal>
                    <CloseButton onClick={() => setChartVisible(false)}>×</CloseButton>
                    <ChartContainer>
                        <BarChart width={500} height={300} data={selectedImages}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nome" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="green" stackId="a" fill="#34A853" />
                            <Bar dataKey="greenYellow" stackId="a" fill="#FFD700" />
                            <Bar dataKey="cherry" stackId="a" fill="#FF6347" />
                            <Bar dataKey="raisin" stackId="a" fill="#8B4513" />
                            <Bar dataKey="dry" stackId="a" fill="#A9A9A9" />
                        </BarChart>
                    </ChartContainer>
                </ChartModal>
            )}
        </Container>
    );
};

export default ResultadosAnaliseScreen;
