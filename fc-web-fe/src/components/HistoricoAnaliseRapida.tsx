import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrash, FaExclamationCircle, FaChartBar, FaAngleLeft, FaAngleRight, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import api from "../services/api";
import {
  Card, CardHeader, CardBody, FormGroup, Label, Input, ButtonGroup, Button,
  Table, Th, Td, EmptyState, FilterContainer, FilterInput, DateInput, 
  LoadingOverlay, SpinnerIcon, StatusCard
} from "./ComparacaoRapidaStyles";

interface HistoricoAnaliseRapidaProps {
  onViewAnalysis: (analiseId: string) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
};

const HistoricoAnaliseRapida: React.FC<HistoricoAnaliseRapidaProps> = ({ onViewAnalysis }) => {
  const [analiseHistorico, setAnaliseHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Definindo datas padrão: primeiro dia do mês e dia atual
  const getPrimeirodiaMes = () => {
    const now = new Date();
    const primeiroDia = new Date(now.getFullYear(), now.getMonth(), 1);
    return primeiroDia.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  const getDataAtual = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  const [filtroDataInicio, setFiltroDataInicio] = useState(getPrimeirodiaMes);
  const [filtroDataFim, setFiltroDataFim] = useState(getDataAtual);
  
  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState<{
    key: 'createdAt' | 'nomeGrupo' | 'status';
    direction: 'asc' | 'desc';
  }>({
    key: 'createdAt',
    direction: 'desc'
  });

  // Função para carregar o histórico de análises
  const carregarHistorico = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // Montar parâmetros de filtro
      const filtros: any = {
        page,
        limit: itemsPerPage,
        sortBy: sortConfig.key,
        sortDirection: sortConfig.direction
      };
      
      if (filtroDataInicio) {
        filtros.dataInicio = filtroDataInicio;
        console.log("Data início para filtro:", filtroDataInicio);
      }

      if (filtroDataFim) {
        filtros.dataFim = filtroDataFim;
        console.log("Data fim para filtro:", filtroDataFim);
      }
      
      console.log("Buscando histórico com filtros:", JSON.stringify(filtros, null, 2));
      console.log("Data e hora atual (local):", new Date().toLocaleString());
      console.log("Data e hora atual (UTC):", new Date().toISOString());
      
      // Chamada à API para buscar histórico
      const response = await api.getAnaliseRapidaHistorico(filtros);
      
      console.log("Resposta do histórico:", response.data);
      
      if (response.data.items?.length === 0 && filtroDataFim === getDataAtual()) {
        // Se o dia selecionado for hoje e não houver resultados, mostra mensagem específica
        console.log("Nenhum resultado para hoje, verificando se há registros recentes");
      }
      
      setAnaliseHistorico(response.data.items || []);
      setTotalPages(Math.max(1, Math.ceil((response.data.total || 0) / itemsPerPage)));
      setCurrentPage(page);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setError("Não foi possível carregar o histórico de análises.");
    } finally {
      setLoading(false);
    }
  };

  // Carregar histórico na montagem do componente
  useEffect(() => {
    carregarHistorico();
  }, [sortConfig]);

  // Função para excluir uma análise
  const handleDeleteAnalise = async (analiseId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta análise?")) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Tentando excluir análise ${analiseId}`);
      const response = await api.deleteAnaliseRapida(analiseId);
      console.log(`Resposta da exclusão:`, response.data);
      
      // Atualiza a lista após exclusão
      carregarHistorico(currentPage);
      
      // Exibe mensagem de sucesso temporária
      setError(null);
    } catch (error: any) {
      console.error("Erro ao excluir análise:", error);
      
      // Mensagem de erro mais informativa
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Erro desconhecido";
      
      if (statusCode === 403) {
        setError(`Não foi possível excluir a análise selecionada. Erro de permissão (403): ${errorMessage}`);
      } else if (statusCode === 404) {
        setError(`Análise não encontrada (404): ${errorMessage}`);
      } else {
        setError(`Não foi possível excluir a análise. ${statusCode ? `(${statusCode}) ` : ''}${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    setCurrentPage(1);
    carregarHistorico(1);
  };
  
  // Função para filtrar apenas a data atual
  const filtrarHoje = () => {
    const hoje = new Date().toISOString().split('T')[0];
    console.log("Definindo filtro para hoje:", hoje);
    setFiltroDataInicio(hoje);
    setFiltroDataFim(hoje);
    setCurrentPage(1);
    
    // Aplicamos diretamente o filtro ao invés de usar setTimeout
    const filtros: any = {
      page: 1,
      limit: itemsPerPage,
      sortBy: sortConfig.key,
      sortDirection: sortConfig.direction,
      dataInicio: hoje,
      dataFim: hoje
    };
    
    console.log("Aplicando filtro para hoje:", filtros);
    
    setLoading(true);
    setError(null);
    
    api.getAnaliseRapidaHistorico(filtros)
      .then(response => {
        console.log("Resposta para filtro de hoje:", response.data);
        setAnaliseHistorico(response.data.items || []);
        setTotalPages(Math.max(1, Math.ceil((response.data.total || 0) / itemsPerPage)));
        setCurrentPage(1);
      })
      .catch(error => {
        console.error("Erro ao filtrar por data de hoje:", error);
        setError("Não foi possível carregar o histórico de análises de hoje.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Função para ordenar colunas
  const handleSort = (key: 'createdAt' | 'nomeGrupo' | 'status') => {
    const direction = sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ key, direction });
  };
  
  // Função para navegar entre páginas
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    carregarHistorico(page);
  };
  
  // Função para mudar itens por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    carregarHistorico(1);
  };

  return (
    <>
      {/* Overlay de carregamento */}
      <LoadingOverlay isVisible={loading}>
        <SpinnerIcon />
      </LoadingOverlay>
      
      {/* Exibir mensagens de erro */}
      {error && (
        <Card style={{ marginBottom: '1rem', backgroundColor: '#FFEBEE', borderLeft: '4px solid #D32F2F' }}>
          <CardBody style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaExclamationCircle color="#D32F2F" />
            <span style={{ color: '#D32F2F' }}>{error}</span>
          </CardBody>
        </Card>
      )}
      
      {/* Filtros */}
      <Card>
        <CardHeader>Filtros</CardHeader>
        <CardBody>
          <FilterContainer>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="filtroDataInicio">Data Inicial</Label>
              <DateInput
                id="filtroDataInicio"
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="filtroDataFim">Data Final</Label>
              <DateInput
                id="filtroDataFim"
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup style={{ alignSelf: 'flex-end', display: 'flex', gap: '10px' }}>
              <Button onClick={filtrarHoje} style={{ backgroundColor: '#8D6E63' }}>
                Apenas Hoje
              </Button>
              <Button onClick={aplicarFiltros}>
                <FaSearch style={{ marginRight: '5px' }} />
                Aplicar Filtros
              </Button>
            </FormGroup>
          </FilterContainer>
          
          <div style={{ fontSize: '12px', color: '#666', textAlign: 'right', marginTop: '5px' }}>
            Fuso horário: {Intl.DateTimeFormat().resolvedOptions().timeZone} ({new Date().getTimezoneOffset() / -60}h)
          </div>
        </CardBody>
      </Card>
      
      {/* Tabela de Resultados */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Histórico de Análises</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem' }}>Itens por página:</span>
              <select 
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
                style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc' 
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loading && analiseHistorico.length === 0 ? (
            <StatusCard>Carregando histórico...</StatusCard>
          ) : analiseHistorico.length === 0 ? (
            <EmptyState>
              Nenhuma análise encontrada. 
              {filtroDataInicio || filtroDataFim ? 
                " Tente ajustar os filtros de busca." : 
                " Realize uma nova análise para começar."}
            </EmptyState>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th 
                      onClick={() => handleSort('createdAt')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Data
                        {sortConfig.key === 'createdAt' && (
                          sortConfig.direction === 'desc' ? 
                            <FaSortAmountDown style={{ marginLeft: '5px' }} /> : 
                            <FaSortAmountUp style={{ marginLeft: '5px' }} />
                        )}
                      </div>
                    </Th>
                    <Th 
                      onClick={() => handleSort('nomeGrupo')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Descrição
                        {sortConfig.key === 'nomeGrupo' && (
                          sortConfig.direction === 'desc' ? 
                            <FaSortAmountDown style={{ marginLeft: '5px' }} /> : 
                            <FaSortAmountUp style={{ marginLeft: '5px' }} />
                        )}
                      </div>
                    </Th>
                    <Th 
                      onClick={() => handleSort('status')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Status
                        {sortConfig.key === 'status' && (
                          sortConfig.direction === 'desc' ? 
                            <FaSortAmountDown style={{ marginLeft: '5px' }} /> : 
                            <FaSortAmountUp style={{ marginLeft: '5px' }} />
                        )}
                      </div>
                    </Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {analiseHistorico.map((analise) => (
                    <tr key={analise.id}>
                      <Td>{formatDate(analise.createdAt)}</Td>
                      <Td>{analise.nomeGrupo}</Td>
                      <Td>
                        <span 
                          style={{ 
                            color: analise.status === "COMPLETED" ? "#388E3C" : 
                                  analise.status === "ERROR" ? "#D32F2F" : "#FFA000",
                            fontWeight: 500
                          }}
                        >
                          {analise.status === "COMPLETED" ? "Concluído" : 
                          analise.status === "ERROR" ? "Erro" : "Processando"}
                        </span>
                      </Td>
                      <Td>
                        <ButtonGroup>
                          {analise.status === "COMPLETED" && (
                            <Button 
                              onClick={() => onViewAnalysis(analise.id)}
                              style={{ padding: '6px 12px' }}
                              title="Visualizar gráfico"
                            >
                              <FaChartBar />
                            </Button>
                          )}
                          <Button 
                            variant="danger" 
                            onClick={() => handleDeleteAnalise(analise.id)}
                            style={{ padding: '6px 12px' }}
                            title="Excluir análise"
                          >
                            <FaTrash />
                          </Button>
                        </ButtonGroup>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {/* Paginação */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '20px' 
              }}>
                <div>
                  Mostrando {analiseHistorico.length} de {totalPages * itemsPerPage} resultados
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: '6px 12px' }}
                  >
                    <FaAngleLeft />
                  </Button>
                  <span>Página {currentPage} de {totalPages}</span>
                  <Button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ padding: '6px 12px' }}
                  >
                    <FaAngleRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default HistoricoAnaliseRapida; 