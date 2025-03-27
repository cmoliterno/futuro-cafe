import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaMapMarkerAlt, FaChartLine } from 'react-icons/fa';

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
  margin-bottom: 24px;
  text-align: center;
`;

const Title = styled.h2`
  color: #047502;
  font-size: 32px;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 18px;
  margin-bottom: 32px;
  text-align: center;
  line-height: 1.5;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
`;

const OptionCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 28px 24px;
  width: 250px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
    border-color: #047502;
  }
`;

const IconContainer = styled.div`
  background-color: #e8f5e9;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #047502;
  font-size: 28px;
  transition: all 0.3s ease;
  
  ${OptionCard}:hover & {
    transform: scale(1.1);
    background-color: #d0ebd1;
  }
`;

const OptionTitle = styled.h3`
  color: #333;
  text-align: center;
  margin-bottom: 12px;
  font-size: 18px;
`;

const OptionDescription = styled.p`
  color: #666;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
`;

const Button = styled.button`
  background-color: #047502;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 28px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #035f02;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  const handleOptionClick = (path: string) => {
    onClose();
    navigate(path);
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '35px',
            height: '35px',
            backgroundColor: '#e0e0e0',
            border: '2px solid #ccc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            outline: 'none',
            padding: 0,
            lineHeight: 1
          }}
          onMouseOver={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = '#ccc';
            target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = '#e0e0e0';
            target.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>
        
        <ModalHeader>
          <Title>Bem-vindo ao Futuro Café!</Title>
          <Subtitle>Vamos começar? Escolha uma das opções abaixo para iniciar sua jornada de análise de cultivo.</Subtitle>
        </ModalHeader>
        
        <OptionsContainer>
          <OptionCard onClick={() => handleOptionClick('/fazendas')}>
            <IconContainer>
              <FaLeaf size={32} />
            </IconContainer>
            <OptionTitle>Cadastrar Fazenda</OptionTitle>
            <OptionDescription>
              Comece registrando sua fazenda para organizar melhor suas áreas de cultivo. Este é o primeiro passo recomendado.
            </OptionDescription>
          </OptionCard>
          
          <OptionCard onClick={() => handleOptionClick('/talhoes')}>
            <IconContainer>
              <FaMapMarkerAlt size={32} />
            </IconContainer>
            <OptionTitle>Cadastrar Talhão</OptionTitle>
            <OptionDescription>
              Após cadastrar sua fazenda, você pode adicionar talhões específicos para monitorar detalhadamente o desenvolvimento.
            </OptionDescription>
          </OptionCard>
          
          <OptionCard onClick={() => handleOptionClick('/analise-rapida')}>
            <IconContainer>
              <FaChartLine size={32} />
            </IconContainer>
            <OptionTitle>Análise Rápida</OptionTitle>
            <OptionDescription>
              Se preferir, faça uma análise rápida sem precisar cadastrar fazendas ou talhões. Ideal para testes iniciais.
            </OptionDescription>
          </OptionCard>
        </OptionsContainer>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '32px' }}>
          <Button onClick={onClose}>Continuar para o Dashboard</Button>
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default OnboardingModal; 