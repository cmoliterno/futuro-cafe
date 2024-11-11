import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #EEDCC8; /* Cor de fundo */
`;

const Title = styled.h1`
  color: #230C02; /* Cor do título */
  text-align: center;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around; /* Distribui os cards uniformemente */
  flex-wrap: wrap; /* Permite que os cards se movam para a próxima linha se não houver espaço */
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1;
  margin: 10px; /* Adiciona espaço entre os cards */
  min-width: 200px; /* Define uma largura mínima para os cards */
  text-align: center; /* Centraliza o texto dentro do card */
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const DashboardPage: React.FC = () => {
  const [data, setData] = useState({
    totalAnalisesMesAtual: 0,
    aumentoAnalisesRelacaoMesPassado: 0,
    totalAnalisesHoje: 0,
    totalTalhoes: 0,
  });
  const [error, setError] = useState(''); // Estado para armazenar mensagens de erro

  useEffect(() => {
    const getData = async () => {
      try {
        const estatisticasResponse = await api.getEstatisticas();
        setData(estatisticasResponse.data);
        setError(''); // Limpa qualquer mensagem de erro anterior
      } catch (error: any) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setError(error.response?.data.message || 'Erro ao buscar dados do dashboard.'); // Define a mensagem de erro
      }
    };
    getData();
  }, []);

  return (
      <DashboardContainer>
        <Title>Dashboard</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>} {/* Exibe a mensagem de erro se existir */}
        <Stats>
          <Card>
            <h2>Total de Talhões</h2>
            <p>{data.totalTalhoes}</p>
          </Card>
          <Card>
            <h2>Total de Análises do Mês Atual</h2>
            <p>{data.totalAnalisesMesAtual}</p>
          </Card>
          <Card>
            <h2>Aumento de Análises em Relação ao Mês Passado (%)</h2>
            <p>{data.aumentoAnalisesRelacaoMesPassado}</p>
          </Card>
          <Card>
            <h2>Total de Análises Hoje</h2>
            <p>{data.totalAnalisesHoje}</p>
          </Card>
        </Stats>
        {/* Outros componentes e informações adicionais */}
      </DashboardContainer>
  );
};

export default DashboardPage;
