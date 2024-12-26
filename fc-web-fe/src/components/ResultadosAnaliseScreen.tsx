import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaDownload, FaRedo, FaImage, FaCheck, FaExpand, FaChartBar, FaColumns } from 'react-icons/fa';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList} from 'recharts';

const Container = styled.div`
  padding: 20px;
  background-color: #3E2723;
`;

const Title = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 26px;
  font-weight: bold;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #42210b;
  padding: 20px;
  border-radius: 10px;
`;

const FilterLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #f5f5f5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;

const FiltersWrapper = styled.div`
  background-color: #4E342E;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const FilterSelect = styled.select`
  width: 220px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #ffffff;
`;

const FilterButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;
  border: none;

  &:hover {
    background-color: #218838;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Ajuste dinâmico */
  max-width: 1200px; /* Limita a largura do grid */
  gap: 30px;
  justify-content: center;
  padding: 20px;
  margin: 0 auto; /* Centraliza horizontalmente */
`;

const ResultCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  text-align: center;
  color: #333;
  border: 1px solid #ddd;

  &:hover {
    transform: scale(1.03); /* Efeito de hover */
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
  top: 20px;
  right: 20px;
  background: #363333;
  color: #ffffff;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1020; /* Garante que o botão fique acima de tudo */

  &:hover {
    color: #463636; /* Cor ao passar o mouse */
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
    const [loading, setLoading] = useState(false);


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
        if (page < 1 || page > pagination.totalPages) {
            return; // Evita buscar páginas inválidas
        }

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
            };
            const { data } = await api.getFilteredAnalyses(params);

            setAnalyses(data.result || []);
            setSelectedFarmName(
                fazendas.find((f) => f.id === selectedFazenda)?.nome || "Fazenda não selecionada"
            );
            setSelectedPlotName(
                talhoes.find((t) => t.id === selectedTalhao)?.nome || "Talhão não selecionado"
            );
            setPagination({
                currentPage: data.page,
                totalPages: data.pages, // O total de páginas vem no campo "pages"
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

    return (
        <Container>
            <Title>Resultados da Análise</Title>

            {/* Filtros */}
            <FiltersWrapper>
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
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <FilterLabel>Data Fim</FilterLabel>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <FilterButton onClick={() => fetchAnalyses(1)}>Buscar Análises</FilterButton>
                        <FilterButton
                            style={{ backgroundColor: '#dc3545' }}
                            onClick={() => {
                                setSelectedFazenda('');
                                setSelectedTalhao('');
                                setSelectedGrupo('');
                                setSelectedProjeto('');
                                setStartDate('');
                                setEndDate('');
                                setAnalyses([]);
                                setPagination({ currentPage: 1, totalPages: 1 });
                            }}
                        >
                            Limpar Filtros
                        </FilterButton>
                    </div>
                </FilterSection>
            </FiltersWrapper>

            {/* Carregando */}
            {loading && <Loading>Carregando, por favor, aguarde...</Loading>}

            {/* Resultados */}
            <ResultsContainer>
                {analyses
                    .slice((pagination.currentPage - 1) * 6, pagination.currentPage * 6)
                    .map((analysis) => (
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
            </ResultsContainer>

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
                            width={800} // Aumenta a largura do gráfico
                            height={500} // Aumenta a altura do gráfico
                            data={selectedImages.map((image) => ({
                                ...image,
                                nome: image.name, // Nome atribuído (A, B, C...)
                                greenPercent: ((image.green / image.total) * 100).toFixed(2),
                                greenYellowPercent: ((image.greenYellow / image.total) * 100).toFixed(2),
                                cherryPercent: ((image.cherry / image.total) * 100).toFixed(2),
                                raisinPercent: ((image.raisin / image.total) * 100).toFixed(2),
                                dryPercent: ((image.dry / image.total) * 100).toFixed(2),
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 30 }} // Ajusta as margens do gráfico
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nome" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="green" stackId="a" fill="#34A853">
                                <LabelList
                                    dataKey="greenPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }} // Percentuais em preto
                                />
                            </Bar>
                            <Bar dataKey="greenYellow" stackId="a" fill="#FFD700">
                                <LabelList
                                    dataKey="greenYellowPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="cherry" stackId="a" fill="#FF6347">
                                <LabelList
                                    dataKey="cherryPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="raisin" stackId="a" fill="#8B4513">
                                <LabelList
                                    dataKey="raisinPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                            <Bar dataKey="dry" stackId="a" fill="#A9A9A9">
                                <LabelList
                                    dataKey="dryPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </ChartModal>
            )}
        </Container>
    );
};

export default ResultadosAnaliseScreen;
