import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import UploadService, { Upload } from '../services/UploadService';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaTimes } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 350px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

interface NotificationCardProps {
  status: 'in_progress' | 'completed' | 'failed' | 'partial';
  visible: boolean;
}

const NotificationCard = styled.div<NotificationCardProps>`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  flex-direction: column;
  animation: ${props => props.visible ? slideIn : slideOut} 0.3s ease-out forwards;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'completed': return '#34A853';
      case 'failed': return '#EA4335';
      case 'partial': return '#FBBC05';
      default: return '#4285F4';
    }
  }};
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 8px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #f1f1f1;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 6px;
`;

const ProgressFill = styled.div<{ progress: number, status: string }>`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => {
    switch (props.status) {
      case 'completed': return '#34A853';
      case 'failed': return '#EA4335';
      case 'partial': return '#FBBC05';
      default: return '#4285F4';
    }
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const Details = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  color: #666;
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${rotate} 1.5s linear infinite;
`;

const UploadNotification: React.FC = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [visibleCards, setVisibleCards] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Registrar um listener para os uploads
    const removeListener = UploadService.addListener((currentUploads) => {
      setUploads(currentUploads);
      
      // Marcar novos uploads como visíveis
      const newVisibleCards: { [key: string]: boolean } = {};
      currentUploads.forEach(upload => {
        newVisibleCards[upload.id] = true;
      });
      
      setVisibleCards(prev => ({...prev, ...newVisibleCards}));
    });

    return () => {
      removeListener();
    };
  }, []);

  const hideNotification = (uploadId: string) => {
    setVisibleCards(prev => ({...prev, [uploadId]: false}));
    
    // Remover o card depois da animação terminar
    setTimeout(() => {
      setUploads(prev => prev.filter(upload => upload.id !== uploadId));
    }, 300);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'failed': return 'Falhou';
      case 'partial': return 'Parcial';
      default: return 'Em progresso';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FaCheckCircle color="#34A853" />;
      case 'failed': return <FaExclamationTriangle color="#EA4335" />;
      case 'partial': return <FaExclamationTriangle color="#FBBC05" />;
      default: return <SpinnerIcon color="#4285F4" />;
    }
  };

  if (!uploads.length) return null;

  return (
    <NotificationContainer>
      {uploads.map(upload => {
        const progress = upload.totalFiles === 0 ? 0 : 
          Math.round((upload.completedFiles / upload.totalFiles) * 100);
        
        return (
          <NotificationCard 
            key={upload.id} 
            status={upload.status}
            visible={visibleCards[upload.id] !== false}
          >
            <NotificationHeader>
              <Title>
                {getStatusIcon(upload.status)}
                Upload de Imagens: {getStatusText(upload.status)}
              </Title>
              <CloseButton onClick={() => hideNotification(upload.id)}>
                <FaTimes />
              </CloseButton>
            </NotificationHeader>
            
            <ProgressContainer>
              <ProgressBar>
                <ProgressFill progress={progress} status={upload.status} />
              </ProgressBar>
              <Details>
                {upload.status === 'in_progress' 
                  ? `Enviando ${upload.completedFiles} de ${upload.totalFiles} imagens`
                  : `${upload.completedFiles} de ${upload.totalFiles} imagens enviadas${upload.failedFiles > 0 ? `, ${upload.failedFiles} falhou` : ''}`}
              </Details>
            </ProgressContainer>
          </NotificationCard>
        );
      })}
    </NotificationContainer>
  );
};

export default UploadNotification; 