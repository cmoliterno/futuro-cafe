import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const TalhoesContainer = styled.div`
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

const TalhoesPage: React.FC = () => {
  const [talhoes, setTalhoes] = useState([]);
  const [nome, setNome] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [fazendaId, setFazendaId] = useState<number>(0); // Inicializando como 0
  const [editId, setEditId] = useState<number | null>(null); // ID para editar

  useEffect(() => {
    fetchTalhoes();
  }, []);

  const fetchTalhoes = async () => {
    const response = await api.getAllTalhoes(); // Buscando todos os talhões
    setTalhoes(response.data);
  };

  const handleCreate = async () => {
    // Função para criar um novo talhão
    await api.createTalhao({ nome, nomeResponsavel, fazendaId });
    setNome(''); // Resetando o campo de nome
    setNomeResponsavel(''); // Resetando o campo de nome do responsável
    setFazendaId(0); // Resetando o campo de ID da fazenda para 0
    fetchTalhoes(); // Atualizando a lista de talhões
  };

  const handleEdit = async () => {
    // Função para editar um talhão existente
    if (editId) {
      await api.updateTalhao(editId, { nome, nomeResponsavel, fazendaId });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setNomeResponsavel(''); // Resetando o campo de nome do responsável
      setFazendaId(0); // Resetando o campo de ID da fazenda para 0
      fetchTalhoes(); // Atualizando a lista de talhões
    }
  };

  const handleDelete = async (id: number) => {
    // Função para excluir um talhão
    await api.deleteTalhao(id);
    fetchTalhoes(); // Atualizando a lista de talhões
  };

  return (
    <TalhoesContainer>
      <Title>Talhões</Title>
      <Input
        type="text"
        value={nome}
        placeholder="Nome do Talhão"
        onChange={(e) => setNome(e.target.value)} // Atualizando o nome do talhão
      />
      <Input
        type="text"
        value={nomeResponsavel}
        placeholder="Nome do Responsável"
        onChange={(e) => setNomeResponsavel(e.target.value)} // Atualizando o nome do responsável
      />
      <Input
        type="number"
        value={fazendaId} // Garantindo que fazendaId é um número
        placeholder="ID da Fazenda"
        onChange={(e) => setFazendaId(Number(e.target.value))} // Atualizando o ID da fazenda
      />
      <Button onClick={editId ? handleEdit : handleCreate}>
        {editId ? 'Salvar Alterações' : 'Adicionar Talhão'}
      </Button>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Nome do Responsável</TableHeader>
            <TableHeader>ID da Fazenda</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {talhoes.map((talhao: any) => (
            <TableRow key={talhao.id}>
              <TableData>{talhao.nome}</TableData>
              <TableData>{talhao.nomeResponsavel}</TableData>
              <TableData>{talhao.fazendaId}</TableData>
              <TableData>
                <Button onClick={() => {
                  // Preparando para editar
                  setEditId(talhao.id);
                  setNome(talhao.nome);
                  setNomeResponsavel(talhao.nomeResponsavel);
                  setFazendaId(talhao.fazendaId);
                }}>Editar</Button>
                <Button onClick={() => handleDelete(talhao.id)}>Excluir</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TalhoesContainer>
  );
};

export default TalhoesPage;
