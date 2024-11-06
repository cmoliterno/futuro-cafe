import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const CultivaresContainer = styled.div`
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

const CultivaresPage: React.FC = () => {
  const [cultivares, setCultivares] = useState([]);
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [editId, setEditId] = useState<number | null>(null); // ID para editar

  useEffect(() => {
    fetchCultivares();
  }, []);

  const fetchCultivares = async () => {
    const response = await api.getAllCultivares(); // Buscando todos os cultivares
    setCultivares(response.data);
  };

  const handleCreate = async () => {
    // Função para criar um novo cultivar
    await api.createCultivar({ nome, especie });
    setNome(''); // Resetando o campo de nome
    setEspecie(''); // Resetando o campo de espécie
    fetchCultivares(); // Atualizando a lista de cultivares
  };

  const handleEdit = async () => {
    // Função para editar um cultivar existente
    if (editId) {
      await api.updateCultivar(editId, { nome, especie });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
      setEspecie(''); // Resetando o campo de espécie
      fetchCultivares(); // Atualizando a lista de cultivares
    }
  };

  const handleDelete = async (id: number) => {
    // Função para excluir um cultivar
    await api.deleteCultivar(id);
    fetchCultivares(); // Atualizando a lista de cultivares
  };

  return (
    <CultivaresContainer>
      <Title>Cultivares</Title>
      <Input
        type="text"
        value={nome}
        placeholder="Nome do Cultivar"
        onChange={(e) => setNome(e.target.value)} // Atualizando o nome
      />
      <Input
        type="text"
        value={especie}
        placeholder="Espécie"
        onChange={(e) => setEspecie(e.target.value)} // Atualizando a espécie
      />
      <Button onClick={editId ? handleEdit : handleCreate}>
        {editId ? 'Salvar Alterações' : 'Adicionar Cultivar'} 
      </Button>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Espécie</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {cultivares.map((cultivar: any) => (
            <TableRow key={cultivar.id}>
              <TableData>{cultivar.nome}</TableData>
              <TableData>{cultivar.especie}</TableData>
              <TableData>
                <Button onClick={() => {
                  // Preparando para editar
                  setEditId(cultivar.id);
                  setNome(cultivar.nome);
                  setEspecie(cultivar.especie);
                }}>Editar</Button>
                <Button onClick={() => handleDelete(cultivar.id)}>Excluir</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </CultivaresContainer>
  );
};

export default CultivaresPage;
