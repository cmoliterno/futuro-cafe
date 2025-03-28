import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaSortAlphaDown, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../services/api';

const CultivaresContainer = styled.div`
  padding: 30px;
  background-color: #EEDCC8;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

const Title = styled.h1`
  color: #230C02;
  margin-bottom: 25px;
  text-align: center;
`;

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  background-color: #F5EEE6;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  flex: 1;
  min-width: 200px;
  
  &:focus {
    border-color: #047502;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #047502;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #035f02;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
  
  &:focus {
    border-color: #047502;
    outline: none;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: #666;
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

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.color || '#047502'};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  font-size: 14px;
  gap: 6px;

  &:hover {
    opacity: 0.9;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SuccessMessage = styled.div`
  background-color: #e7f7e8;
  border: 1px solid #d4ecd5;
  color: #27ae60;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background-color: #fce4e4;
  border: 1px solid #f7d7d7;
  color: #e74c3c;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  flex: 1;
  min-width: 200px;
  
  &:focus {
    border-color: #047502;
    outline: none;
  }
`;

// Função utilitária para extrair mensagens de erro da resposta da API
const getErrorMessage = (error: any): string => {
  if (!error.response || !error.response.data) {
    return "Erro ao processar a solicitação";
  }
  
  const errorData = error.response.data;
  let errorMessage = errorData.message || `Erro: ${error.response.status}`;
  
  // Extrair detalhes de validação
  if (errorData.error && errorData.error.errors && errorData.error.errors.length > 0) {
    const validationErrors = errorData.error.errors.map((e: any) => e.message).join(', ');
    errorMessage += `: ${validationErrors}`;
  }
  
  return errorMessage;
};

const CultivaresPage: React.FC = () => {
  // Estados
  const [cultivares, setCultivares] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [especies, setEspecies] = useState<any[]>([]);
  const [novaEspecie, setNovaEspecie] = useState('');
  const [mostrarNovaEspecie, setMostrarNovaEspecie] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nome?: string; especie?: string; novaEspecie?: string }>({});
  const [sortConfig, setSortConfig] = useState({
    key: 'nome',
    direction: 'asc'
  });

  // Carregar cultivares e espécies ao iniciar
  useEffect(() => {
    fetchCultivares();
    fetchEspecies();
  }, []);

  // Buscar todas as espécies de cultivares
  const fetchEspecies = async () => {
    try {
      const response = await api.getAllCultivarEspecies();
      console.log("Espécies obtidas:", response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Ordenar as espécies por nome
        const sortedEspecies = response.data.sort((a, b) => 
          a.nome.localeCompare(b.nome));
        setEspecies(sortedEspecies);
      } else {
        setEspecies([]);
      }
    } catch (err) {
      console.error('Erro ao buscar espécies:', err);
      setEspecies([]);
    }
  };

  // Buscar todos os cultivares
  const fetchCultivares = async () => {
    try {
      setLoading(true);
      const response = await api.getAllCultivares();
      console.log("Cultivares obtidos (resposta completa):", response);
      console.log("Estrutura do primeiro cultivar:", response.data[0] ? JSON.stringify(response.data[0], null, 2) : "Nenhum cultivar encontrado");
      
      // Os cultivares já vêm ordenados do backend
      setCultivares(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar cultivares:', err);
      setError(getErrorMessage(err as any));
      setLoading(false);
    }
  };

  // Filtrar cultivares com base no termo de busca
  const filteredCultivares = cultivares.filter(cultivar => 
    cultivar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cultivar.cultivarEspecie && cultivar.cultivarEspecie.nome && 
     cultivar.cultivarEspecie.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Validar campos do formulário
  const validateForm = () => {
    const newErrors: { nome?: string; especie?: string } = {};
    let isValid = true;

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    if (!especie) {
      newErrors.especie = 'Espécie é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Criar novo cultivar
  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Formatação dos dados conforme esperado pelo backend
      const cultivarData = {
        nome: nome.trim(),
        especie: especie.trim(),  // Este campo é usado para encontrar ou criar a espécie
        mantenedor: "Não especificado",  // Campo obrigatório conforme DDL
        registro: `REG-${new Date().getTime()}` // Campo obrigatório conforme DDL
      };
      
      console.log("Enviando dados:", cultivarData);
      
      const response = await api.createCultivar(cultivarData);
      console.log("Resposta:", response);
      
      setNome('');
      setEspecie('');
      fetchCultivares();
      setSuccess('Cultivar criado com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Erro ao criar cultivar:', err);
      setSuccess('');
      
      if (err.response) {
        console.log('Resposta de erro:', err.response);
        setError(getErrorMessage(err));
      } else if (err.request) {
        setError('Erro de comunicação com o servidor. Verifique sua conexão.');
      } else {
        setError(`Erro ao criar cultivar: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Editar cultivar existente
  const handleEdit = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (editId) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        
        // Formatação dos dados conforme esperado pelo backend
        const cultivarData = {
          nome: nome.trim(),
          especie: especie.trim(),  // Este campo é usado para encontrar ou criar a espécie
          mantenedor: "Não especificado", 
          registro: `REG-${editId}`
        };
        
        console.log("Enviando dados para atualização:", cultivarData);
        
        await api.updateCultivar(editId, cultivarData);
        setEditId(null);
        setNome('');
        setEspecie('');
        fetchCultivares();
        setSuccess('Cultivar atualizado com sucesso!');
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err: any) {
        console.error('Erro ao atualizar cultivar:', err);
        setSuccess('');
        
        if (err.response) {
          console.log('Resposta de erro:', err.response);
          setError(getErrorMessage(err));
        } else if (err.request) {
          setError('Erro de comunicação com o servidor. Verifique sua conexão.');
        } else {
          setError(`Erro ao atualizar cultivar: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Excluir cultivar
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cultivar?')) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        
        await api.deleteCultivar(id);
        fetchCultivares();
        setSuccess('Cultivar excluído com sucesso!');
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err: any) {
        console.error('Erro ao excluir cultivar:', err);
        setSuccess('');
        
        if (err.response) {
          console.log('Resposta de erro:', err.response);
          setError(getErrorMessage(err));
        } else if (err.request) {
          setError('Erro de comunicação com o servidor. Verifique sua conexão.');
        } else {
          setError(`Erro ao excluir cultivar: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Preparar formulário para edição
  const prepareForEdit = (cultivar: any) => {
    console.log("Preparando para editar cultivar:", cultivar);
    setEditId(cultivar.id);
    setNome(cultivar.nome);
    
    // Verificar a espécie do cultivar
    if (cultivar.cultivarEspecie && cultivar.cultivarEspecie.id) {
      // Se tiver o objeto cultivarEspecie com id
      setEspecie(cultivar.cultivarEspecie.id.toString());
    } else if (cultivar.cultivarEspecieId) {
      // Se tiver apenas o ID da espécie
      setEspecie(cultivar.cultivarEspecieId.toString());
    } else {
      // Caso não tenha espécie definida
      setEspecie('');
    }
    
    setError('');
    setErrors({});
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditId(null);
    setNome('');
    setEspecie('');
    setError('');
    setErrors({});
  };

  // Adicionar nova espécie
  const handleAddEspecie = async () => {
    if (!novaEspecie.trim()) {
      setErrors({...errors, novaEspecie: 'Nome da espécie é obrigatório'});
      return;
    }

    try {
      setLoading(true);
      
      // Verificar se a espécie já existe
      const especieExistente = especies.find(e => 
        e.nome.toLowerCase() === novaEspecie.trim().toLowerCase()
      );
      
      if (especieExistente) {
        setEspecie(especieExistente.id.toString());
        setNovaEspecie('');
        setMostrarNovaEspecie(false);
        setLoading(false);
        return;
      }
      
      // Criar nova espécie diretamente através do cultivar
      const cultivarData = {
        nome: `temp_${Date.now()}`, // Nome temporário
        especie: novaEspecie.trim(),
        mantenedor: "Temporário",
        registro: `REG-${Date.now()}`
      };
      
      // Criar um cultivar temporário para registrar a espécie
      await api.createCultivar(cultivarData);
      
      // Recarregar as espécies
      await fetchEspecies();
      
      // Buscar a nova espécie criada
      const novaEspecieObj = especies.find(e => 
        e.nome.toLowerCase() === novaEspecie.trim().toLowerCase()
      );
      
      if (novaEspecieObj) {
        setEspecie(novaEspecieObj.id.toString());
      }
      
      setNovaEspecie('');
      setMostrarNovaEspecie(false);
      setSuccess('Espécie adicionada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao adicionar espécie:', err);
      setError(getErrorMessage(err as any));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedCultivares = [...cultivares].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setCultivares(sortedCultivares);
  };

  return (
    <CultivaresContainer>
      <Title>Gerenciamento de Cultivares</Title>
      
      {error && <ErrorMessage><FaTimes style={{ marginRight: '8px' }}/>{error}</ErrorMessage>}
      {success && <SuccessMessage><FaCheck style={{ marginRight: '8px' }}/>{success}</SuccessMessage>}
      
      <FormContainer>
        <FormField>
          <Label>Nome*</Label>
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do cultivar"
            style={errors.nome ? { borderColor: '#e74c3c' } : {}}
          />
          {errors.nome && <ErrorText>{errors.nome}</ErrorText>}
        </FormField>
        
        <FormField>
          <Label>Espécie*</Label>
          {mostrarNovaEspecie ? (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Input
                  type="text"
                  value={novaEspecie}
                  onChange={(e) => setNovaEspecie(e.target.value)}
                  placeholder="Nome da nova espécie"
                  style={errors.novaEspecie ? { borderColor: '#e74c3c' } : {}}
                />
                <Button 
                  onClick={handleAddEspecie} 
                  disabled={loading}
                  style={{ backgroundColor: '#985E3B', whiteSpace: 'nowrap' }}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                  onClick={() => {
                    setMostrarNovaEspecie(false);
                    setNovaEspecie('');
                    setErrors({...errors, novaEspecie: undefined});
                  }}
                  style={{ backgroundColor: '#7f8c8d', whiteSpace: 'nowrap' }}
                >
                  Cancelar
                </Button>
              </div>
              {errors.novaEspecie && <ErrorText>{errors.novaEspecie}</ErrorText>}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Select
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
                style={{
                  ...(errors.especie ? { borderColor: '#e74c3c' } : {}),
                  flex: 1
                }}
              >
                <option value="">Selecione uma espécie</option>
                {especies.map(esp => (
                  <option key={esp.id} value={esp.id}>{esp.nome}</option>
                ))}
              </Select>
              <Button 
                onClick={() => setMostrarNovaEspecie(true)}
                style={{ backgroundColor: '#985E3B', whiteSpace: 'nowrap' }}
              >
                Nova Espécie
              </Button>
            </div>
          )}
          {errors.especie && <ErrorText>{errors.especie}</ErrorText>}
        </FormField>
        
        <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end', marginTop: '10px' }}>
          {editId ? (
            <>
              <Button onClick={handleEdit} disabled={loading} style={{ backgroundColor: '#3498db' }}>
                {loading ? 'Salvando...' : 'Atualizar Cultivar'}
              </Button>
              <Button onClick={cancelEdit} style={{ backgroundColor: '#985E3B' }}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={handleCreate} disabled={loading} style={{ backgroundColor: '#047502' }}>
              {loading ? 'Salvando...' : 'Adicionar Cultivar'}
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
            placeholder="Buscar cultivares por nome ou espécie..."
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
            <Th onClick={() => handleSort('especie')} className={sortConfig.key === 'especie' ? `sorted-${sortConfig.direction}` : ''}>
              Espécie
            </Th>
            <Th onClick={() => handleSort('registro')} className={sortConfig.key === 'registro' ? `sorted-${sortConfig.direction}` : ''}>
              Registro
            </Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {filteredCultivares.map(cultivar => (
            <tr key={cultivar.id}>
              <Td>{cultivar.nome}</Td>
              <Td>{cultivar.cultivarEspecie && cultivar.cultivarEspecie.nome ? cultivar.cultivarEspecie.nome : 'Não especificada'}</Td>
              <Td>{cultivar.registro || 'Não registrado'}</Td>
              <Td>
                <ActionButtonGroup>
                  <ActionButton 
                    onClick={() => prepareForEdit(cultivar)}
                    title="Editar cultivar"
                    color="#3498db"
                  >
                    <FaEdit /> Editar
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleDelete(cultivar.id)}
                    title="Excluir cultivar"
                    color="#e74c3c"
                  >
                    <FaTrash /> Excluir
                  </ActionButton>
                </ActionButtonGroup>
              </Td>
            </tr>
          ))}
          {filteredCultivares.length === 0 && (
            <tr>
              <Td colSpan={4} style={{ textAlign: 'center' }}>
                {loading ? 'Carregando...' : 'Nenhum cultivar encontrado.'}
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </CultivaresContainer>
  );
};

export default CultivaresPage;
