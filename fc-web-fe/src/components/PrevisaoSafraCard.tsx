import React from 'react';
import styled from 'styled-components';
import { formatarDataPorExtenso } from '../utils/dateFnsUtils';
import { addDays, subDays } from 'date-fns';
import { FaLeaf, FaCalendarAlt, FaWarehouse } from 'react-icons/fa';

interface PrevisaoSafraCardProps {
  sacasPorHectare: number;
  diasParaColheita: number;
  dataIdealColheita: Date;
  dataUltimaAnalise: Date;
}

const Card = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  margin-top: var(--spacing-lg);
`;

const Section = styled.div`
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: var(--color-primary);
  font-size: 1.2rem;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-secondary);
`;

const MetricaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Metrica = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
`;

const MetricaLabel = styled.span`
  color: var(--color-gray-700);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  svg {
    color: var(--color-primary);
  }
`;

const MetricaValor = styled.span`
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.1rem;
`;

const PeriodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PeriodoData = styled.span`
  color: var(--color-primary);
  font-size: 1rem;
  
  &:first-child {
    font-weight: 600;
    margin-bottom: 2px;
  }
`;

const PrevisaoSafraCard: React.FC<PrevisaoSafraCardProps> = ({
  sacasPorHectare,
  diasParaColheita,
  dataIdealColheita,
  dataUltimaAnalise
}) => {
  const dataInicio = subDays(dataIdealColheita, 4);
  const dataFim = addDays(dataIdealColheita, 4);

  return (
    <Card>
      <Section>
        <SectionTitle>Previsão de Safra</SectionTitle>
        <MetricaContainer>
          <Metrica>
            <MetricaLabel>
              <FaLeaf />
              Produtividade Estimada
            </MetricaLabel>
            <MetricaValor>{sacasPorHectare.toFixed(2)} sacas/ha</MetricaValor>
          </Metrica>
        </MetricaContainer>
      </Section>

      <Section>
        <SectionTitle>Previsão de Colheita</SectionTitle>
        <MetricaContainer>
          <Metrica>
            <MetricaLabel>
              <FaCalendarAlt />
              Data da Última Análise
            </MetricaLabel>
            <MetricaValor>{formatarDataPorExtenso(dataUltimaAnalise)}</MetricaValor>
          </Metrica>

          <Metrica>
            <MetricaLabel>
              <FaWarehouse />
              Período Ideal de Colheita
            </MetricaLabel>
            <PeriodoContainer>
              <PeriodoData>Período recomendado:</PeriodoData>
              <PeriodoData>De: {formatarDataPorExtenso(dataInicio)}</PeriodoData>
              <PeriodoData>Até: {formatarDataPorExtenso(dataFim)}</PeriodoData>
            </PeriodoContainer>
          </Metrica>
        </MetricaContainer>
      </Section>
    </Card>
  );
};

export default PrevisaoSafraCard; 