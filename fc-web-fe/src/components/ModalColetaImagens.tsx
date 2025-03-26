import React, { useState, ChangeEvent, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import api from '../services/api';
import imageCompression from 'browser-image-compression';
import { FaTimes, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import UploadService, { UploadFile } from '../services/UploadService';

// Animações
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

// Estilos
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background-color: #f9f9f9;
  max-width: 900px;
  width: 95%;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: ${slideIn} 0.3s ease-out;
  
  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(231, 76, 60, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #c0392b;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 6px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin-bottom: 24px;
  font-weight: 500;
`;

const PhotoButton = styled.button`
  padding: 16px 24px;
  margin-bottom: 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  text-align: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.disabled && css`
    background-color: #cccccc;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const PhotoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
`;

const PhotoItem = styled.div`
  background-color: #fff;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  transition: all 0.2s ease;
  border: 1px solid #eaeaea;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 8px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ImageName = styled.span`
  font-size: 13px;
  color: #555;
  text-align: center;
  margin-bottom: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  margin-top: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #c0392b;
  }
`;

const SendButton = styled.button`
  background-color: #008cba;
  color: white;
  padding: 16px 30px;
  border-radius: 8px;
  margin-top: 10px;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover:enabled {
    background-color: #007bb5;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active:enabled {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }
`;

const LoadingIndicator = styled.div`
  padding: 12px;
  text-align: center;
  color: #008cba;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &::after {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #008cba;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Tipagem para as fotos
interface Photo {
    uri: string;
    type: string;
    name: string;
    file: File;
}

interface ModalColetaImagensProps {
    isOpen: boolean;
    onClose: () => void;
    talhaoId: string;
    talhaoNome?: string;
    onSuccessfulUpload?: () => void;
}

const ModalColetaImagens: React.FC<ModalColetaImagensProps> = ({ 
    isOpen, 
    onClose, 
    talhaoId,
    talhaoNome,
    onSuccessfulUpload 
}) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingImages, setLoadingImages] = useState<boolean>(false);
    
    // Efeito para limpar as fotos quando o modal for fechado
    useEffect(() => {
        if (!isOpen) {
            setPhotos([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

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

        setLoadingImages(true);

        const newPhotos: Photo[] = [];

        for (const file of validImages) {
            try {
                const options = {
                    maxSizeMB: 2,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(file, options);

                newPhotos.push({
                    uri: URL.createObjectURL(compressedFile),
                    type: compressedFile.type,
                    name: file.name || `photo_${new Date().getTime()}.jpg`,
                    file: compressedFile,
                });
            } catch (error) {
                console.error('Erro ao compactar imagem:', error);
            }
        }

        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos].slice(0, 10));
        setLoadingImages(false);
    };

    const handleRemovePhoto = (uri: string) => {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.uri !== uri));
    };

    const handleSendImages = async () => {
        if (!talhaoId || photos.length === 0) {
            alert('Por favor, adicione imagens para análise.');
            return;
        }

        setLoading(true);
        try {
            // Preparar os dados para envio em formato compatível com o UploadService
            const uploadData: UploadFile[] = photos.map((photo) => {
                const formData = new FormData();
                formData.append('formFile', photo.file);
                return {
                    formData,
                    fileName: photo.name
                };
            });
            
            // Gerar um ID único para este upload
            const uploadId = `upload_${Date.now()}`;
            
            // Iniciar o upload em segundo plano usando o serviço
            UploadService.startUpload(uploadId, talhaoId, uploadData);
            
            // Configurar um ouvinte para receber notificações de conclusão
            const removeListener = UploadService.addListener((uploads) => {
                const upload = uploads.find(u => u.id === uploadId);
                if (upload && upload.status !== 'in_progress') {
                    // O upload foi concluído (com sucesso, falha ou parcialmente)
                    removeListener(); // Remover o ouvinte
                    
                    // Mostrar uma notificação apropriada
                    if (upload.status === 'completed') {
                        alert(`Todas as ${upload.totalFiles} imagens foram enviadas com sucesso.`);
                    } else if (upload.status === 'failed') {
                        alert(`Não foi possível enviar nenhuma das ${upload.totalFiles} imagens. Verifique sua conexão e tente novamente.`);
                    } else if (upload.status === 'partial') {
                        alert(`${upload.completedFiles} de ${upload.totalFiles} imagens foram enviadas com sucesso. ${upload.failedFiles} imagens não puderam ser enviadas.`);
                    }
                }
            });
            
            // Limpar as fotos e fechar o modal imediatamente
            setPhotos([]);
            setLoading(false);
            
            // Notificar o componente pai sobre o upload iniciado
            if (onSuccessfulUpload) {
                onSuccessfulUpload();
            }
            
            // Informar ao usuário que o upload foi iniciado e fechar o modal
            alert('Upload iniciado! As imagens serão processadas em segundo plano. Uma notificação será exibida quando o processo for concluído.');
            onClose();
            
        } catch (error) {
            setLoading(false);
            alert('Ocorreu um erro ao preparar as imagens para envio.');
            console.error(error);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>
                    <FaTimes />
                </CloseButton>
                
                <ModalHeader>
                    <div>
                        <Title>Coleta de Imagens</Title>
                        <Subtitle>Talhão: <strong>{talhaoNome || talhaoId}</strong></Subtitle>
                    </div>
                </ModalHeader>

                <div>
                    <PhotoButton as="label" disabled={loading || loadingImages}>
                        <FaCloudUploadAlt size={20} />
                        Escolher Imagens
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelection}
                            style={{ display: 'none' }}
                            disabled={loading || loadingImages}
                        />
                    </PhotoButton>
                </div>

                {loadingImages && <LoadingIndicator>Processando imagens...</LoadingIndicator>}

                {photos.length > 0 && (
                    <PhotoWrapper>
                        {photos.map((photo, index) => (
                            <PhotoItem key={index}>
                                <ImageContainer>
                                    <img src={photo.uri} alt={`Imagem ${index}`} />
                                </ImageContainer>
                                <ImageName title={photo.name}>{photo.name}</ImageName>
                                <RemoveButton onClick={() => handleRemovePhoto(photo.uri)}>
                                    <FaTrash size={12} /> Remover
                                </RemoveButton>
                            </PhotoItem>
                        ))}
                    </PhotoWrapper>
                )}

                <SendButton 
                    onClick={handleSendImages} 
                    disabled={loading || loadingImages || photos.length === 0}
                >
                    {loading ? 'Enviando...' : 'Enviar para Análise'}
                </SendButton>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default ModalColetaImagens; 