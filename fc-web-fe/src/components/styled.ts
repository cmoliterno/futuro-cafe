import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Card = styled.div`
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
`;

export const CardHeader = styled.div`
  background-color: #4F8A10;
  color: white;
  font-weight: bold;
  padding: 15px;
`;

export const CardBody = styled.div`
  padding: 20px;
`;

export const Alert = styled.div<{ variant: 'info' | 'danger' }>`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  background-color: ${props => props.variant === 'danger' ? '#f8d7da' : '#d1ecf1'};
  color: ${props => props.variant === 'danger' ? '#721c24' : '#0c5460'};
  border: 1px solid ${props => props.variant === 'danger' ? '#f5c6cb' : '#bee5eb'};
`; 