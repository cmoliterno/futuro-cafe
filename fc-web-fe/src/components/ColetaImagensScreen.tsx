import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api'; // Importando o serviço de API
import imageCompression from 'browser-image-compression'; // Importando a biblioteca de compressão de imagem

// Estilos
const ColetaImagensContainer = styled.div`
  padding: 30px;
  background-color: #f9f9f9;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const PhotoButton = styled.button`
  padding: 12px 20px;
  margin-bottom: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: inline-block;
  width: 100%;
  text-align: center;

  &:hover {
    background-color: #45a049;
  }
`;

const PhotoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const PhotoItem = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
`;

const RemoveButton = styled.button`
  padding: 5px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const SendButton = styled.button`
  background-color: #008cba;
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background-color: #007bb5;
  }
`;

// Tipagem para as fotos
interface Photo {
    uri: string;
    type: string;
    name: string;
    file: File;
}

const ColetaImagensScreen: React.FC = () => {
    const navigate = useNavigate();
    const { talhaoId } = useParams<{ talhaoId: string }>(); // Pegando o ID do talhão da URL
    const [projects, setProjects] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingImages, setLoadingImages] = useState<boolean>(false); // Novo estado para controle de carregamento de imagens

    useEffect(() => {
        const fetchData = async () => {
            const projectsData = await api.getAllProjetos();
            const groupsData = await api.getAllGrupos();
            setProjects(projectsData.data);
            setGroups(groupsData.data);
        };
        fetchData();
    }, []);

    const handleImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

        const validImages = Array.from(selectedFiles).filter((file) =>
            file.type.startsWith('image/')
        );

        if (validImages.length === 0) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Set loading state for image selection
        setLoadingImages(true); // Ativa o loading

        const newPhotos: Photo[] = [];

        for (const file of validImages) {
            try {
                const options = {
                    maxSizeMB: 2, // Definir o tamanho máximo em MB
                    maxWidthOrHeight: 1024, // Definir o limite de largura/altura
                    useWebWorker: true, // Usar Web Worker para a compressão
                };

                const compressedFile = await imageCompression(file, options);

                newPhotos.push({
                    uri: URL.createObjectURL(compressedFile),
                    type: compressedFile.type,
                    name: file.name || `photo_${new Date().getTime()}.jpg`,
                    file: compressedFile, // Salvar o arquivo compactado
                });
            } catch (error) {
                console.error('Erro ao compactar imagem:', error);
            }
        }

        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos].slice(0, 10)); // Limita a 10 fotos

        // Stop loading after images are processed
        setLoadingImages(false); // Desativa o loading
    };

    const handleRemovePhoto = (uri: string) => {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.uri !== uri));
    };

    const handleSendImages = async () => {
        if (!talhaoId || photos.length === 0) {
            alert('Por favor, selecione um talhão e adicione imagens.');
            return;
        }

        setLoading(true); // Inicia o carregamento
        try {
            // Envia todas as imagens em paralelo usando Promise.all
            const uploadPromises = photos.map((photo) => {
                const formData = new FormData();
                formData.append('formFile', photo.file); // Envia o arquivo real compactado

                // Se houver projeto ou grupo selecionado, adiciona ao formData
                if (selectedProject) formData.append('projetoId', selectedProject);
                if (selectedGroup) formData.append('grupoId', selectedGroup);

                // Envia uma imagem de cada vez para o back-end
                return api.addPlotAnalysis(talhaoId, formData); // Retorna a Promise
            });

            // Aguarda todas as Promises de upload se resolverem
            await Promise.all(uploadPromises);

            setLoading(false); // Finaliza o carregamento
            alert('Imagens enviadas para análise.');
            navigate(`/resultados-analise?talhaoId=${talhaoId}`); // Redireciona para a página de resultados
        } catch (error) {
            setLoading(false); // Finaliza o carregamento em caso de erro
            alert('Ocorreu um erro ao enviar as imagens.');
            console.error(error); // Para depuração
        }
    };

    return (
        <ColetaImagensContainer>
            <Title>Coleta de Imagens</Title>
            <span>Talhão Selecionado: {talhaoId}</span>

            <div>
                <Label>Projeto (Opcional)</Label>
                <Select
                    value={selectedProject || ''}
                    onChange={(e) => setSelectedProject(e.target.value)}
                >
                    <option value="">Selecione um projeto</option>
                    {projects.map((project: any) => (
                        <option key={project.id} value={project.id}>
                            {project.nome}
                        </option>
                    ))}
                </Select>
            </div>

            <div>
                <Label>Grupo (Opcional)</Label>
                <Select
                    value={selectedGroup || ''}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="">Selecione um grupo</option>
                    {groups.map((group: any) => (
                        <option key={group.id} value={group.id}>
                            {group.nome}
                        </option>
                    ))}
                </Select>
            </div>

            <div>
                <PhotoButton as="label">
                    Escolher Imagem
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelection}
                        style={{ display: 'none' }}
                    />
                </PhotoButton>
            </div>

            {loadingImages && <p>Carregando imagens...</p>} {/* Mostrar mensagem de loading */}

            <PhotoWrapper>
                {photos.map((photo, index) => (
                    <PhotoItem key={index}>
                        <img src={photo.uri} alt={`Imagem ${index}`} style={{ width: '100%', height: 'auto' }} />
                        <span>{photo.name}</span>
                        <RemoveButton onClick={() => handleRemovePhoto(photo.uri)}>
                            Remover
                        </RemoveButton>
                    </PhotoItem>
                ))}
            </PhotoWrapper>

            <SendButton onClick={handleSendImages} disabled={loading || loadingImages}>
                {loading ? 'Enviando...' : 'Enviar para Análise'}
            </SendButton>
        </ColetaImagensContainer>
    );
};

export default ColetaImagensScreen;
