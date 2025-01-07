import React, { useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import imageCompression from "browser-image-compression";
import { FaUpload, FaTrash, FaChartBar, FaSpinner } from "react-icons/fa";

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

const FileLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #28a745;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;

  &:hover {
    background-color: #218838;
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

const ResultSection = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const ComparisonImage = styled.img`
  max-width: 45%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

const ComparacaoRapida: React.FC = () => {
    const [descricao, setDescricao] = useState("");
    const [leftImages, setLeftImages] = useState<File[]>([]);
    const [rightImages, setRightImages] = useState<File[]>([]);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonResults, setComparisonResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        side: "left" | "right"
    ) => {
        if (comparisonResults) return; // Bloqueia uploads após a comparação

        const files = event.target.files;
        if (files) {
            setLoading(true);
            try {
                const compressedFiles: File[] = [];
                for (let file of Array.from(files).slice(0, 20)) {
                    const compressedFile = await imageCompression(file, {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1024,
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

        try {

            // Cria o FormData
            const formData = new FormData();
            formData.append("descricao", descricao);

            // 🔧 Adiciona as imagens ao FormData como arquivos reais
            leftImages.forEach((file) => {
                formData.append("imagensEsquerdo", file);
            });

            rightImages.forEach((file) => {
                formData.append("imagensDireito", file);
            });

            // 🔧 Faz a chamada correta para o endpoint usando a função do `api.ts`
            const grupoEsquerdoResponse = await api.createRapidAnalysisGroup(formData);

            const grupoId = grupoEsquerdoResponse.data.grupo.id;

            const comparisonResponse = await api.compareRapidAnalyses({
                grupoId,
            });

            setComparisonResults(comparisonResponse.data);
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
                    />
                    <FileLabel htmlFor="left-upload">
                        <FaUpload style={{ marginRight: "5px" }} /> Upload
                    </FileLabel>
                    <ImagePreview>
                        {leftImages.map((file, idx) => (
                            <PreviewContainer key={idx}>
                                <PreviewImage src={URL.createObjectURL(file)} alt={`Esquerdo ${idx}`} />
                                <FileName>{file.name}</FileName>
                            </PreviewContainer>
                        ))}
                    </ImagePreview>
                    <ActionButtons>
                        <Button className="delete" onClick={() => handleClear("left")}>
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
                    />
                    <FileLabel htmlFor="right-upload">
                        <FaUpload style={{ marginRight: "5px" }} /> Upload
                    </FileLabel>
                    <ImagePreview>
                        {rightImages.map((file, idx) => (
                            <PreviewContainer key={idx}>
                                <PreviewImage src={URL.createObjectURL(file)} alt={`Direito ${idx}`} />
                                <FileName>{file.name}</FileName>
                            </PreviewContainer>
                        ))}
                    </ImagePreview>
                    <ActionButtons>
                        <Button className="delete" onClick={() => handleClear("right")}>
                            <FaTrash /> Limpar
                        </Button>
                    </ActionButtons>
                </UploadGroup>
            </UploadSection>

            <ActionButtons>
                {!comparisonResults ? (
                    <Button className="compare" onClick={handleCompare} disabled={isComparing}>
                        {isComparing ? "Comparando..." : "Comparar"}
                    </Button>
                ) : (
                    <Button className="new-comparison" onClick={handleNewComparison}>
                        Nova Comparação
                    </Button>
                )}
            </ActionButtons>

            {comparisonResults && (
                <ResultSection>
                    <h2>Resultado da Comparação</h2>
                    <div>
                        <ComparisonImage src={comparisonResults.leftImage} alt="Esquerdo" />
                        <ComparisonImage src={comparisonResults.rightImage} alt="Direito" />
                    </div>
                </ResultSection>
            )}
        </Container>
    );
};

export default ComparacaoRapida;
