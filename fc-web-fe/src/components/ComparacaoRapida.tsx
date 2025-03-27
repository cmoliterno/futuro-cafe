import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import api from "../services/api";
import imageCompression from "browser-image-compression";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
// import Chart from "chart.js/auto"; // <-- Comente/Remova se for trocar por Recharts
import { FaUpload, FaTrash, FaSpinner, FaSync, FaTimes, FaHistory, FaPlus, FaChartBar, FaSearch, FaExclamationCircle } from "react-icons/fa";
import {
    Container, Title, TabContainer, Tab, Card, CardHeader, CardBody, FormGroup,
    Label, Input, DropZoneContainer, DropZoneText, UploadGrid, UploadSection,
    SectionTitle, ImagePreview, PreviewContainer, PreviewImage, RemoveIcon,
    FileName, ButtonGroup, Button, ProgressContainer, ProgressBar, StatusCard,
    LoadingOverlay, SpinnerIcon, ModalOverlay, ModalContent, Table, Th, Td,
    EmptyState, FilterContainer, FilterInput, DateInput, DescriptionInput,
    UploadGroup, UploadTitle, FileInput, FileLabel, ActionButtons, ChartContainer
} from "./ComparacaoRapidaStyles";
import HistoricoAnaliseRapida from "./HistoricoAnaliseRapida";
import ResultadosAnaliseRapida from "./ResultadosAnaliseRapida";
import { Modal } from "@mui/material";

// Cores para os diferentes tipos de grãos
const COLORS = {
    green: "#34A853",
    greenYellow: "#FFD700",
    cherry: "#FF6347",
    raisin: "#8B4513",
    dry: "#A9A9A9"
};

const NAMES = {
    green: "Verde",
    greenYellow: "Verde Cana",
    cherry: "Cereja",
    raisin: "Passa",
    dry: "Seco"
};

const formatPercent = (value: number, total: number) => {
    if (!total) return "0%";
    return `${((value / total) * 100).toFixed(1)}%`;
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
};

