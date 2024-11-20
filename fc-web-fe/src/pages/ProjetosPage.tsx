import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const ProjetosContainer = styled.div`
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

const Select = styled.select`
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

const ProjetosPage: React.FC = () => {
  const [projetos, setProjetos] = useState([]);
  const [nome, setNome] = useState('');
  const [grupoId, setGrupoId] = useState<string | null>(null); // Agora selecionando o grupo pelo id
  const [grupos, setGrupos] = useState([]); // Lista de grupos
  const [editId, setEditId] = useState<string | null>(null); // ID para editar

  useEffect(() => {
    fetchProjetos();
    fetchGrupos(); // Buscando os grupos
  }, []);

  const fetchProjetos = async () => {
    const response = await api.getAllProjetos(); // Buscando todos os projetos
    setProjetos(response.data);
  };

  const fetchGrupos = async () => {
    const response = await api.getAllGrupos(); // Buscando todos os grupos
    setGrupos(response.data);
  };

  const handleCreate = async () => {
    // Função para criar um novo projeto
    await api.createProjeto({
      nome,
      grupoId: grupoId || "", // Agora usando o grupoId selecionado
    });
    setNome(''); // Resetando o campo de nome
    setGrupoId(null); // Resetando o campo de grupoId
    fetchProjetos(); // Atualizando a lista de projetos
  };

  const handleEdit = async () => {
    // Função para editar um projeto existente
    if (editId) {
      await api.updateProjeto(editId, { nome, grupoId: grupoId || "" });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setGrupoId(null); // Resetando o campo de grupoId
      fetchProjetos(); // Atualizando a lista de projetos
    }
  };

  const handleDelete = async (id: string) => {
    // Função para excluir um projeto
    await api.deleteProjeto(id);
    fetchProjetos(); // Atualizando a lista de projetos
  };

  return (
      <ProjetosContainer>
        <Title>Projetos</Title>
        <Input
            type="text"
            value={nome}
            placeholder="Nome do Projeto"
            onChange={(e) => setNome(e.target.value)} // Atualizando o nome do projeto
        />
        <Select
            value={grupoId || ''}
            onChange={(e) => setGrupoId(e.target.value)} // Atualizando o ID do grupo selecionado
        >
          <option value="" disabled>Selecione o Grupo</option>
          {grupos.map((grupo: any) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nome}
              </option>
          ))}
        </Select>
        <Button onClick={editId ? handleEdit : handleCreate}>
          {editId ? 'Salvar Alterações' : 'Adicionar Projeto'}
        </Button>
        <Table>
          <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>ID do Grupo</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
          </thead>
          <tbody>
          {projetos.map((projeto: any) => (
              <TableRow key={projeto.id}>
                <TableData>{projeto.nome}</TableData>
                <TableData>{projeto.grupoId}</TableData>
                <TableData>
                  <Button onClick={() => {
                    // Preparando para editar
                    setEditId(projeto.id);
                    setNome(projeto.nome);
                    setGrupoId(projeto.grupoId);
                  }}>Editar</Button>
                  {/*<Button onClick={() => handleDelete(projeto.id)}>Excluir</Button>*/}
                </TableData>
              </TableRow>
          ))}
          </tbody>
        </Table>
      </ProjetosContainer>
  );
};

export default ProjetosPage;
