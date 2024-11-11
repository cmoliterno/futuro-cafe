import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const RolesContainer = styled.div`
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

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [systemKey, setSystemKey] = useState('');
  const [aplicacao, setAplicacao] = useState('');
  const [editId, setEditId] = useState<string | null>(null); // ID para editar

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await api.getAllRoles(); // Buscando todas as roles
    setRoles(response.data);
  };

  const handleCreate = async () => {
    // Função para criar uma nova role
    await api.createRole({ nome, descricao, systemKey, aplicacao });
    setNome(''); // Resetando o campo de nome
    setDescricao(''); // Resetando o campo de descrição
    setSystemKey(''); // Resetando o campo de systemKey
    setAplicacao(''); // Resetando o campo de aplicação
    fetchRoles(); // Atualizando a lista de roles
  };

  const handleEdit = async () => {
    // Função para editar uma role existente
    if (editId) {
      await api.updateRole(editId, { nome, descricao, systemKey, aplicacao });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setDescricao(''); // Resetando o campo de descrição
      setSystemKey(''); // Resetando o campo de systemKey
      setAplicacao(''); // Resetando o campo de aplicação
      fetchRoles(); // Atualizando a lista de roles
    }
  };

  const handleDelete = async (id: string) => {
    // Função para excluir uma role
    await api.deleteRole(id);
    fetchRoles(); // Atualizando a lista de roles
  };

  return (
    <RolesContainer>
      <Title>Roles</Title>
      <Input
        type="text"
        value={nome}
        placeholder="Nome da Role"
        onChange={(e) => setNome(e.target.value)} // Atualizando o nome da role
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
      <Input
        type="text"
        value={aplicacao}
        placeholder="Aplicação"
        onChange={(e) => setAplicacao(e.target.value)} // Atualizando a aplicação
      />
      <Button onClick={editId ? handleEdit : handleCreate}>
        {editId ? 'Salvar Alterações' : 'Adicionar Role'}
      </Button>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Descrição</TableHeader>
            <TableHeader>System Key</TableHeader>
            <TableHeader>Aplicação</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {roles.map((role: any) => (
            <TableRow key={role.id}>
              <TableData>{role.nome}</TableData>
              <TableData>{role.descricao}</TableData>
              <TableData>{role.systemKey}</TableData>
              <TableData>{role.aplicacao}</TableData>
              <TableData>
                <Button onClick={() => {
                  // Preparando para editar
                  setEditId(role.id);
                  setNome(role.nome);
                  setDescricao(role.descricao);
                  setSystemKey(role.systemKey);
                  setAplicacao(role.aplicacao);
                }}>Editar</Button>
                <Button onClick={() => handleDelete(role.id)}>Excluir</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </RolesContainer>
  );
};

export default RolesPage;
