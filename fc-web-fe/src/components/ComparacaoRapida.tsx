import React, { useState } from "react";
import styled from "styled-components";
import api from "../services/api"; // Importando as funções criadas
import { FaUpload, FaTrash, FaChartBar } from "react-icons/fa";

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
    const [leftImages, setLeftImages] = useState<File[]>([]);
    const [rightImages, setRightImages] = useState<File[]>([]);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonResults, setComparisonResults] = useState<any>(null);

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        side: "left" | "right"
    ) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files).slice(0, 20); // Limitar a 20 imagens
            const imagens = fileArray.map((file) => URL.createObjectURL(file)); // Apenas URLs para simulação
            const nomeGrupo = `Grupo ${side === "left" ? "Esquerdo" : "Direito"}`;

            try {
                const response = await api.createRapidAnalysisGroup({
                    nomeGrupo,
                    lado: side,
                    imagens,
                });

                if (side === "left") setLeftImages(fileArray);
                else setRightImages(fileArray);

                console.log("Grupo criado:", response.data);
            } catch (error) {
                console.error("Erro ao criar grupo:", error);
            }
        }
    };

    const handleClear = (side: "left" | "right") => {
        if (side === "left") setLeftImages([]);
        else setRightImages([]);
    };

    const handleCompare = async () => {
        if (leftImages.length === 0 || rightImages.length === 0) {
            alert("Por favor, envie imagens para ambos os lados antes de comparar.");
            return;
        }

        setIsComparing(true);

        try {
            const response = await api.compareRapidAnalyses({
                grupoEsquerdoId: "Grupo Esquerdo",
                grupoDireitoId: "Grupo Direito",
            });

            setComparisonResults(response.data);
        } catch (error) {
            console.error("Erro na comparação:", error);
        } finally {
            setIsComparing(false);
        }
    };

    return (
        <Container>
            <Title>Comparação Rápida</Title>

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
                            <PreviewImage
                                key={idx}
                                src={URL.createObjectURL(file)}
                                alt={`Esquerdo ${idx}`}
                            />
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
                            <PreviewImage
                                key={idx}
                                src={URL.createObjectURL(file)}
                                alt={`Direito ${idx}`}
                            />
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
                <Button
                    className="compare"
                    onClick={handleCompare}
                    disabled={isComparing || leftImages.length === 0 || rightImages.length === 0}
                >
                    {isComparing ? "Comparando..." : "Comparar"}
                </Button>
            </ActionButtons>

            {comparisonResults && (
                <ResultSection>
                    <h2>Resultado</h2>
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
