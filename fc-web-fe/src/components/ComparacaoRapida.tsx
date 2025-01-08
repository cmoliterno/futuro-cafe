import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../services/api";
import imageCompression from "browser-image-compression";
import { FaUpload, FaTrash, FaSpinner } from "react-icons/fa";
import Chart from "chart.js/auto";

// Styled Components
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
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.disabled ? "#6c757d" : "#28a745")};
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-bottom: 15px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#6c757d" : "#218838")};
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const PreviewContainer = styled.div`
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
  width: 50%;
  text-align: center;
`;

const ChartContainer = styled.div`
  margin-top: 30px;
`;

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

    useEffect(() => {
        if (comparisonResults) {
            renderChart(comparisonResults);
        }
    }, [comparisonResults]);

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
                    }
                } catch (error) {
                    console.error("Erro ao verificar o status do processamento:", error);
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [processing, analiseRapidaId]);

    const renderChart = (data: any) => {
        const ctx = document.getElementById("comparisonChart") as HTMLCanvasElement;
        if (ctx) {
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Green", "GreenYellow", "Cherry", "Raisin", "Dry"],
                    datasets: [
                        {
                            label: "Lado Esquerdo",
                            data: [
                                data.grupo.estatisticasEsquerdo.green,
                                data.grupo.estatisticasEsquerdo.greenYellow,
                                data.grupo.estatisticasEsquerdo.cherry,
                                data.grupo.estatisticasEsquerdo.raisin,
                                data.grupo.estatisticasEsquerdo.dry,
                            ],
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                        {
                            label: "Lado Direito",
                            data: [
                                data.grupo.estatisticasDireito.green,
                                data.grupo.estatisticasDireito.greenYellow,
                                data.grupo.estatisticasDireito.cherry,
                                data.grupo.estatisticasDireito.raisin,
                                data.grupo.estatisticasDireito.dry,
                            ],
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    };

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        side: "left" | "right"
    ) => {
        if (comparisonResults) return;

        const files = event.target.files;
        if (files) {
            setLoading(true);
            try {
                const compressedFiles: File[] = [];
                for (let file of Array.from(files).slice(0, 20)) {
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
        }
    };

    const handleClear = (side: "left" | "right") => {
        if (side === "left") {
            setLeftImages([]);
        } else {
            setRightImages([]);
        }
    };

    const handleCompare = async () => {
        if (!descricao || leftImages.length === 0 || rightImages.length === 0) {
            alert("Preencha a descrição e selecione as imagens.");
            return;
        }

        setIsComparing(true);
        setLoading(true);
        setProcessing(true);

        try {
            const formData = new FormData();
            formData.append("descricao", descricao);
            leftImages.forEach((file) => {
                formData.append("imagensEsquerdo", file);
            });
            rightImages.forEach((file) => {
                formData.append("imagensDireito", file);
            });

            const response = await api.createRapidAnalysisGroup(formData);
            setAnaliseRapidaId(response.data.analiseRapidaId);
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
    };

    return (
        <Container>
            <Title>Comparação Rápida</Title>

            <DescriptionInput
                type="text"
                placeholder="Descrição da Análise"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={!!comparisonResults}
            />

            <LoadingOverlay isVisible={loading}>
                <SpinnerIcon />
            </LoadingOverlay>

            <UploadSection>
                <UploadGroup>
                    <UploadTitle>Lado Esquerdo</UploadTitle>
                    <FileInput
                        id="left-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleUpload(e, "left")}
                        disabled={!!comparisonResults}
                    />
                    <FileLabel htmlFor="left-upload" disabled={!!comparisonResults}>
                        <FaUpload style={{ marginRight: "5px" }} /> Upload
                    </FileLabel>
                    <ImagePreview>
                        {leftImages.map((file, idx) => (
                            <PreviewContainer key={idx}>
                                <PreviewImage
                                    src={URL.createObjectURL(file)}
                                    alt={`Esquerdo ${idx}`}
                                />
                                <FileName>{file.name}</FileName>
                            </PreviewContainer>
                        ))}
                    </ImagePreview>
                    <ActionButtons>
                        <Button
                            className="delete"
                            onClick={() => handleClear("left")}
                            disabled={!!comparisonResults}
                        >
                            <FaTrash /> Limpar
                        </Button>
                    </ActionButtons>
                </UploadGroup>

                <UploadGroup>
                    <UploadTitle>Lado Direito</UploadTitle>
                    <FileInput
                        id="right-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleUpload(e, "right")}
                        disabled={!!comparisonResults}
                    />
                    <FileLabel htmlFor="right-upload" disabled={!!comparisonResults}>
                        <FaUpload style={{ marginRight: "5px" }} /> Upload
                    </FileLabel>
                    <ImagePreview>
                        {rightImages.map((file, idx) => (
                            <PreviewContainer key={idx}>
                                <PreviewImage
                                    src={URL.createObjectURL(file)}
                                    alt={`Direito ${idx}`}
                                />
                                <FileName>{file.name}</FileName>
                            </PreviewContainer>
                        ))}
                    </ImagePreview>
                    <ActionButtons>
                        <Button
                            className="delete"
                            onClick={() => handleClear("right")}
                            disabled={!!comparisonResults}
                        >
                            <FaTrash /> Limpar
                        </Button>
                    </ActionButtons>
                </UploadGroup>
            </UploadSection>

            <ActionButtons>
                {!comparisonResults ? (
                    <Button
                        className="compare"
                        onClick={handleCompare}
                        disabled={isComparing}
                    >
                        {isComparing ? "Enviando..." : "Enviar para análise"}
                    </Button>
                ) : (
                    <Button className="new-comparison" onClick={handleNewComparison}>
                        Nova Comparação
                    </Button>
                )}
            </ActionButtons>

            {comparisonResults && (
                <ActionButtons>
                    <Button
                        className="view-comparison"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Visualizar Comparação
                    </Button>
                </ActionButtons>
            )}

            <ModalOverlay isVisible={isModalOpen}>
                <ModalContent>
                    <h2>Comparação de Dados</h2>
                    <ChartContainer>
                        <canvas id="comparisonChart"></canvas>
                    </ChartContainer>
                    <Button onClick={() => setIsModalOpen(false)}>Fechar</Button>
                </ModalContent>
            </ModalOverlay>
        </Container>
    );
};

export default ComparacaoRapida;
