import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const EstatisticasContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const TableRow = styled.tr`
  border: 1px solid #ddd;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const EstatisticasPage: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState([]);

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  const fetchEstatisticas = async () => {
    const response = await api.getEstatisticas(); // Buscando as estatísticas
    setEstatisticas(response.data);
  };

  return (
    <EstatisticasContainer>
      <Title>Estatísticas</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>Métrica</TableHeader>
            <TableHeader>Valor</TableHeader>
          </tr>
        </thead>
        <tbody>
          {estatisticas.map((estatistica: any) => (
            <TableRow key={estatistica.id}>
              <TableData>{estatistica.nome}</TableData>
              <TableData>{estatistica.valor}</TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </EstatisticasContainer>
  );
};

export default EstatisticasPage;
