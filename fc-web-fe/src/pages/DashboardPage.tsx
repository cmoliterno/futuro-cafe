import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import OnboardingModal from '../components/OnboardingModal';
import PrevisaoColheitaGrid from '../components/PrevisaoColheitaGrid';
import { FaMapMarkedAlt, FaCalendarAlt, FaDrawPolygon, FaRegMap, FaEye, FaEyeSlash, FaChartLine, FaLeaf, FaSearchLocation, FaCalendarCheck } from 'react-icons/fa';
import '../styles/leaflet-fixes.css';

const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #EEDCC8 0%, #F5E6D3 100%);
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #2D1810;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

const Subtitle = styled.p`
  color: #5C4037;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #047502 0%, #34A853 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const CardTitle = styled.h3`
  color: #2D1810;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #047502;
  margin-top: 0.5rem;
`;

const CardTrend = styled.div<{ isPositive?: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.isPositive ? '#34A853' : '#EA4335'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const Message = styled.p`
  color: #047502;
  text-align: center;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 8px;
  margin: 15px 0;
  font-weight: 500;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  margin-top: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
`;

const QwizeLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2D1810;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #EEDCC8 0%, #F5E6D3 100%);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 24, 16, 0.1);
  }
`;

const MapSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  padding: 2rem;
  margin-top: 2rem;
