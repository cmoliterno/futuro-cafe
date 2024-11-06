import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const GruposContainer = styled.div`
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

const GruposPage: React.FC = () => {
  const [grupos, setGrupos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editId, setEditId] = useState<number | null>(null); // ID para editar

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    const response = await api.getAllGrupos(); // Buscando todos os grupos
    setGrupos(response.data);
  };

  const handleCreate = async () => {
    // Função para criar um novo grupo
    await api.createGrupo({ nome, descricao });
    setNome(''); // Resetando o campo de nome
    setDescricao(''); // Resetando o campo de descrição
    fetchGrupos(); // Atualizando a lista de grupos
  };

  const handleEdit = async () => {
    // Função para editar um grupo existente
    if (editId) {
      await api.updateGrupo(editId, { nome, descricao });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setDescricao(''); // Resetando o campo de descrição
      fetchGrupos(); // Atualizando a lista de grupos
    }
  };

  const handleDelete = async (id: number) => {
    // Função para excluir um grupo
    await api.deleteGrupo(id);
    fetchGrupos(); // Atualizando a lista de grupos
  };

  return (
    <GruposContainer>
      <Title>Grupos</Title>
      <Input
        type="text"
        value={nome}
        placeholder="Nome do Grupo"
        onChange={(e) => setNome(e.target.value)} // Atualizando o nome do grupo
      />
      <Input
        type="text"
        value={descricao}
        placeholder="Descrição"
        onChange={(e) => setDescricao(e.target.value)} // Atualizando a descrição
      />
      <Button onClick={editId ? handleEdit : handleCreate}>
        {editId ? 'Salvar Alterações' : 'Adicionar Grupo'}
      </Button>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Descrição</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo: any) => (
            <TableRow key={grupo.id}>
              <TableData>{grupo.nome}</TableData>
              <TableData>{grupo.descricao}</TableData>
              <TableData>
                <Button onClick={() => {
                  // Preparando para editar
                  setEditId(grupo.id);
                  setNome(grupo.nome);
                  setDescricao(grupo.descricao);
                }}>Editar</Button>
                <Button onClick={() => handleDelete(grupo.id)}>Excluir</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </GruposContainer>
  );
};

export default GruposPage;
