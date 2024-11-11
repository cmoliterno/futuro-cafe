import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const PerfisContainer = styled.div`
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

const PerfilPage: React.FC = () => {
  const [perfis, setPerfis] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [systemKey, setSystemKey] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchPerfis();
  }, []);

  const fetchPerfis = async () => {
    const response = await api.getAllPerfis(); // Buscando todos os perfis
    setPerfis(response.data);
  };

  const handleCreate = async () => {
    // Função para criar um novo perfil
    await api.createPerfil({ nome, descricao, systemKey });
    setNome(''); // Resetando o campo de nome
    setDescricao(''); // Resetando o campo de descrição
    setSystemKey(''); // Resetando o campo de systemKey
    fetchPerfis(); // Atualizando a lista de perfis
  };

  const handleEdit = async () => {
    // Função para editar um perfil existente
    if (editId) {
      await api.updatePerfil(editId, { nome, descricao, systemKey });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setDescricao(''); // Resetando o campo de descrição
      setSystemKey(''); // Resetando o campo de systemKey
      fetchPerfis(); // Atualizando a lista de perfis
    }
  };

  const handleDelete = async (id: string) => {
    // Função para excluir um perfil
    await api.deletePerfil(id);
    fetchPerfis(); // Atualizando a lista de perfis
  };

  return (
    <PerfisContainer>
      <Title>Perfis</Title>
      <Input
        type="text"
        value={nome}
        placeholder="Nome do Perfil"
        onChange={(e) => setNome(e.target.value)} // Atualizando o nome do perfil
      />
      <Input
        type="text"
        value={descricao}
        placeholder="Descrição"
        onChange={(e) => setDescricao(e.target.value)} // Atualizando a descrição
      />
      <Input
        type="text"
        value={systemKey}
        placeholder="System Key"
        onChange={(e) => setSystemKey(e.target.value)} // Atualizando o systemKey
      />
      <Button onClick={editId ? handleEdit : handleCreate}>
        {editId ? 'Salvar Alterações' : 'Adicionar Perfil'}
      </Button>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Descrição</TableHeader>
            <TableHeader>System Key</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {perfis.map((perfil: any) => (
            <TableRow key={perfil.id}>
              <TableData>{perfil.nome}</TableData>
              <TableData>{perfil.descricao}</TableData>
              <TableData>{perfil.systemKey}</TableData>
              <TableData>
                <Button onClick={() => {
                  // Preparando para editar
                  setEditId(perfil.id);
                  setNome(perfil.nome);
                  setDescricao(perfil.descricao);
                  setSystemKey(perfil.systemKey);
                }}>Editar</Button>
                <Button onClick={() => handleDelete(perfil.id)}>Excluir</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </PerfisContainer>
  );
};

export default PerfilPage;
