import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Container, Card, CardHeader, CardBody, Alert } from '../components/styled';

const Row = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Column = styled.div`
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-size: 14px;
  min-height: 120px;
  
  option {
    padding: 8px;
    color: #333;
    background-color: white;
    
    &:checked {
      background-color: #007bff;
      color: white;
    }
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #218838;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// Interfaces
interface Fazenda {
  Id: string;
  Nome: string;
}

interface Talhao {
  Id: string;
  Nome: string;
  FazendaId: string;
}

const RelatoriosPage: React.FC = () => {
  // Estados
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [selectedFazendas, setSelectedFazendas] = useState<string[]>([]);
  const [selectedTalhoes, setSelectedTalhoes] = useState<string[]>([]);
  const [anoInicio, setAnoInicio] = useState<string>('');
  const [anoFim, setAnoFim] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissao, setPermissao] = useState<boolean>(false);
  const [permissaoCarregada, setPermissaoCarregada] = useState<boolean>(false);

  // Verificar permissão ao carregar a página
  useEffect(() => {
    const verificarPermissao = async () => {
      try {
        await api.verificarPermissaoRelatorios();
        setPermissao(true);
        setPermissaoCarregada(true);
        carregarFazendas();
      } catch (error) {
        console.error('Erro ao verificar permissão:', error);
        setPermissao(false);
        setPermissaoCarregada(true);
      }
    };

    verificarPermissao();
  }, []);

  // Carregar fazendas
  const carregarFazendas = async () => {
    try {
      const response = await api.getFazendasParaRelatorio();
      setFazendas(response.data);
    } catch (error) {
      console.error('Erro ao carregar fazendas:', error);
      setError('Não foi possível carregar as fazendas.');
    }
  };

  // Carregar talhões quando as fazendas selecionadas mudarem
  useEffect(() => {
    const carregarTalhoes = async () => {
      if (selectedFazendas.length > 0) {
        try {
          const response = await api.getTalhoesPorFazendaParaRelatorio(selectedFazendas);
          setTalhoes(response.data);
        } catch (error) {
          console.error('Erro ao carregar talhões:', error);
          setError('Não foi possível carregar os talhões.');
        }
      } else {
        setTalhoes([]);
      }
    };

    carregarTalhoes();
  }, [selectedFazendas]);

  // Handlers
  const handleFazendaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedFazendas(selectedOptions);
    setSelectedTalhoes([]); // Limpa os talhões selecionados quando mudar as fazendas
  };

  const handleTalhaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedTalhoes(selectedOptions);
  };

  // Gerar relatório
  const handleGerarRelatorio = async () => {
    setLoading(true);
    setError(null);

    // Validações básicas
    if (anoInicio && anoFim && parseInt(anoInicio) > parseInt(anoFim)) {
      setError('O ano inicial não pode ser maior que o ano final.');
      setLoading(false);
      return;
    }

    try {
      const params = {
        fazendaIds: selectedFazendas,
        talhaoIds: selectedTalhoes,
        dataInicio: anoInicio || undefined,
        dataFim: anoFim || undefined
      };

      const response = await api.gerarRelatorio(params);
      
      // Criar um blob a partir da resposta
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      
      // Criar um link para download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio-talhoes.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Limpar o URL
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 0);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setError('Ocorreu um erro ao gerar o relatório. Tente novamente.');
      setLoading(false);
    }
  };

  if (!permissaoCarregada) {
    return (
      <Container>
        <Alert variant="info">Verificando permissões...</Alert>
      </Container>
    );
  }

  if (!permissao) {
    return (
      <Container>
        <Alert variant="danger">
          Você não possui permissão para acessar esta página.
          Entre em contato com o administrador para obter acesso.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 style={{ marginBottom: '20px' }}>Relatórios de Talhões</h1>
      
      <Card>
        <CardHeader>Filtros</CardHeader>
        <CardBody>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <form>
            <Row>
              <Column>
                <FormGroup>
                  <Label htmlFor="fazendas">Fazendas</Label>
                  <Select 
                    id="fazendas"
                    multiple
                    size={5}
                    onChange={handleFazendaChange}
                    value={selectedFazendas}
                  >
                    {fazendas.map(fazenda => (
                      <option key={fazenda.Id} value={fazenda.Id}>
                        {fazenda.Nome}
                      </option>
                    ))}
                  </Select>
                  <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                    Segure CTRL para selecionar múltiplas fazendas
                  </small>
                </FormGroup>
              </Column>
              
              <Column>
                <FormGroup>
                  <Label htmlFor="talhoes">Talhões</Label>
                  <Select 
                    id="talhoes"
                    multiple
                    size={5}
                    onChange={handleTalhaoChange}
                    value={selectedTalhoes}
                    disabled={selectedFazendas.length === 0}
                  >
                    {talhoes.map(talhao => (
                      <option key={talhao.Id} value={talhao.Id}>
                        {talhao.Nome}
                      </option>
                    ))}
                  </Select>
                  <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                    Segure CTRL para selecionar múltiplos talhões
                  </small>
                </FormGroup>
              </Column>
            </Row>

            <Row>
              <Column>
                <FormGroup>
                  <Label htmlFor="anoInicio">Ano Inicial</Label>
                  <Input
                    id="anoInicio"
                    type="number"
                    placeholder="Ex: 2020"
                    value={anoInicio}
                    onChange={(e) => setAnoInicio(e.target.value)}
                    min="1900"
                    max="2100"
                  />
                </FormGroup>
              </Column>
              
              <Column>
                <FormGroup>
                  <Label htmlFor="anoFim">Ano Final</Label>
                  <Input
                    id="anoFim"
                    type="number"
                    placeholder="Ex: 2023"
                    value={anoFim}
                    onChange={(e) => setAnoFim(e.target.value)}
                    min="1900"
                    max="2100"
                  />
                </FormGroup>
              </Column>
            </Row>

            <ButtonContainer>
              <Button
                type="button"
                disabled={loading}
                onClick={handleGerarRelatorio}
              >
                {loading ? 'Gerando...' : 'Gerar Relatório Excel'}
              </Button>
            </ButtonContainer>
          </form>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>Informações</CardHeader>
        <CardBody>
          <p>
            Este relatório permite extrair dados detalhados dos talhões e suas análises.
            Você pode filtrar por fazendas, talhões específicos e período de plantio.
          </p>
          <ul>
            <li>Selecione uma ou mais fazendas para filtrar os talhões disponíveis.</li>
            <li>Selecione um ou mais talhões específicos ou deixe em branco para incluir todos os talhões das fazendas selecionadas.</li>
            <li>Defina um período de plantio (opcional) para filtrar os dados por ano de plantio.</li>
            <li>Clique em "Gerar Relatório" para baixar os dados em formato Excel (.xlsx).</li>
          </ul>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RelatoriosPage; 