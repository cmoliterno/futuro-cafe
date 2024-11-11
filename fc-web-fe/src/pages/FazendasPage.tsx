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

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const FazendasPage: React.FC = () => {
  const [fazendas, setFazendas] = useState([]);
  const [nome, setNome] = useState('');
  const [editId, setEditId] = useState<number | null>(null); // ID para editar
  const [showModal, setShowModal] = useState(false); // Controle do modal

  useEffect(() => {
    fetchFazendas();
  }, []);

  const fetchFazendas = async () => {
    const response = await api.getAllFazendas(); // Buscando todas as fazendas
    setFazendas(response.data);

    // Verifica se não há fazendas cadastradas e exibe o modal
    if (response.data.length === 0) {
      setShowModal(true);
    }
  };

  const handleCreate = async () => {
    // Função para criar uma nova fazenda
    await api.createFazenda({ nome });
    setNome(''); // Resetando o campo de nome
    fetchFazendas(); // Atualizando a lista de fazendas
  };

  const handleEdit = async () => {
    // Função para editar uma fazenda existente
    if (editId) {
      await api.updateFazenda(editId, { nome });
      setEditId(null); // Resetando o ID de edição
      setNome(''); // Resetando o campo de nome
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
        <Button onClick={editId ? handleEdit : handleCreate}>
          {editId ? 'Salvar Alterações' : 'Adicionar Fazenda'}
        </Button>
        <Table>
          <thead>
          <tr>
            <TableHeader>Nome</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
          </thead>
          <tbody>
          {fazendas.map((fazenda: any) => (
              <TableRow key={fazenda.id}>
                <TableData>{fazenda.nome}</TableData>
                <TableData>
                  <Button onClick={() => {
                    // Preparando para editar
                    setEditId(fazenda.id);
                    setNome(fazenda.nome);
                  }}>Editar</Button>
                  <Button onClick={() => handleDelete(fazenda.id)}>Excluir</Button>
                </TableData>
              </TableRow>
          ))}
          </tbody>
        </Table>

        {/* Modal para mensagem de erro */}
        {showModal && (
            <>
              <Overlay onClick={() => setShowModal(false)} />
              <Modal>
                <h2>Nenhuma Fazenda Encontrada</h2>
                <p>É necessário cadastrar uma nova fazenda para continuar.</p>
                <Button onClick={() => setShowModal(false)}>Fechar</Button>
              </Modal>
            </>
        )}
      </FazendasContainer>
  );
};

export default FazendasPage;
