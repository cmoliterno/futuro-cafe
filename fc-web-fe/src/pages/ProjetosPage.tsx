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
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState<Date | null>(null); // Inicializando como null
  const [dataFim, setDataFim] = useState<Date | null>(null); // Inicializando como null
  const [grupoId, setGrupoId] = useState<string | null>(null); // Inicializando como null
  const [editId, setEditId] = useState<string | null>(null); // ID para editar

  useEffect(() => {
    fetchProjetos();
  }, []);

  const fetchProjetos = async () => {
    const response = await api.getAllProjetos(); // Buscando todos os projetos
    setProjetos(response.data);
  };

  const handleCreate = async () => {
    // Função para criar um novo projeto
    await api.createProjeto({
      nome,
      descricao,
      dataInicio: dataInicio ? dataInicio : new Date(), // Usando data atual se dataInicio for null
      dataFim: dataFim ? dataFim : new Date(), // Usando data atual se dataFim for null
      grupoId: grupoId ? grupoId : "0", // Usando 0 se grupoId for null
    });
    setNome(''); // Resetando o campo de nome
    setDescricao(''); // Resetando o campo de descrição
    setDataInicio(null); // Resetando o campo de data de início
    setDataFim(null); // Resetando o campo de data de fim
    setGrupoId(null); // Resetando o campo de ID do grupo
    fetchProjetos(); // Atualizando a lista de projetos
  };

  const handleEdit = async () => {
    // Função para editar um projeto existente
    if (editId) {
      await api.updateProjeto(editId, {
        nome,
        descricao,
        dataInicio: dataInicio ? dataInicio : new Date(), // Usando data atual se dataInicio for null
        dataFim: dataFim ? dataFim : new Date(), // Usando data atual se dataFim for null
        grupoId: grupoId ? grupoId : "0", // Usando 0 se grupoId for null
      });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setDescricao(''); // Resetando o campo de descrição
      setDataInicio(null); // Resetando o campo de data de início
      setDataFim(null); // Resetando o campo de data de fim
      setGrupoId(null); // Resetando o campo de ID do grupo
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
      <Input
        type="text"
        value={descricao}
        placeholder="Descrição"
        onChange={(e) => setDescricao(e.target.value)} // Atualizando a descrição
      />
      <Input
        type="date"
        value={dataInicio ? dataInicio.toISOString().split('T')[0] : ''} // Convertendo para string no formato correto
        onChange={(e) => setDataInicio(new Date(e.target.value))} // Atualizando a data de início
      />
      <Input
        type="date"
        value={dataFim ? dataFim.toISOString().split('T')[0] : ''} // Convertendo para string no formato correto
        onChange={(e) => setDataFim(new Date(e.target.value))} // Atualizando a data de fim
      />
      <Input
        type="number"
        value={grupoId || ''}
        placeholder="ID do Grupo"
        onChange={(e) => setGrupoId(e.target.value)} // Atualizando o ID do grupo
      />
      <Button onClick={editId ? handleEdit : handleCreate}>
        {editId ? 'Salvar Alterações' : 'Adicionar Projeto'}
      </Button>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Descrição</TableHeader>
            <TableHeader>Data de Início</TableHeader>
            <TableHeader>Data de Fim</TableHeader>
            <TableHeader>ID do Grupo</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {projetos.map((projeto: any) => (
            <TableRow key={projeto.id}>
              <TableData>{projeto.nome}</TableData>
              <TableData>{projeto.descricao}</TableData>
              <TableData>{new Date(projeto.dataInicio).toLocaleDateString()}</TableData>
              <TableData>{new Date(projeto.dataFim).toLocaleDateString()}</TableData>
              <TableData>{projeto.grupoId}</TableData>
              <TableData>
                <Button onClick={() => {
                  // Preparando para editar
                  setEditId(projeto.id);
                  setNome(projeto.nome);
                  setDescricao(projeto.descricao);
                  setDataInicio(new Date(projeto.dataInicio)); // Convertendo para Date
                  setDataFim(new Date(projeto.dataFim)); // Convertendo para Date
                  setGrupoId(projeto.grupoId);
                }}>Editar</Button>
                <Button onClick={() => handleDelete(projeto.id)}>Excluir</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ProjetosContainer>
  );
};

export default ProjetosPage;
