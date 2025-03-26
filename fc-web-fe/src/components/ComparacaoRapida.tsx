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
} from "recharts";
// import Chart from "chart.js/auto"; // <-- Comente/Remova se for trocar por Recharts
import { FaUpload, FaTrash, FaSpinner, FaSync, FaTimes } from "react-icons/fa";

// Styled Components (iguais aos anteriores)
const Container = styled.div`
  padding: 20px;
  background-color: #3e2723;
  color: #fff;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const DescriptionInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const UploadSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
`;

const UploadGroup = styled.div`
  flex: 1;
  background-color: #4e342e;
  padding: 20px;
  border-radius: 10px;
`;

const UploadTitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  color: #fff;
`;

const DropZoneContainer = styled.div<{
    isDragActive: boolean;
    isDisabled?: boolean;
}>`
  border: 2px dashed #fff;
  border-color: ${({ isDragActive }) => (isDragActive ? "#28a745" : "#fff")};
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${({ isDisabled }) =>
          isDisabled &&
          `
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const DropZoneText = styled.p`
  margin: 10px 0;
  color: #ccc;
  font-size: 14px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) => (props.disabled ? "#6c757d" : "#28a745")};
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-top: 15px;
  font-size: 14px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#6c757d" : "#218838")};
  }

  svg {
    margin-right: 5px;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const PreviewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid #fff;

  &:hover {
    opacity: 0.8;
  }
`;

const RemoveIcon = styled(FaTimes)`
  position: absolute;
  top: -5px;
  right: -5px;
  color: #dc3545;
  background-color: #fff;
  border-radius: 50%;
  padding: 2px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const FileName = styled.span`
  font-size: 12px;
  color: #ccc;
  margin-top: 5px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }

  &.compare {
    background-color: #28a745;

    &:hover {
      background-color: #218838;
    }
  }

  &.new-comparison {
    background-color: #ffc107;

    &:hover {
      background-color: #e0a800;
    }
  }

  &.view-comparison {
    background-color: #17a2b8;

    &:hover {
      background-color: #138496;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingOverlay = styled.div<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const SpinnerIcon = styled(FaSpinner)`
  color: #fff;
  font-size: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ModalOverlay = styled.div<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  max-width: 1000px; /* Ajuste se quiser */
  text-align: center;
  max-height: 90%;
  overflow-y: auto;
`;

const ChartContainer = styled.div`
  margin-top: 30px;
`;

// Função para formatar percentual
const formatPercent = (value: number, total: number) => {
    if (!total || total === 0) return "0%";
    return `${((value / total) * 100).toFixed(2)}%`;
};

const ComparacaoRapida: React.FC = () => {
    const [descricao, setDescricao] = useState("");
    const [leftImages, setLeftImages] = useState<File[]>([]);
    const [rightImages, setRightImages] = useState<File[]>([]);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonResults, setComparisonResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [analiseRapidaId, setAnaliseRapidaId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ---- (1) Vamos criar um state para armazenar os dados formatados do gráfico Recharts
    const [chartData, setChartData] = useState<any[]>([]);

    const [sortConfig, setSortConfig] = useState<{
        key: 'green' | 'greenYellow' | 'cherry' | 'raisin' | 'dry' | 'total' | 'createdAt';
        direction: 'asc' | 'desc';
    } | null>(null);

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
        } finally {
            setLoading(false);
        }
    };

    // Dropzone LADO ESQUERDO
    const onDropLeft = useCallback(
        (acceptedFiles: File[]) => {
            if (processing || comparisonResults) return;
            compressAndAddFiles(acceptedFiles, "left");
        },
        [processing, comparisonResults]
    );
    const {
        getRootProps: getLeftRootProps,
        getInputProps: getLeftInputProps,
        isDragActive: isLeftDragActive,
    } = useDropzone({
        onDrop: onDropLeft,
        accept: { "image/*": [] },
        maxFiles: 20,
        disabled: processing || !!comparisonResults,
    });

    // Dropzone LADO DIREITO
    const onDropRight = useCallback(
        (acceptedFiles: File[]) => {
            if (processing || comparisonResults) return;
            compressAndAddFiles(acceptedFiles, "right");
        },
        [processing, comparisonResults]
    );
    const {
        getRootProps: getRightRootProps,
        getInputProps: getRightInputProps,
        isDragActive: isRightDragActive,
    } = useDropzone({
        onDrop: onDropRight,
        accept: { "image/*": [] },
        maxFiles: 20,
        disabled: processing || !!comparisonResults,
    });

    // Verificar status manualmente
    const handleCheckStatus = async () => {
        if (!analiseRapidaId) return;
        console.log("Verificando status no backend...");
        try {
            const response = await api.checkProcessingStatus(analiseRapidaId);
            console.log("Resposta do checkProcessingStatus:", response.data);

            if (response.data.status === "COMPLETED") {
                // Pega resultados
                const resultsResponse = await api.compareRapidAnalyses({
                    analiseRapidaId,
                });
                console.log("Resultado final da análise:", resultsResponse.data);
                setComparisonResults(resultsResponse.data);
                setProcessing(false);
            } else {
                alert("Ainda processando... Tente novamente em alguns segundos!");
            }
        } catch (error) {
            console.error("Erro ao verificar o status do processamento:", error);
        }
    };

    // Polling automático
    useEffect(() => {
        if (processing && analiseRapidaId) {
            const interval = setInterval(async () => {
                try {
                    const response = await api.checkProcessingStatus(analiseRapidaId);
                    if (response.data.status === "COMPLETED") {
                        const resultsResponse = await api.compareRapidAnalyses({
                            analiseRapidaId,
                        });
                        setComparisonResults(resultsResponse.data);
                        setProcessing(false);
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error("Erro ao verificar o status do processamento:", error);
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [processing, analiseRapidaId]);

    // ----------------------------------
    // (2) Assim que tiver "comparisonResults", montamos o "chartData" para Recharts
    // ----------------------------------
    useEffect(() => {
        if (comparisonResults) {
            // Supondo que comparisonResults tenha algo como:
            //  comparisonResults.grupo.estatisticasEsquerdo.{ green, greenYellow, ... }
            //  comparisonResults.grupo.estatisticasDireito.{ green, greenYellow, ... }
            // Precisamos montar 2 objetos: um para o "Esquerdo", outro para o "Direito".
            const leftStats = comparisonResults.grupo.estatisticasEsquerdo;
            const rightStats = comparisonResults.grupo.estatisticasDireito;

            // Vamos pegar o total de cada lado (some de todos)
            const totalLeft =
                leftStats.green +
                leftStats.greenYellow +
                leftStats.cherry +
                leftStats.raisin +
                leftStats.dry;
            const totalRight =
                rightStats.green +
                rightStats.greenYellow +
                rightStats.cherry +
                rightStats.raisin +
                rightStats.dry;

            // Monta array para Recharts
            const dataForChart = [
                {
                    nome: "Esquerdo",
                    green: leftStats.green,
                    greenYellow: leftStats.greenYellow,
                    cherry: leftStats.cherry,
                    raisin: leftStats.raisin,
                    dry: leftStats.dry,
                    total: totalLeft,
                },
                {
                    nome: "Direito",
                    green: rightStats.green,
                    greenYellow: rightStats.greenYellow,
                    cherry: rightStats.cherry,
                    raisin: rightStats.raisin,
                    dry: rightStats.dry,
                    total: totalRight,
                },
            ];
            setChartData(dataForChart);
        }
    }, [comparisonResults]);

    // (Opcional) Se antes usávamos Chart.js, poderíamos comentar:
    // useEffect(() => {
    //   if (comparisonResults) {
    //     renderChart(comparisonResults);
    //   }
    // }, [comparisonResults]);

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        side: "left" | "right"
    ) => {
        if (processing || comparisonResults) return;
        if (!event.target.files) return;

        const files = Array.from(event.target.files);
        compressAndAddFiles(files, side);
    };

    const handleClear = (side: "left" | "right") => {
        if (side === "left") {
            setLeftImages([]);
        } else {
            setRightImages([]);
        }
    };

    const handleRemoveSingle = (side: "left" | "right", index: number) => {
        if (side === "left") {
            setLeftImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            setRightImages((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleCreateAnalysis = async () => {
        if (!descricao || leftImages.length === 0 || rightImages.length === 0) {
            alert("Preencha a descrição e selecione as imagens.");
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
            console.log("Análise criada:", response.data);
            setAnaliseRapidaId(response.data.analiseRapidaId);
            setProcessing(true);
        } catch (error) {
            console.error("Erro na comparação:", error);
        } finally {
            setIsComparing(false);
            setLoading(false);
        }
    };

    const handleNewComparison = () => {
        setDescricao("");
        setLeftImages([]);
        setRightImages([]);
        setComparisonResults(null);
        setAnaliseRapidaId(null);
        setProcessing(false);
        setChartData([]);
    };

    const handleSort = (key: 'green' | 'greenYellow' | 'cherry' | 'raisin' | 'dry' | 'total' | 'createdAt') => {
        const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        const sortedAnalyses = [...chartData].sort((a, b) => {
            if (key === 'createdAt') {
                return direction === 'asc' 
                    ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
                    : new Date(b[key]).getTime() - new Date(a[key]).getTime();
            }
            
            // Para percentuais
            const aValue = (a[key] / a.total) * 100;
            const bValue = (b[key] / b.total) * 100;
            
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
        });

        setChartData(sortedAnalyses);
    };

    return (
        <Container>
            <Title>Comparação Rápida</Title>

            <DescriptionInput
                type="text"
                placeholder="Descrição da Análise"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={processing || !!comparisonResults}
            />

            <LoadingOverlay isVisible={loading}>
                <SpinnerIcon />
            </LoadingOverlay>

            <UploadSection>
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
                <UploadTitle>
                    Estamos processando suas imagens. Assim que finalizar, você poderá
                    visualizar a comparação.
                </UploadTitle>
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

            {/* --- MODAL RECHARTS --- */}
            <ModalOverlay isVisible={isModalOpen}>
                <ModalContent>
                    <Button
                        style={{
                            position: "absolute",
                            top: 15,
                            right: 15,
                            backgroundColor: "#dc3545",
                            borderRadius: "50%",
                            fontSize: 14,
                            padding: "8px 10px",
                        }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <FaTimes />
                    </Button>

                    <h2>Comparação de Dados (Recharts)</h2>
                    <ChartContainer>
                        {/* Exemplo de BarChart com as duas entradas (Esquerdo e Direito) */}
                        <BarChart
                            width={800}
                            height={400}
                            data={chartData}
                            style={{ margin: "0 auto" }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nome" />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            {/* Para cada tipo de grão, criamos uma <Bar> */}
                            <Bar dataKey="green" fill="#34A853" name="Verde">
                                <LabelList
                                    dataKey="greenPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>

                            <Bar dataKey="greenYellow" fill="#FFD700" name="Verde Cana">
                                <LabelList
                                    dataKey="greenYellowPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>

                            <Bar dataKey="cherry" fill="#FF6347" name="Cereja">
                                <LabelList
                                    dataKey="cherryPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>

                            <Bar dataKey="raisin" fill="#8B4513" name="Passa">
                                <LabelList
                                    dataKey="raisinPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>

                            <Bar dataKey="dry" fill="#A9A9A9" name="Seco">
                                <LabelList
                                    dataKey="dryPercent"
                                    position="inside"
                                    formatter={(value: string | number) => `${value}%`}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: 'black' }}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
                        <Button onClick={() => handleSort('green')}>
                            Ordenar por Verde {sortConfig?.key === 'green' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button onClick={() => handleSort('greenYellow')}>
                            Ordenar por Verde Cana {sortConfig?.key === 'greenYellow' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button onClick={() => handleSort('cherry')}>
                            Ordenar por Cereja {sortConfig?.key === 'cherry' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button onClick={() => handleSort('raisin')}>
                            Ordenar por Passa {sortConfig?.key === 'raisin' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button onClick={() => handleSort('dry')}>
                            Ordenar por Seco {sortConfig?.key === 'dry' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button onClick={() => handleSort('total')}>
                            Ordenar por Total {sortConfig?.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button onClick={() => handleSort('createdAt')}>
                            Ordenar por Data {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </Button>
                    </div>

                    <Button
                        style={{ marginTop: 20 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        Fechar
                    </Button>
                </ModalContent>
            </ModalOverlay>
        </Container>
    );
};

export default ComparacaoRapida;
