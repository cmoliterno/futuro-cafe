import styled from "styled-components";
import { FaSpinner, FaTimes } from "react-icons/fa";

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #EEDCC8;
  min-height: calc(100vh - 60px);
`;

export const Title = styled.h1`
  color: #230C02;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  text-align: center;
`;

export const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#5D4037' : '#8D6E63'};
  color: #FFF;
  border: none;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  
  &:hover {
    background-color: #5D4037;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

export const CardHeader = styled.div`
  background-color: #5D4037;
  padding: 1rem;
  color: white;
  font-weight: 500;
`;

export const CardBody = styled.div`
  padding: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #230C02;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #DDD;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #5D4037;
  }
  
  &:disabled {
    background-color: #F5F5F5;
    cursor: not-allowed;
  }
`;

export const DescriptionInput = styled(Input)`
  margin-bottom: 1.5rem;
  font-weight: 500;
  
  &::placeholder {
    color: #999;
  }
`;

export const DropZoneContainer = styled.div<{
  isDragActive: boolean;
  isDisabled?: boolean;
}>`
  border: 2px dashed ${props => props.isDragActive ? '#5D4037' : '#AAA'};
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  background-color: ${props => props.isDragActive ? 'rgba(93, 64, 55, 0.05)' : 'transparent'};
  margin-bottom: 1rem;
  
  ${props => props.isDisabled && `
    opacity: 0.6;
    pointer-events: none;
  `}
  
  &:hover {
    background-color: ${props => props.isDisabled ? 'transparent' : 'rgba(93, 64, 55, 0.05)'};
  }
`;

export const DropZoneText = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

export const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const UploadSection = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const UploadGroup = styled.div`
  margin-bottom: 2rem;
  background-color: #FFF;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const UploadTitle = styled.h3`
  color: #230C02;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
`;

export const SectionTitle = styled.h3`
  color: #230C02;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
`;

export const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const PreviewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #DDD;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    opacity: 0.9;
  }
`;

export const RemoveIcon = styled(FaTimes)`
  position: absolute;
  top: -8px;
  right: -8px;
  color: white;
  background-color: #D32F2F;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background-color: #B71C1C;
    transform: scale(1.1);
  }
`;

export const FileName = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'success' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  background-color: ${props => {
    switch(props.variant) {
      case 'danger': return '#D32F2F';
      case 'success': return '#388E3C';
      case 'secondary': return '#757575';
      default: return '#5D4037';
    }
  }};
  
  color: white;
  
  &:hover {
    background-color: ${props => {
      switch(props.variant) {
        case 'danger': return '#B71C1C';
        case 'success': return '#2E7D32';
        case 'secondary': return '#616161';
        default: return '#4E342E';
      }
    }};
  }
  
  &:disabled {
    background-color: #BDBDBD;
    cursor: not-allowed;
  }
`;

export const ProgressContainer = styled.div`
  width: 100%;
  background-color: #EEEEEE;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  height: 8px;
  width: ${props => `${props.progress}%`};
  background-color: #5D4037;
  transition: width 0.3s ease;
`;

export const StatusCard = styled.div`
  background-color: #FFF8E1;
  border-left: 4px solid #FFA000;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
`;

export const LoadingOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
`;

export const SpinnerIcon = styled(FaSpinner)`
  font-size: 2rem;
  color: white;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ModalOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
`;

export const ModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
`;

export const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #DDD;
  color: #230C02;
`;

export const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #EEE;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #757575;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #DDD;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #5D4037;
  }
`;

export const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #DDD;
  border-radius: 4px;
  flex: 1;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #5D4037;
  }
`;

// Adicionando componentes que estavam faltando

export const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  overflow: hidden;
  z-index: -1;
`;

export const FileLabel = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${props => props.disabled ? '#BDBDBD' : '#5D4037'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.disabled ? '#BDBDBD' : '#4E342E'};
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  
  button {
    min-width: 120px;
    
    &.delete {
      background-color: #D32F2F;
      
      &:hover {
        background-color: #B71C1C;
      }
    }
    
    &.compare {
      background-color: #388E3C;
      
      &:hover {
        background-color: #2E7D32;
      }
    }
    
    &.new-comparison {
      background-color: #0288D1;
      
      &:hover {
        background-color: #0277BD;
      }
    }
    
    &.view-comparison {
      background-color: #5D4037;
      
      &:hover {
        background-color: #4E342E;
      }
    }
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`; 