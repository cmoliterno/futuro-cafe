import React from 'react';
import styled from 'styled-components';
import { addDays, subDays } from 'date-fns';
import { formatarDataPorExtenso } from '../utils/dateFnsUtils';

const Card = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-md);
`;

const Section = styled.div`
  margin-bottom: var(--spacing-lg);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.h3`
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.2rem;
  text-align: center;
`;

const SubTitle = styled.h4`
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
  font-size: 1.1rem;
  border-bottom: 2px solid var(--color-secondary);
  padding-bottom: var(--spacing-sm);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

const InfoItem = styled.div`
  background-color: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border-left: 4px solid var(--color-secondary);
`;

const Label = styled.p`
  color: var(--color-gray-700);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
`;

const Value = styled.p`
  color: var(--color-primary);
  font-size: 1.1rem;
  font-weight: bold;
`;

const DateRange = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const DateRangeText = styled.p`
  color: var(--color-primary);
  font-size: 1rem;
  &:first-child {
    font-weight: bold;
    margin-bottom: var(--spacing-xs);
  }
`;

interface PrevisaoSafraCardProps {
  sacasPorHectare: number;
  diasParaColheita: number;
  dataIdealColheita: Date;
}

const PrevisaoSafraCard: React.FC<PrevisaoSafraCardProps> = ({
  sacasPorHectare,
  diasParaColheita,
  dataIdealColheita
}) => {
  const dataInicio = subDays(dataIdealColheita, 3);
  const dataFim = addDays(dataIdealColheita, 3);

  return (
    <Card>
      <Title>Previsões do Talhão</Title>
      
      <Section>
        <SubTitle>Previsão de Safra</SubTitle>
        <InfoGrid>
          <InfoItem>
            <Label>Produtividade Estimada</Label>
            <Value>{sacasPorHectare.toFixed(2)} sacas/ha</Value>
          </InfoItem>
        </InfoGrid>
      </Section>

      <Section>
        <SubTitle>Previsão de Colheita</SubTitle>
        <InfoGrid>
          <InfoItem>
            <Label>Tempo até a Colheita</Label>
            <Value>{diasParaColheita} dias</Value>
          </InfoItem>
          <InfoItem>
            <Label>Semana Ideal para Colheita</Label>
            <DateRange>
              <DateRangeText>Período recomendado:</DateRangeText>
              <DateRangeText>De: {formatarDataPorExtenso(dataInicio)}</DateRangeText>
              <DateRangeText>Até: {formatarDataPorExtenso(dataFim)}</DateRangeText>
            </DateRange>
          </InfoItem>
        </InfoGrid>
      </Section>
    </Card>
  );
};

export default PrevisaoSafraCard; 