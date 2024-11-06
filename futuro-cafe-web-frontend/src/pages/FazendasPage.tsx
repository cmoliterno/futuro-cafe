import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const FazendasContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  color: #333;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 8px;
`;

const Button = styled.button`
  padding: 8px 12px;
  margin-bottom: 20px;
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

const FazendasPage: React.FC = () => {
  const [fazendas, setFazendas] = useState([]);
  const [nome, setNome] = useState('');
  const [area, setArea] = useState<number>(0); // Inicializando como 0
  const [editId, setEditId] = useState<number | null>(null); // ID para editar

  useEffect(() => {
    fetchFazendas();
  }, []);

  const fetchFazendas = async () => {
    const response = await api.getAllFazendas(); // Buscando todas as fazendas
    setFazendas(response.data);
  };

  const handleCreate = async () => {
    // Função para criar uma nova fazenda
    await api.createFazenda({ nome, area });
    setNome(''); // Resetando o campo de nome
    setArea(0); // Resetando o campo de área para 0
    fetchFazendas(); // Atualizando a lista de fazendas
  };

  const handleEdit = async () => {
    // Função para editar uma fazenda existente
    if (editId) {
      await api.updateFazenda(editId, { nome, area });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setArea(0); // Resetando o campo de área para 0
      fetchFazendas(); // Atualizando a lista de fazendas
    }
  };

  const handleDelete = async (id: number) => {
    // Função para excluir uma fazenda
    await api.deleteFazenda(id);
    fetchFazendas(); // Atualizando a lista de fazendas
  };

  return (
    <FazendasContainer>
      <Title>Fazendas</Title>
      <Input
        type="text"
        value={nome}
        placeholder="Nome da Fazenda"
        onChange={(e) => setNome(e.target.value)} // Atualizando o nome da fazenda
      />
      <Input
        type="number"
        value={area}
        placeholder="Área da Fazenda"
        onChange={(e) => setArea(Number(e.target.value))} // Atualizando a área da fazenda
      />
      <Button onClick={editId ? handleEdit : handleCreate}>
        {editId ? 'Salvar Alterações' : 'Adicionar Fazenda'}
      </Button>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Área</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {fazendas.map((fazenda: any) => (
            <TableRow key={fazenda.id}>
              <TableData>{fazenda.nome}</TableData>
              <TableData>{fazenda.area}</TableData>
              <TableData>
                <Button onClick={() => {
                  // Preparando para editar
                  setEditId(fazenda.id);
                  setNome(fazenda.nome);
                  setArea(fazenda.area);
                }}>Editar</Button>
                <Button onClick={() => handleDelete(fazenda.id)}>Excluir</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </FazendasContainer>
  );
};

export default FazendasPage;
