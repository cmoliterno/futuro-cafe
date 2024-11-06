import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  color: #333;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1;
  margin: 0 10px;
`;

const DashboardPage: React.FC = () => {
  const [data, setData] = useState({
    totalTalhoes: 0,
    totalCultivares: 0,
    totalConexoes: 0,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const estatisticasResponse = await api.getEstatisticas();
        setData(estatisticasResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };
    getData();
  }, []);

  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      <Stats>
        <Card>
          <h2>Total de Talhões</h2>
          <p>{data.totalTalhoes}</p>
        </Card>
        <Card>
          <h2>Total de Cultivares</h2>
          <p>{data.totalCultivares}</p>
        </Card>
        <Card>
          <h2>Total de Conexões</h2>
          <p>{data.totalConexoes}</p>
        </Card>
      </Stats>
      {/* Outros componentes e informações adicionais */}
    </DashboardContainer>
  );
};

export default DashboardPage;
