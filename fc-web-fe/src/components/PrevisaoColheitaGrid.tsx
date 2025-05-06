import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaLeaf, FaWarehouse } from 'react-icons/fa';
import { formatarDataPorExtenso } from '../utils/dateFnsUtils';
import PrevisaoColheitaService, { PrevisaoTalhao } from '../services/PrevisaoColheitaService';
import { addDays, subDays } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { EmptyContainer, EmptyIcon, EmptyMessage } from './EmptyState';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const Card = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-secondary);
`;

const TalhaoNome = styled.h3`
  color: var(--color-primary);
  margin: 0;
  font-size: 1.2rem;
`;

const FazendaNome = styled.span`
  color: var(--color-gray-600);
  font-size: 0.9rem;
`;

const MetricaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Metrica = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--color-background);
  border-radius: var(--border-radius-sm);
`;

const MetricaLabel = styled.span`
  color: var(--color-gray-700);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const MetricaValor = styled.span`
  color: var(--color-primary);
  font-weight: bold;
  font-size: 1rem;
`;

const DataAnaliseLabel = styled(MetricaLabel)`
  color: var(--color-primary);
  font-weight: 500;
`;

const DataAnaliseValor = styled(MetricaValor)`
  font-size: 0.95rem;
  color: var(--color-gray-700);
`;

const PeriodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PeriodoData = styled.span`
  color: var(--color-primary);
  font-size: 0.9rem;
  &:first-child {
    font-weight: bold;
    margin-bottom: 2px;
  }
`;

const PrevisaoColheitaGrid: React.FC = () => {
  const [previsoes, setPrevisoes] = useState<PrevisaoTalhao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarPrevisoes = async () => {
      try {
        setLoading(true);
        const data = await PrevisaoColheitaService.buscarTodasPrevisoes();
        setPrevisoes(data);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar previsões:', error);
        setError('Não foi possível carregar as previsões. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarPrevisoes();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (previsoes.length === 0) {
    return (
      <EmptyContainer>
        <EmptyIcon name="coffee" />
        <EmptyMessage>
          Nenhuma previsão disponível.
          Certifique-se de que existem análises recentes.
        </EmptyMessage>
      </EmptyContainer>
    );
  }

  return (
    <GridContainer>
      {previsoes.map((previsao) => {
        const dataIdealColheita = new Date(previsao.dataIdealColheita);
        const dataUltimaAnalise = new Date(previsao.dataUltimaAnalise);
        
        // Calcular o período recomendado como ±7 dias da data ideal
        const dataInicio = subDays(dataIdealColheita, 7);
        const dataFim = addDays(dataIdealColheita, 7);

        return (
          <Card key={previsao.id}>
            <CardHeader>
              <div>
                <TalhaoNome>{previsao.nome}</TalhaoNome>
                <FazendaNome>{previsao.fazendaNome}</FazendaNome>
              </div>
            </CardHeader>
            
            <MetricaContainer>
              <Metrica>
                <MetricaLabel>
                  <FaLeaf />
                  Produtividade Estimada
                </MetricaLabel>
                <MetricaValor>{previsao.sacasPorHectare.toFixed(2)} sacas/ha</MetricaValor>
              </Metrica>
              
              <Metrica>
                <MetricaLabel>
                  <FaCalendarAlt />
                  Data da Última Análise
                </MetricaLabel>
                <DataAnaliseValor>
                  {formatarDataPorExtenso(dataUltimaAnalise)}
                </DataAnaliseValor>
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
          </Card>
        );
      })}
    </GridContainer>
  );
};

export default PrevisaoColheitaGrid; 