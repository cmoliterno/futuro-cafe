import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaSort, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSearch, FaSortAlphaDown } from 'react-icons/fa';
import api from '../services/api';

const FazendasContainer = styled.div`
  padding: var(--spacing-xl);
  background-color: var(--color-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  margin: var(--spacing-md);
`;

const Title = styled.h1`
  color: var(--color-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
`;

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 250px;
`;

const Label = styled.label`
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--color-gray-700);
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  
  &:focus {
    border-color: var(--color-secondary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: bold;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-button);
  
  &:hover {
    background-color: var(--color-secondary-dark);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
    transform: none;
  }
`;

const EditButton = styled(Button)`
  background-color: var(--color-info);
  
  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled(Button)`
  background-color: var(--color-error);
  
  &:hover {
    background-color: #c0392b;
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--color-accent);
  
  &:hover {
    background-color: var(--color-accent-dark);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  padding: 12px 12px 12px 40px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  width: 100%;
  
  &:focus {
    border-color: var(--color-secondary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: var(--color-gray-500);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const Th = styled.th`
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 2px solid var(--color-gray-300);
  color: var(--color-gray-700);
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-gray-100);
  }
  
  &::after {
    content: '↕️';
    margin-left: 5px;
    opacity: 0.5;
  }
  
  &.sorted-asc::after {
    content: '↑';
    opacity: 1;
  }
  
  &.sorted-desc::after {
    content: '↓';
    opacity: 1;
  }
`;

const Td = styled.td`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-gray-200);
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: var(--border-radius-md);
  color: white;
  cursor: pointer;
  border: none;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-button);

  &:hover {
    transform: translateY(-2px);
  }

  &:last-child {
    margin-right: 0;
  }
`;

const SuccessMessage = styled.div`
  background-color: var(--color-success-light);
  border: 1px solid var(--color-success);
  color: var(--color-success);
  padding: 15px;
  border-radius: var(--border-radius-md);
  margin-bottom: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--color-error-light);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: 15px;
  border-radius: var(--border-radius-md);
  margin-bottom: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const FazendasPage: React.FC = () => {
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'nome',
    direction: 'asc'
  });

  useEffect(() => {
    fetchFazendas();
  }, []);

  const fetchFazendas = async () => {
    try {
      setLoading(true);
      const response = await api.getAllFazendas();
      setFazendas(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar fazendas:', err);
      setError('Erro ao carregar fazendas. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Filtrar fazendas com base no termo de busca
  const filteredFazendas = fazendas.filter(fazenda => 
    fazenda.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!nome.trim()) {
      setError('Nome da fazenda é obrigatório');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await api.createFazenda({ nome: nome.trim() });
      setNome('');
      fetchFazendas();
      setSuccess('Fazenda criada com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Erro ao criar fazenda:', err);
      setError('Erro ao criar fazenda. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!nome.trim()) {
      setError('Nome da fazenda é obrigatório');
      return;
    }
    
    if (editId) {
      try {
        setLoading(true);
        setError('');
        await api.updateFazenda(editId, { nome: nome.trim() });
        setEditId(null);
        setNome('');
        fetchFazendas();
        setSuccess('Fazenda atualizada com sucesso!');
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Erro ao atualizar fazenda:', err);
        setError('Erro ao atualizar fazenda. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fazenda?')) {
      try {
        setLoading(true);
        setError('');
        await api.deleteFazenda(id);
        fetchFazendas();
        setSuccess('Fazenda excluída com sucesso!');
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Erro ao excluir fazenda:', err);
        setError('Erro ao excluir fazenda. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedFazendas = [...fazendas].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFazendas(sortedFazendas);
  };

  const cancelEdit = () => {
    setEditId(null);
    setNome('');
    setError('');
  };

  return (
    <FazendasContainer>
      <Title>Gerenciamento de Fazendas</Title>
      
      {error && <ErrorMessage><FaTimes />{error}</ErrorMessage>}
      {success && <SuccessMessage><FaCheck />{success}</SuccessMessage>}
      
      <FormContainer>
        <FormField>
          <Label>Nome da Fazenda</Label>
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da fazenda"
          />
        </FormField>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          {editId ? (
            <>
              <EditButton onClick={handleEdit} disabled={loading}>
                {loading ? 'Salvando...' : 'Atualizar Fazenda'}
              </EditButton>
              <CancelButton onClick={cancelEdit}>
                Cancelar
              </CancelButton>
            </>
          ) : (
            <Button onClick={handleCreate} disabled={loading}>
              <FaPlus />
              {loading ? 'Salvando...' : 'Adicionar Fazenda'}
            </Button>
          )}
        </div>
      </FormContainer>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar fazendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </div>
      
      <Table>
        <thead>
          <tr>
            <Th onClick={() => handleSort('nome')} className={sortConfig.key === 'nome' ? `sorted-${sortConfig.direction}` : ''}>
              Nome
            </Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {filteredFazendas.map(fazenda => (
            <tr key={fazenda.id}>
              <Td>{fazenda.nome}</Td>
              <Td>
                <ActionButton 
                  as={EditButton} 
                  onClick={() => {
                    setEditId(fazenda.id);
                    setNome(fazenda.nome);
                  }}
                >
                  <FaEdit /> Editar
                </ActionButton>
                <ActionButton 
                  as={DeleteButton} 
                  onClick={() => handleDelete(fazenda.id)}
                >
                  <FaTrash /> Excluir
                </ActionButton>
              </Td>
            </tr>
          ))}
          {filteredFazendas.length === 0 && (
            <tr>
              <Td colSpan={2} style={{ textAlign: 'center' }}>
                {loading ? 'Carregando...' : 'Nenhuma fazenda encontrada.'}
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </FazendasContainer>
  );
};

export default FazendasPage;