const ComparacaoRapida: React.FC = () => {
    // Estado para controlar qual aba está ativa
    const [activeTab, setActiveTab] = useState<"nova" | "historico">("nova");
    
    // Estados para nova análise
    const [descricao, setDescricao] = useState("");
    const [leftImages, setLeftImages] = useState<File[]>([]);
    const [rightImages, setRightImages] = useState<File[]>([]);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonResults, setComparisonResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [analiseRapidaId, setAnaliseRapidaId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chartData, setChartData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeResultTab, setActiveResultTab] = useState<"grafico" | "tabela">("grafico");
    
    // Estados para histórico
    const [analiseHistorico, setAnaliseHistorico] = useState<any[]>([]);
    const [historicoLoading, setHistoricoLoading] = useState(false);
    const [filtroDescricao, setFiltroDescricao] = useState("");
    const [filtroDataInicio, setFiltroDataInicio] = useState("");
    const [filtroDataFim, setFiltroDataFim] = useState("");
    const [analiseHistoricoSelecionada, setAnaliseHistoricoSelecionada] = useState<string | null>(null);
    
    // Estado para controle de ordenação
    const [sortConfig, setSortConfig] = useState<{
        key: 'green' | 'greenYellow' | 'cherry' | 'raisin' | 'dry' | 'total' | 'createdAt';
        direction: 'asc' | 'desc';
    } | null>(null);

    // Dentro do componente ComparacaoRapida, adicione um novo estado:
    const [descricaoError, setDescricaoError] = useState<string | null>(null);

    // Configuração do dropzone para o lado esquerdo
    const onDropLeft = useCallback((acceptedFiles: File[]) => {
        compressAndAddFiles(acceptedFiles, "left");
    }, []);
    
    const { getRootProps: getLeftRootProps, getInputProps: getLeftInputProps, isDragActive: isLeftDragActive } = useDropzone({ 
        onDrop: onDropLeft,
        accept: { 'image/*': [] }
    });

    // Configuração do dropzone para o lado direito
    const onDropRight = useCallback((acceptedFiles: File[]) => {
        compressAndAddFiles(acceptedFiles, "right");
    }, []);
    
    const { getRootProps: getRightRootProps, getInputProps: getRightInputProps, isDragActive: isRightDragActive } = useDropzone({ 
        onDrop: onDropRight,
        accept: { 'image/*': [] }
    });

    // Função para comprimir e adicionar arquivos
    const compressAndAddFiles = async (files: File[], side: "left" | "right") => {
        setLoading(true);
        try {
            const compressedFiles: File[] = [];
            for (let file of files.slice(0, 20)) {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 800,
                    useWebWorker: true,
                });
                compressedFiles.push(compressedFile);
            }

            if (side === "left") {
                setLeftImages((prev) => [...prev, ...compressedFiles]);
            } else {
                setRightImages((prev) => [...prev, ...compressedFiles]);
            }
        } catch (error) {
            console.error("Erro no upload:", error);
            setError("Erro ao processar as imagens. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // Verificar status manualmente
    const handleCheckStatus = async () => {
        if (!analiseRapidaId) return;
        
        try {
            const response = await api.checkProcessingStatus(analiseRapidaId);
            
            if (response.data.status === "COMPLETED") {
                // Pega resultados
                const resultsResponse = await api.compareRapidAnalyses({
                    analiseRapidaId,
                });
                setComparisonResults(resultsResponse.data);
                setProcessing(false);
                setProcessingProgress(100);
            } else if (response.data.status === "PROCESSING") {
                // Atualiza o progresso para dar feedback visual
                setProcessingProgress(Math.min(80, processingProgress + 5));
            } else if (response.data.status === "ERROR") {
                setError("Ocorreu um erro no processamento. Tente novamente.");
                setProcessing(false);
            } else {
                // Ainda em processamento
                setProcessingProgress(Math.min(60, processingProgress + 5));
            }
        } catch (error) {
            console.error("Erro ao verificar o status do processamento:", error);
            setError("Erro ao verificar o status do processamento.");
        }
    };

    // Polling automático para verificar o status
    useEffect(() => {
        if (processing && analiseRapidaId) {
            // Inicia com 10% de progresso para feedback visual
            setProcessingProgress(10);
            
            const interval = setInterval(async () => {
                try {
                    const response = await api.checkProcessingStatus(analiseRapidaId);
                    
                    if (response.data.status === "COMPLETED") {
                        // Atualizamos para 100% para indicar conclusão
                        setProcessingProgress(100);
                        
                        // Buscamos os resultados da comparação
                        const resultsResponse = await api.compareRapidAnalyses({
                            analiseRapidaId,
                        });
                        
                        // Atualizamos os resultados
                        setComparisonResults(resultsResponse.data);
                        setProcessing(false);
                        
                        // Abrimos automaticamente o modal com os resultados
                        setIsModalOpen(true);
                        
                        // Limpamos o intervalo
                        clearInterval(interval);
                    } else if (response.data.status === "ERROR") {
                        setError("Ocorreu um erro no processamento. Tente novamente.");
                        setProcessing(false);
                        clearInterval(interval);
                    } else {
                        // Aumenta o progresso gradualmente para feedback visual
                        setProcessingProgress(prev => {
                            // Progressão mais lenta no início e mais rápida no final
                            if (prev < 30) return prev + 3;
                            if (prev < 60) return prev + 2;
                            return Math.min(90, prev + 1);
                        });
                    }
                } catch (error) {
                    console.error("Erro ao verificar o status do processamento:", error);
                    // Não interrompe o polling em caso de erro temporário
                }
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [processing, analiseRapidaId]);

    // Função para formatar os dados do gráfico
    const formatChartData = (data: any) => {
        if (!data || !data.grupo) return [];

        const { estatisticasEsquerdo, estatisticasDireito } = data.grupo;
        
        // Calculando totais
        const totalEsquerdo = 
            Number(estatisticasEsquerdo.green || 0) +
            Number(estatisticasEsquerdo.greenYellow || 0) +
            Number(estatisticasEsquerdo.cherry || 0) +
            Number(estatisticasEsquerdo.raisin || 0) +
            Number(estatisticasEsquerdo.dry || 0);
            
        const totalDireito = 
            Number(estatisticasDireito.green || 0) +
            Number(estatisticasDireito.greenYellow || 0) +
            Number(estatisticasDireito.cherry || 0) +
            Number(estatisticasDireito.raisin || 0) +
            Number(estatisticasDireito.dry || 0);

        // Criando objetos com os valores e os percentuais
        return [
            {
                nome: "Esquerdo",
                total: totalEsquerdo,
                green: Number(estatisticasEsquerdo.green || 0),
                greenYellow: Number(estatisticasEsquerdo.greenYellow || 0),
                cherry: Number(estatisticasEsquerdo.cherry || 0),
                raisin: Number(estatisticasEsquerdo.raisin || 0),
                dry: Number(estatisticasEsquerdo.dry || 0),
                
                // Percentuais para exibição
                greenPercent: ((Number(estatisticasEsquerdo.green || 0) / totalEsquerdo) * 100).toFixed(1),
                greenYellowPercent: ((Number(estatisticasEsquerdo.greenYellow || 0) / totalEsquerdo) * 100).toFixed(1),
                cherryPercent: ((Number(estatisticasEsquerdo.cherry || 0) / totalEsquerdo) * 100).toFixed(1),
                raisinPercent: ((Number(estatisticasEsquerdo.raisin || 0) / totalEsquerdo) * 100).toFixed(1),
                dryPercent: ((Number(estatisticasEsquerdo.dry || 0) / totalEsquerdo) * 100).toFixed(1),
            },
            {
                nome: "Direito",
                total: totalDireito,
                green: Number(estatisticasDireito.green || 0),
                greenYellow: Number(estatisticasDireito.greenYellow || 0),
                cherry: Number(estatisticasDireito.cherry || 0),
                raisin: Number(estatisticasDireito.raisin || 0),
                dry: Number(estatisticasDireito.dry || 0),
                
                // Percentuais para exibição
                greenPercent: ((Number(estatisticasDireito.green || 0) / totalDireito) * 100).toFixed(1),
                greenYellowPercent: ((Number(estatisticasDireito.greenYellow || 0) / totalDireito) * 100).toFixed(1),
                cherryPercent: ((Number(estatisticasDireito.cherry || 0) / totalDireito) * 100).toFixed(1),
                raisinPercent: ((Number(estatisticasDireito.raisin || 0) / totalDireito) * 100).toFixed(1),
                dryPercent: ((Number(estatisticasDireito.dry || 0) / totalDireito) * 100).toFixed(1),
            },
        ];
    };

    // Atualiza os dados do gráfico quando os resultados da comparação mudam
    useEffect(() => {
        if (comparisonResults) {
            const formattedData = formatChartData(comparisonResults);
            console.log("Dados formatados para o gráfico:", formattedData);
            setChartData(formattedData);
        }
    }, [comparisonResults]);

    // Função para carregar o histórico de análises
    const carregarHistorico = async () => {
        setHistoricoLoading(true);
        setError(null);
        
        try {
            // Montar parâmetros de filtro
            const filtros: any = {};
            if (filtroDescricao) filtros.descricao = filtroDescricao;
            if (filtroDataInicio) filtros.dataInicio = filtroDataInicio;
            if (filtroDataFim) filtros.dataFim = filtroDataFim;
            
            // Supondo que exista um endpoint para buscar as análises rápidas
            const response = await api.getAnaliseRapidaHistorico(filtros);
            setAnaliseHistorico(response.data);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            setError("Não foi possível carregar o histórico de análises.");
        } finally {
            setHistoricoLoading(false);
        }
    };

    // Carregar histórico ao mudar para a tab de histórico
    useEffect(() => {
        if (activeTab === "historico") {
            carregarHistorico();
        }
    }, [activeTab]);

    // Função para visualizar uma análise do histórico
    const handleViewAnalysis = async (analiseId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log(`Buscando análise ${analiseId} para visualização`);
            
            // Verificamos primeiro se a análise está completa
            const statusResponse = await api.checkProcessingStatus(analiseId);
            console.log("Status da análise:", statusResponse.data);
            
            if (statusResponse.data.status !== "COMPLETED") {
                throw new Error(`A análise não está pronta ainda. Status atual: ${statusResponse.data.status}`);
            }
            
            // Buscamos os resultados da análise usando o novo endpoint GET
            const resultadosResponse = await api.getAnaliseRapidaResultados(analiseId);
            
            console.log("Resultados da análise:", resultadosResponse.data);
            
            // Atualiza os resultados e abre o modal
            setComparisonResults(resultadosResponse.data);
            setAnaliseRapidaId(analiseId);
            
            // Formata os dados para o gráfico
            if (resultadosResponse.data && resultadosResponse.data.grupo) {
                const formattedData = formatChartData(resultadosResponse.data);
                setChartData(formattedData);
                
                // Abre o modal com os resultados
                setIsModalOpen(true);
            } else {
                throw new Error("Formato de dados inválido. A resposta não contém as informações necessárias.");
            }
        } catch (error: any) {
            console.error("Erro ao buscar detalhes da análise:", error);
            
            // Mensagem de erro mais informativa
            const statusCode = error.response?.status;
            let errorMessage = error.response?.data?.error || error.message || "Erro desconhecido";
            
            // Se for um erro 404 (não encontrado) e não tiver mensagem específica
            if (statusCode === 404 && !error.response?.data?.error) {
                errorMessage = "Dados da análise não encontrados. A análise pode ter sido excluída ou não ter sido processada corretamente.";
            }
            
            setError(`Não foi possível carregar a análise. ${errorMessage}`);
            
            // Se a análise estava com status COMPLETED mas não tem dados, atualizamos o status
            if (statusCode === 404) {
                try {
                    await api.checkProcessingStatus(analiseId);
                } catch (innerError) {
                    console.error("Erro ao tentar atualizar status da análise:", innerError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // Handler para upload de arquivos
    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        side: "left" | "right"
    ) => {
        if (processing || comparisonResults) return;
        if (!event.target.files) return;

        const files = Array.from(event.target.files);
        compressAndAddFiles(files, side);
    };

    // Handler para limpar imagens
    const handleClear = (side: "left" | "right") => {
        if (side === "left") {
            setLeftImages([]);
        } else {
            setRightImages([]);
        }
    };

    // Handler para remover uma imagem específica
    const handleRemoveSingle = (side: "left" | "right", index: number) => {
        if (side === "left") {
            setLeftImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            setRightImages((prev) => prev.filter((_, i) => i !== index));
        }
    };

    // Handler para criar uma nova análise
    const handleCreateAnalysis = async () => {
        // Reset errors
        setError(null);
        setDescricaoError(null);
        
        if (!descricao || descricao.trim() === "") {
            setDescricaoError("A descrição da análise é obrigatória");
            return;
        }
        
        if (leftImages.length === 0) {
            setError("Por favor, selecione pelo menos uma imagem para o lado esquerdo.");
            return;
        }
        
        if (rightImages.length === 0) {
            setError("Por favor, selecione pelo menos uma imagem para o lado direito.");
            return;
        }

        setIsComparing(true);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("descricao", descricao);
            leftImages.forEach((file) => formData.append("imagensEsquerdo", file));
            rightImages.forEach((file) => formData.append("imagensDireito", file));

            const response = await api.createRapidAnalysisGroup(formData);
            setAnaliseRapidaId(response.data.analiseRapidaId);
            setProcessing(true);
            
            // Iniciamos com 10% para dar feedback visual imediato
            setProcessingProgress(10);
            
            // Exibimos uma mensagem de processamento iniciado
            setError(null);
        } catch (error) {
            console.error("Erro na criação da análise:", error);
            setError("Ocorreu um erro ao enviar as imagens para análise. Tente novamente.");
        } finally {
            setIsComparing(false);
            setLoading(false);
        }
    };

    // Handler para iniciar nova comparação
    const handleNewComparison = () => {
        setDescricao("");
        setLeftImages([]);
        setRightImages([]);
        setComparisonResults(null);
        setAnaliseRapidaId(null);
        setProcessing(false);
        setProcessingProgress(0);
        setChartData([]);
        setError(null);
    };

    // Handler para ordenação de dados no gráfico/tabela
    const handleSort = (key: 'green' | 'greenYellow' | 'cherry' | 'raisin' | 'dry' | 'total' | 'createdAt') => {
        // Define a direção da ordenação
        let direction: 'asc' | 'desc' = 'desc';
        
        // Se já estava ordenando pela mesma chave, inverte a direção
        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        }
        
        setSortConfig({ key, direction });
        
        // Aplica a ordenação aos dados
        const sortedAnalyses = [...chartData].sort((a, b) => {
            // Se for ordenação por data, trata diferentemente
            if (key === 'createdAt') {
                return direction === 'asc' 
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            
            // Para outros campos, ordena por valor percentual
            const aValue = (a[key] / a.total) * 100;
            const bValue = (b[key] / b.total) * 100;
            
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
        });
        
        setChartData(sortedAnalyses);
    };
    
    // Função auxiliar para aplicar filtros no histórico
    const aplicarFiltros = () => {
        carregarHistorico();
    };

    return (
        <Container>
            <Title>Comparação Rápida</Title>

            <TabContainer>
                <Tab 
                    active={activeTab === "nova"} 
                    onClick={() => setActiveTab("nova")}
                >
                    Nova Análise
                </Tab>
                <Tab 
                    active={activeTab === "historico"} 
                    onClick={() => setActiveTab("historico")}
                >
                    Histórico
                </Tab>
            </TabContainer>

            {activeTab === "nova" ? (
                <>
                    <DescriptionInput
                        type="text"
                        placeholder="Descrição da Análise"
                        value={descricao}
                        onChange={(e) => {
                            setDescricao(e.target.value);
                            if (descricaoError) setDescricaoError(null);
                        }}
                        disabled={processing || !!comparisonResults}
                        style={descricaoError ? { borderColor: '#D32F2F', boxShadow: '0 0 0 1px #D32F2F' } : {}}
                    />
                    {descricaoError && (
                        <div style={{ 
                            color: '#D32F2F', 
                            fontSize: '0.85rem', 
                            marginTop: '-0.5rem', 
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FaExclamationCircle />
                            {descricaoError}
                        </div>
                    )}

                    <LoadingOverlay isVisible={loading}>
                        <SpinnerIcon />
                    </LoadingOverlay>

                    <UploadSection style={{ maxWidth: '1100px', margin: '30px auto' }}>
                        {/* LADO ESQUERDO */}
                        <UploadGroup>
                            <UploadTitle>Lado Esquerdo</UploadTitle>

                            <DropZoneContainer
                                {...getLeftRootProps()}
                                isDragActive={isLeftDragActive}
                                isDisabled={processing || !!comparisonResults}
                            >
                                <input {...getLeftInputProps()} />
                                <DropZoneText>
                                    {isLeftDragActive
                                        ? "Solte as imagens aqui..."
                                        : "Arraste e solte as imagens aqui ou clique para selecionar"}
                                </DropZoneText>
                            </DropZoneContainer>

                            <FileInput
                                id="left-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleUpload(e, "left")}
                                disabled={processing || !!comparisonResults}
                            />
                            <FileLabel
                                htmlFor="left-upload"
                                disabled={processing || !!comparisonResults}
                            >
                                <FaUpload />
                                Upload
                            </FileLabel>

                            <ImagePreview>
                                {leftImages.map((file, idx) => (
                                    <PreviewContainer key={idx}>
                                        <PreviewImage
                                            src={URL.createObjectURL(file)}
                                            alt={`Esquerdo ${idx}`}
                                        />
                                        {!processing && !comparisonResults && (
                                            <RemoveIcon onClick={() => handleRemoveSingle("left", idx)} />
                                        )}
                                        <FileName>{file.name}</FileName>
                                    </PreviewContainer>
                                ))}
                            </ImagePreview>
                            <ActionButtons>
                                <Button
                                    className="delete"
                                    onClick={() => handleClear("left")}
                                    disabled={processing || !!comparisonResults}
                                >
                                    <FaTrash />
                                    Limpar
                                </Button>
                            </ActionButtons>
                        </UploadGroup>

                        {/* LADO DIREITO */}
                        <UploadGroup>
                            <UploadTitle>Lado Direito</UploadTitle>

                            <DropZoneContainer
                                {...getRightRootProps()}
                                isDragActive={isRightDragActive}
                                isDisabled={processing || !!comparisonResults}
                            >
                                <input {...getRightInputProps()} />
                                <DropZoneText>
                                    {isRightDragActive
                                        ? "Solte as imagens aqui..."
                                        : "Arraste e solte as imagens aqui ou clique para selecionar"}
                                </DropZoneText>
                            </DropZoneContainer>

                            <FileInput
                                id="right-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleUpload(e, "right")}
                                disabled={processing || !!comparisonResults}
                            />
                            <FileLabel
                                htmlFor="right-upload"
                                disabled={processing || !!comparisonResults}
                            >
                                <FaUpload />
                                Upload
                            </FileLabel>

                            <ImagePreview>
                                {rightImages.map((file, idx) => (
                                    <PreviewContainer key={idx}>
                                        <PreviewImage
                                            src={URL.createObjectURL(file)}
                                            alt={`Direito ${idx}`}
                                        />
                                        {!processing && !comparisonResults && (
                                            <RemoveIcon onClick={() => handleRemoveSingle("right", idx)} />
                                        )}
                                        <FileName>{file.name}</FileName>
                                    </PreviewContainer>
                                ))}
                            </ImagePreview>
                            <ActionButtons>
                                <Button
                                    className="delete"
                                    onClick={() => handleClear("right")}
                                    disabled={processing || !!comparisonResults}
                                >
                                    <FaTrash />
                                    Limpar
                                </Button>
                            </ActionButtons>
                        </UploadGroup>
                    </UploadSection>

                    {processing && (
                        <Card style={{ marginTop: '1.5rem' }}>
                            <CardHeader>Processando análise</CardHeader>
                            <CardBody>
                                <UploadTitle>
                                    Estamos processando suas imagens. Assim que finalizar, você poderá
                                    visualizar a comparação.
                                </UploadTitle>
                                
                                <ProgressContainer>
                                    <ProgressBar progress={processingProgress} />
                                </ProgressContainer>
                                
                                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                                    {processingProgress < 30 && "Iniciando análise..."}
                                    {processingProgress >= 30 && processingProgress < 60 && "Processando imagens..."}
                                    {processingProgress >= 60 && processingProgress < 90 && "Analisando contagem de grãos..."}
                                    {processingProgress >= 90 && "Quase concluído..."}
                                </div>
                                
                                <StatusCard style={{ marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                                        <span>O processamento pode levar alguns minutos. Você receberá uma notificação quando estiver concluído.</span>
                                    </div>
                                </StatusCard>
                                
                                <ActionButtons style={{ marginTop: '1rem' }}>
                                    <Button onClick={handleCheckStatus}>
                                        <FaSync style={{ marginRight: "5px" }} />
                                        Atualizar Status
                                    </Button>
                                </ActionButtons>
                            </CardBody>
                        </Card>
                    )}

                    <ActionButtons>
                        {!comparisonResults && !processing && (
                            <Button
                                className="compare"
                                onClick={handleCreateAnalysis}
                                disabled={isComparing}
                            >
                                {isComparing ? "Enviando..." : "Enviar para análise"}
                            </Button>
                        )}

                        {processing && (
                            <Button onClick={handleCheckStatus}>
                                <FaSync style={{ marginRight: "5px" }} />
                                Atualizar Status
                            </Button>
                        )}

                        {(comparisonResults || processing) && (
                            <Button className="new-comparison" onClick={handleNewComparison}>
                                Nova Comparação
                            </Button>
                        )}
                    </ActionButtons>

                    {/* Quando já houver resultados, exibir botão para abrir o Modal */}
                    {comparisonResults && (
                        <ActionButtons>
                            <Button className="view-comparison" onClick={() => setIsModalOpen(true)}>
                                Visualizar Comparação
                            </Button>
                        </ActionButtons>
                    )}
                </>
            ) : (
                /* Aba de histórico */
                <HistoricoAnaliseRapida 
                    onViewAnalysis={handleViewAnalysis} 
                />
            )}

            {/* --- MODAL RECHARTS --- */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-comparacao"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ 
                    background: '#fff', 
                    borderRadius: '8px', 
                    padding: '20px', 
                    maxWidth: '800px', 
                    maxHeight: '80vh', 
                    overflow: 'auto',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Comparação de Dados</h2>
                        <FaTimes 
                            onClick={() => setIsModalOpen(false)} 
                            style={{ cursor: 'pointer', fontSize: '20px' }} 
                        />
                    </div>
                    <ChartContainer>
                        <BarChart 
                            width={730} 
                            height={400} 
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="nome" 
                                tick={{ fontSize: 14, fontWeight: 'bold' }}
                            />
                            <YAxis />
                            <Tooltip 
                                formatter={(value, name, props) => {
                                    if (name === 'total') return [value, 'Total'];
                                    const percentKey = `${name}Percent`;
                                    const percent = props.payload[percentKey];
                                    return [`${value} (${percent}%)`, NAMES[name as keyof typeof NAMES]];
                                }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '10px'
                                }}
                            />
                            <Legend 
                                verticalAlign="top" 
                                formatter={(value) => NAMES[value as keyof typeof NAMES]} 
                            />
                            <Bar 
                                dataKey="green" 
                                name="green" 
                                fill={COLORS.green} 
                                stackId="a"
                            >
                                <LabelList 
                                    dataKey="greenPercent" 
                                    position="inside" 
                                    fill="#fff" 
                                    formatter={(value: any) => `${value}%`} 
                                    style={{ fontWeight: 'bold', textShadow: '0 0 3px rgba(0,0,0,0.5)' }}
                                />
                            </Bar>
                            <Bar 
                                dataKey="greenYellow" 
                                name="greenYellow" 
                                fill={COLORS.greenYellow} 
                                stackId="a"
                            >
                                <LabelList 
                                    dataKey="greenYellowPercent" 
                                    position="inside" 
                                    fill="#000"
                                    formatter={(value: any) => `${value}%`} 
                                    style={{ fontWeight: 'bold', textShadow: '0 0 3px rgba(255,255,255,0.5)' }}
                                />
                            </Bar>
                            <Bar 
                                dataKey="cherry" 
                                name="cherry" 
                                fill={COLORS.cherry} 
                                stackId="a"
                            >
                                <LabelList 
                                    dataKey="cherryPercent" 
                                    position="inside" 
                                    fill="#fff"
                                    formatter={(value: any) => `${value}%`} 
                                    style={{ fontWeight: 'bold', textShadow: '0 0 3px rgba(0,0,0,0.5)' }}
                                />
                            </Bar>
                            <Bar 
                                dataKey="raisin" 
                                name="raisin" 
                                fill={COLORS.raisin} 
                                stackId="a"
                            >
                                <LabelList 
                                    dataKey="raisinPercent" 
                                    position="inside" 
                                    fill="#fff"
                                    formatter={(value: any) => `${value}%`} 
                                    style={{ fontWeight: 'bold', textShadow: '0 0 3px rgba(0,0,0,0.5)' }}
                                />
                            </Bar>
                            <Bar 
                                dataKey="dry" 
                                name="dry" 
                                fill={COLORS.dry} 
                                stackId="a"
                            >
                                <LabelList 
                                    dataKey="dryPercent" 
                                    position="inside" 
                                    fill="#000"
                                    formatter={(value: any) => `${value}%`} 
                                    style={{ fontWeight: 'bold', textShadow: '0 0 3px rgba(255,255,255,0.5)' }}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                    
                    {/* Informações detalhadas abaixo do gráfico */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                        {chartData.map((item, index) => (
                            <div key={index} style={{ flex: 1, padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', margin: '0 5px' }}>
                                <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{item.nome}</h3>
                                <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Total: {item.total}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <p style={{ margin: '3px 0', color: COLORS.green }}>
                                        <strong>{NAMES.green}:</strong> {item.green} ({item.greenPercent}%)
                                    </p>
                                    <p style={{ margin: '3px 0', color: COLORS.greenYellow }}>
                                        <strong>{NAMES.greenYellow}:</strong> {item.greenYellow} ({item.greenYellowPercent}%)
                                    </p>
                                    <p style={{ margin: '3px 0', color: COLORS.cherry }}>
                                        <strong>{NAMES.cherry}:</strong> {item.cherry} ({item.cherryPercent}%)
                                    </p>
                                    <p style={{ margin: '3px 0', color: COLORS.raisin }}>
                                        <strong>{NAMES.raisin}:</strong> {item.raisin} ({item.raisinPercent}%)
                                    </p>
                                    <p style={{ margin: '3px 0', color: COLORS.dry }}>
                                        <strong>{NAMES.dry}:</strong> {item.dry} ({item.dryPercent}%)
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </Container>
    );
};

export default ComparacaoRapida;