`;

const MapTitle = styled.h2`
  color: #2D1810;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const MapControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: #F8F9FA;
  padding: 1.5rem;
  border-radius: 16px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #5C4037;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #DDE2E5;
  border-radius: 8px;
  background-color: white;
  color: #2D1810;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #047502;
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.1);
    outline: none;
  }
  
  &:disabled {
    background-color: #F1F3F5;
    cursor: not-allowed;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #DDE2E5;
  border-radius: 8px;
  background-color: white;
  color: #2D1810;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #047502;
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.1);
    outline: none;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #047502 0%, #34A853 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(4, 117, 2, 0.2);
  }
  
  &:disabled {
    background: #A0AEC0;
    cursor: not-allowed;
    transform: none;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #DDE2E5;
  margin: 2rem 0;
`;

const ImageLegend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: #F8F9FA;
  border-radius: 16px;
  margin-top: 2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ColorDot = styled.span<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const LegendText = styled.span`
  color: #2D1810;
  font-size: 0.9rem;
  font-weight: 500;
`;

const DataCount = styled.span`
  color: #047502;
  font-weight: 600;
  margin-left: auto;
`;

const PrevisaoSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const PrevisaoTitle = styled.h2`
  color: #2D1810;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const DashboardPage: React.FC = () => {
  const [data, setData] = useState({
    totalAnalisesMesAtual: 0,
    aumentoAnalisesRelacaoMesPassado: 0,
    totalAnalisesHoje: 0,
    totalTalhoes: 0,
  });
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Estados para o mapa
  const mapRef = useRef<HTMLDivElement>(null);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [talhoes, setTalhoes] = useState<any[]>([]);
  const [selectedFazenda, setSelectedFazenda] = useState<string>('');
  const [selectedTalhao, setSelectedTalhao] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [analises, setAnalises] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [talhaoDesenho, setTalhaoDesenho] = useState<any>(null);
  const [markersLayer, setMarkersLayer] = useState<any>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showTalhaoDesenho, setShowTalhaoDesenho] = useState<boolean>(true);
  const [analisesComGeolocalizacao, setAnalisesComGeolocalizacao] = useState<number>(0);
  const [loadingTalhoes, setLoadingTalhoes] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const estatisticasResponse = await api.getEstatisticas();
        setData(estatisticasResponse.data);
        setError('');
        
        // Verifica se o usuário já viu o onboarding
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        
        // Mostra o onboarding apenas se o usuário nunca viu
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
        
        // Carregar fazendas
        const fazendasData = await api.getAllFazendas();
        setFazendas(fazendasData.data);
        
      } catch (error: any) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setError(error.response?.data.message || 'Erro ao buscar dados do dashboard.');
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (selectedFazenda) {
      const fetchTalhoes = async () => {
        setLoadingTalhoes(true);
        try {
          const talhoesData = await api.getTalhoesByFazenda(selectedFazenda);
          setTalhoes(talhoesData.data);
        } catch (error) {
          console.error('Erro ao buscar talhões:', error);
        } finally {
          setLoadingTalhoes(false);
        }
      };
      fetchTalhoes();
    }
  }, [selectedFazenda]);

  useEffect(() => {
    if (selectedTalhao && showMap) {
      fetchTalhaoData();
    }
  }, [selectedTalhao, showMap]);

  const fetchTalhaoData = async () => {
    if (!selectedTalhao) return;
    
    try {
      // Buscar dados do talhão (incluindo o desenho)
      const talhaoData = await api.getTalhao(selectedTalhao);
      setTalhaoDesenho(talhaoData.data.TalhaoDesenho?.desenhoGeometria || null);
      
      // Buscar análises do talhão com filtro de data
      const params = {
        talhaoId: selectedTalhao,
        startDate,
        endDate
      };
      const analisesData = await api.getFilteredAnalyses(params);
      const resultado = analisesData.data.result || [];
      setAnalises(resultado);
      
      // Contar análises com geolocalização
      const analisesGeo = resultado.filter(a => a.coordenadas).length;
      setAnalisesComGeolocalizacao(analisesGeo);
      
      // Inicializar o mapa
      if (mapRef.current && !mapInstance) {
        initializeMap();
      } else if (mapInstance) {
        updateMap();
      }
    } catch (error) {
      console.error('Erro ao buscar dados do talhão:', error);
    }
  };

  const initializeMap = async () => {
    try {
      const L = await import('leaflet');
      
      if (!mapRef.current) return;
      
      // Criar mapa
      const map = L.map(mapRef.current).setView([-21.763, -43.349], 13);
      
      // Adicionar camada base do mapa (satélite)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri'
      }).addTo(map);
      
      // Criar camada para marcadores
      const markers = new L.FeatureGroup();
      map.addLayer(markers);
      
      setMapInstance(map);
      setMarkersLayer(markers);
      
      updateMap(map, markers);
      
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  };

  const updateMap = async (map = mapInstance, markers = markersLayer) => {
    if (!map || !markers) return;
    
    try {
      const L = await import('leaflet');
      
      // Limpar camadas anteriores
      markers.clearLayers();
      
      // Array para armazenar todos os pontos com coordenadas válidas
      const validPoints: [number, number][] = [];
      
      // Adicionar marcadores para cada análise - prioridade para os pontos das imagens
      analises.forEach(analise => {
        if (analise.coordenadas) {
          try {
            // Parse das coordenadas (formato: "12° 34' 56\" N,98° 76' 54\" W")
            const coordsParts = analise.coordenadas.split(',');
            if (coordsParts.length === 2) {
              const lat = convertDMSToDD(coordsParts[0]);
              const lng = convertDMSToDD(coordsParts[1]);
              
              if (!isNaN(lat) && !isNaN(lng)) {
                validPoints.push([lat, lng]);
                
                // Determinar cor do marcador com base na predominância
                let markerColor = '#FFFFFF'; // Branco padrão
                
                if (analise.cherry > analise.green && analise.cherry > analise.dry) {
                  markerColor = '#FF0000'; // Vermelho para cereja predominante
                } else if (analise.green > analise.cherry && analise.green > analise.dry) {
                  markerColor = '#00FF00'; // Verde para verde predominante
                } else if (analise.dry > analise.cherry && analise.dry > analise.green) {
                  markerColor = '#FFB700'; // Amarelo/laranja para seco predominante
                }
                
                // Criar ícone personalizado com tamanho muito maior
                const icon = L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="custom-marker" style="background-color: ${markerColor}; width: 40px; height: 40px;"></div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                });
                
                // Adicionar marcador
                const marker = L.marker([lat, lng], { icon });
                
                // Criar popup com informações da análise
                const popupContent = `
                  <div>
                    <strong>Data:</strong> ${new Date(analise.createdAt).toLocaleDateString('pt-BR')}<br>
                    <strong>Vermelhos:</strong> ${analise.cherry}<br>
                    <strong>Verdes:</strong> ${analise.green}<br>
                    <strong>Secos:</strong> ${analise.dry}<br>
                    <strong>Total:</strong> ${analise.total}<br>
                    ${analise.imagemResultadoUrl ? `<img src="${analise.imagemResultadoUrl}" style="max-width: 200px; margin-top: 10px;">` : ''}
                  </div>
                `;
                
                marker.bindPopup(popupContent);
                markers.addLayer(marker);
              }
            }
          } catch (error) {
            console.error('Erro ao processar coordenadas:', analise.coordenadas, error);
          }
        }
      });
      
      // Adicionar desenho do talhão se existir (agora depois dos marcadores) e se estiver habilitado
      if (showTalhaoDesenho && talhaoDesenho && talhaoDesenho.coordinates && talhaoDesenho.coordinates.length > 0) {
        try {
          const latlngs = talhaoDesenho.coordinates[0];
          const polygon = L.polygon(latlngs, {
            color: '#34A853',
            fillColor: '#34A853',
            fillOpacity: 0.2, // Reduzir opacidade para ver melhor os pontos
            weight: 2
          });
          markers.addLayer(polygon);
        } catch (error) {
          console.error('Erro ao processar desenho do talhão:', error);
        }
      }
      
      // Ajustar o zoom para mostrar todos os pontos marcados
      if (validPoints.length > 0) {
        // Criar um bounds com todos os pontos válidos
        const bounds = L.latLngBounds(validPoints);
        // Aplicar um zoom mais aproximado para ver melhor os pontos
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 18 });
      } else if (showTalhaoDesenho && talhaoDesenho && talhaoDesenho.coordinates && talhaoDesenho.coordinates.length > 0) {
        // Se não tiver pontos mas tiver desenho, usar o desenho
        const polygon = L.polygon(talhaoDesenho.coordinates[0]);
        map.fitBounds(polygon.getBounds(), { padding: [30, 30], maxZoom: 18 });
      } else {
        // Caso não tenha nada, manter o zoom padrão
        map.setView([-21.763, -43.349], 15);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar mapa:', error);
    }
  };

  // Função para converter coordenadas DMS (Degrees, Minutes, Seconds) para DD (Decimal Degrees)
  const convertDMSToDD = (dms: string): number => {
    // Tenta primeiro o formato padrão: "12° 34' 56\" N" ou similar
    let parts = dms.match(/(\d+)°\s*(\d+)'\s*(\d+)"?\s*([NSEW])/i);
    
    if (!parts) {
      // Tenta formato alternativo: "12.3456, -98.7654" (decimal direto)
      const decimalMatch = dms.match(/(-?\d+\.\d+)/);
      if (decimalMatch) {
        return parseFloat(decimalMatch[1]);
      }
      
      // Tenta outros formatos possíveis
      // Formato: 12°34'56"N ou 12°34'56N
      parts = dms.match(/(\d+)°(\d+)'(\d+)"?([NSEW])/i);
      if (!parts) {
        // Formato: 12.34N ou 12.34S (graus decimais com direção)
        const decWithDirMatch = dms.match(/(\d+\.\d+)([NSEW])/i);
        if (decWithDirMatch) {
          const value = parseFloat(decWithDirMatch[1]);
          const dir = decWithDirMatch[2].toUpperCase();
          return dir === 'S' || dir === 'W' ? -value : value;
        }
        return NaN;
      }
    }
    
    const degrees = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const seconds = parseInt(parts[3], 10);
    const direction = parts[4].toUpperCase();
    
    let dd = degrees + minutes/60 + seconds/3600;
    
    if (direction === 'S' || direction === 'W') {
      dd = -dd;
    }
    
    return dd;
  };

  const handleFazendaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFazenda(e.target.value);
    setSelectedTalhao('');
  };

  const handleTalhaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTalhao(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    if (field === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleToggleTalhaoDesenho = () => {
    setShowTalhaoDesenho(!showTalhaoDesenho);
    if (mapInstance && markersLayer) {
      updateMap();
    }
  };

  const handleShowMap = () => {
    setShowMap(true);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    // Marca que o usuário já viu o onboarding
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <>
      <DashboardContainer>
        <DashboardHeader>
          <Title>Dashboard</Title>
          <Subtitle>Acompanhe as métricas e previsões da sua lavoura em tempo real</Subtitle>
        </DashboardHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Stats>
          <Card>
            <CardHeader>
              <CardIcon>
                <FaLeaf />
              </CardIcon>
              <CardTitle>Total de Talhões</CardTitle>
            </CardHeader>
            <CardValue>{data.totalTalhoes}</CardValue>
          </Card>
          
          <Card>
            <CardHeader>
              <CardIcon>
                <FaChartLine />
              </CardIcon>
              <CardTitle>Análises do Mês</CardTitle>
            </CardHeader>
            <CardValue>{data.totalAnalisesMesAtual}</CardValue>
            <CardTrend isPositive={data.aumentoAnalisesRelacaoMesPassado > 0}>
              {data.aumentoAnalisesRelacaoMesPassado}% em relação ao mês anterior
            </CardTrend>
          </Card>
          
          <Card>
            <CardHeader>
              <CardIcon>
                <FaCalendarCheck />
              </CardIcon>
              <CardTitle>Análises de Hoje</CardTitle>
            </CardHeader>
            <CardValue>{data.totalAnalisesHoje}</CardValue>
          </Card>
          
          <Card>
            <CardHeader>
              <CardIcon>
                <FaSearchLocation />
              </CardIcon>
              <CardTitle>Análises com GPS</CardTitle>
            </CardHeader>
            <CardValue>{analisesComGeolocalizacao}</CardValue>
            {analises.length > 0 && (
              <CardTrend isPositive={true}>
                {((analisesComGeolocalizacao / analises.length) * 100).toFixed(1)}% do total
              </CardTrend>
            )}
          </Card>
        </Stats>
        
        <PrevisaoSection>
          <PrevisaoTitle>Previsões de Safra e Colheita</PrevisaoTitle>
          <PrevisaoColheitaGrid />
        </PrevisaoSection>

        <MapSection>
          <MapTitle>Mapa de Análises</MapTitle>
          
          <MapControlsContainer>
            <ControlGroup>
              <Label>Fazenda</Label>
              <Select value={selectedFazenda} onChange={handleFazendaChange}>
                <option value="">Selecione uma fazenda</option>
                {fazendas.map(fazenda => (
                  <option key={fazenda.id} value={fazenda.id}>{fazenda.nome}</option>
                ))}
              </Select>
            </ControlGroup>
            
            <ControlGroup>
              <Label>Talhão</Label>
              <Select 
                value={selectedTalhao} 
                onChange={handleTalhaoChange} 
                disabled={!selectedFazenda || loadingTalhoes}
              >
                <option value="">{loadingTalhoes ? "Carregando talhões..." : "Selecione um talhão"}</option>
                {!loadingTalhoes && talhoes.map(talhao => (
                  <option key={talhao.id} value={talhao.id}>{talhao.nome}</option>
                ))}
              </Select>
            </ControlGroup>
            
            <ControlGroup>
              <Label>Data Inicial</Label>
              <DateInput 
                type="date" 
                value={startDate} 
                onChange={(e) => handleDateChange(e, 'start')} 
              />
            </ControlGroup>
            
            <ControlGroup>
              <Label>Data Final</Label>
              <DateInput 
                type="date" 
                value={endDate} 
                onChange={(e) => handleDateChange(e, 'end')} 
              />
            </ControlGroup>
            
            <ControlGroup style={{ justifyContent: 'flex-end' }}>
              <Button onClick={fetchTalhaoData} disabled={!selectedTalhao}>
                <FaCalendarAlt /> Filtrar
              </Button>
            </ControlGroup>
            
            <ControlGroup style={{ justifyContent: 'flex-end' }}>
              <Button onClick={handleToggleTalhaoDesenho} disabled={!showMap}>
                {showTalhaoDesenho ? <><FaEyeSlash /> Ocultar Área</> : <><FaEye /> Mostrar Área</>}
              </Button>
            </ControlGroup>
            
            <ControlGroup style={{ justifyContent: 'flex-end' }}>
              <Button onClick={handleShowMap} disabled={!selectedTalhao || showMap}>
                <FaMapMarkedAlt /> Exibir Mapa
              </Button>
            </ControlGroup>
          </MapControlsContainer>
          
          {showMap && (
            <>
              <MapContainer ref={mapRef} />
              
              <ImageLegend>
                <LegendItem>
                  <ColorDot color="#FF0000" />
                  <LegendText>Predominância de Cerejas</LegendText>
                  <DataCount>({analises.filter(a => a.cherry > a.green && a.cherry > a.dry).length})</DataCount>
                </LegendItem>
                <LegendItem>
                  <ColorDot color="#00FF00" />
                  <LegendText>Predominância de Verdes</LegendText>
                  <DataCount>({analises.filter(a => a.green > a.cherry && a.green > a.dry).length})</DataCount>
                </LegendItem>
                <LegendItem>
                  <ColorDot color="#FFB700" />
                  <LegendText>Predominância de Secos</LegendText>
                  <DataCount>({analises.filter(a => a.dry > a.cherry && a.dry > a.green).length})</DataCount>
                </LegendItem>
                <LegendItem>
                  <ColorDot color="#FFFFFF" />
                  <LegendText>Sem predominância clara</LegendText>
                  <DataCount>({analises.filter(a => 
                    !(a.cherry > a.green && a.cherry > a.dry) && 
                    !(a.green > a.cherry && a.green > a.dry) && 
                    !(a.dry > a.cherry && a.dry > a.green)
                  ).length})</DataCount>
                </LegendItem>
              </ImageLegend>
              
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {analisesComGeolocalizacao} de {analises.length} análises possuem coordenadas GPS e estão exibidas no mapa.
                </div>
                {analises.filter(a => !a.coordenadas).length > 0 && (
                  <p style={{ color: '#FF6600' }}>
                    Obs: {analises.filter(a => !a.coordenadas).length} análises não possuem coordenadas GPS e não são exibidas no mapa.
                    Para melhor visualização, recomenda-se sempre utilizar imagens com metadados de localização.
                  </p>
                )}
                {analisesComGeolocalizacao === 0 && analises.length > 0 && (
                  <p style={{ color: 'red', fontWeight: 'bold' }}>
                    Atenção: Nenhuma análise encontrada com coordenadas GPS! Verifique se as imagens foram capturadas com GPS ativado.
                  </p>
                )}
              </div>
            </>
          )}
        </MapSection>
      </DashboardContainer>
      
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleCloseOnboarding} 
      />
    </>
  );
};

export default DashboardPage;
