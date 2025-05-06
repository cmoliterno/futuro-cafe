import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaCamera, FaSearch, FaSort, FaDrawPolygon, FaSortAlphaDown } from 'react-icons/fa';
import api from '../services/api';
import '../styles/leaflet-fixes.css';
import MapSearch from '../components/MapSearch';
import * as L from 'leaflet';

// Carregamento assíncrono do componente ModalColetaImagens
const ModalColetaImagens = lazy(() => import('../components/ModalColetaImagens'));

const Container = styled.div`
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
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    background-color: var(--color-surface);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    flex-wrap: wrap;
`;

const FormGroup = styled.div`
    flex: 1;
    min-width: 200px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--color-gray-700);
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--border-radius-md);
    background-color: white;
    
    &:focus {
        border-color: var(--color-secondary);
        outline: none;
        box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.2);
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--border-radius-md);
    background-color: white;
    
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
    justify-content: center;
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

const AddButton = styled(Button)`
    margin-left: auto;
`;

const SearchContainer = styled.div`
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    align-items: center;
`;

const SearchInput = styled(Input)`
    max-width: 300px;
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

const ActionButtonGroup = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
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

const SuccessMessage = styled.div`
    background-color: #e7f7e8;
    border: 1px solid #d4ecd5;
    color: #27ae60;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-weight: 500;
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 20px;
    color: #7f8c8d;
    font-weight: 500;
`;

const NoDataMessage = styled.div`
    text-align: center;
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 5px;
    color: #7f8c8d;
    font-weight: 500;
`;

const Pagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
`;

const PaginationButton = styled.button`
    padding: 8px 15px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2980b9;
    }

    &:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
    }
`;

const PageInfo = styled.span`
    color: #7f8c8d;
    font-weight: 500;
`;

const ErrorText = styled.span`
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
`;

const MapContainer = styled.div`
    width: 100%;
    height: 400px;
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ddd;
`;

const DrawingInstructions = styled.div`
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 4px;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;
    &:hover {
        color: #333;
    }
`;

const DrawMapContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 40px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const SearchFilterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 40px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const SearchIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
`;

const LoadingFallback = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 18px;
    z-index: 1000;
`;

interface Talhao {
    id: string;
    nome: string;
    fazendaId: string;
    createdAt: Date;
    lastUpdatedAt: Date;
    Fazenda?: {
        id: string;
        nome: string;
    };
    TalhaoDesenho?: {
        talhaoId: string;
        desenhoGeometria: any;
    };
    Plantio?: {
        id: string;
        data: Date;
        espacamentoLinhasMetros: number;
        espacamentoMudasMetros: number;
        cultivarId: number;
        talhaoId: string;
    };
}

interface TalhaoData {
    id?: string;
    nome: string;
    fazendaId: string;
    dataPlantio?: string | null;
    espacamentoLinhas?: number | null;
    espacamentoMudas?: number | null;
    cultivarId?: number | null;
    desenho?: any;
}

interface FormErrors {
    nome?: string;
    fazendaId?: string;
    dataPlantio?: string;
    espacamentoLinhas?: string;
    espacamentoMudas?: string;
    cultivarId?: string;
    desenho?: string;
    general?: string;
}

interface ApiResponse {
    data: {
        id: string;
        nome: string;
        fazendaId: string;
        createdAt: Date;
        lastUpdatedAt: Date;
        Plantio?: {
            id: string;
            data: Date;
            espacamentoLinhasMetros: number;
            espacamentoMudasMetros: number;
            cultivarId: number;
            talhaoId: string;
        };
    };
}

const TalhoesPage: React.FC = () => {
    const [talhoes, setTalhoes] = useState<Talhao[]>([]);
    const [fazendas, setFazendas] = useState<any[]>([]);
    const [cultivares, setCultivares] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: 'nome' | 'fazenda';
        direction: 'asc' | 'desc';
    }>({
        key: 'nome',
        direction: 'asc'
    });

    const [formData, setFormData] = useState({
        nome: '',
        fazendaId: '',
        cultivarId: '',
        dataPlantio: '',
        espacamentoLinhas: '',
        espacamentoMudas: ''
    });

    const [editId, setEditId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [errors, setErrors] = useState<FormErrors>({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [desenhoPoligono, setDesenhoPoligono] = useState<any>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const itemsPerPage = 10;
    
    // Centro aproximado para região cafeeira do Brasil
    const mapCenter = [-22.0, -47.8];
    let leafletMap: any = null;
    let drawControl: any = null;
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [drawnItems, setDrawnItems] = useState<any>(null);
    const [showInstructions, setShowInstructions] = useState(true);
    const [modalColetaVisible, setModalColetaVisible] = useState(false);
    const [selectedTalhaoId, setSelectedTalhaoId] = useState<string | null>(null);
    const [selectedTalhaoNome, setSelectedTalhaoNome] = useState<string>('');

    useEffect(() => {
        // Obter localização do usuário quando o componente montar
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    // Usar localização padrão se não conseguir obter a localização do usuário
                    setUserLocation([-22.0, -47.8]);
                }
            );
        } else {
            // Usar localização padrão se geolocalização não estiver disponível
            setUserLocation([-22.0, -47.8]);
        }

        loadData();
        fetchFazendas();
        fetchCultivares();
    }, []);

    useEffect(() => {
        // Se o mapa está sendo mostrado, inicialize o Leaflet
        if (showMap && mapRef.current) {
            const loadLeaflet = async () => {
                try {
                    // Primeiro importar os estilos
                    await import('leaflet/dist/leaflet.css');
                    await import('leaflet-draw/dist/leaflet.draw.css');
                    
                    // Depois importar os módulos
                    const L = (await import('leaflet')).default;
                    await import('leaflet-draw');
                    
                    // Inicializar o mapa
                    await initializeMap(L);
                } catch (error) {
                    console.error("Erro ao carregar Leaflet:", error);
                    setErrors(prev => ({ ...prev, general: 'Erro ao carregar o mapa. Por favor, tente novamente.' }));
                }
            };
            loadLeaflet();
        }

        return () => {
            cleanupMap();
        };
    }, [showMap]);

    const initializeMap = async (L: any) => {
        try {
            if (!mapRef.current) {
                return;
            }

            // Aguardar a localização do usuário
            const location = userLocation || [-21.763, -43.349];
            
            // Inicializar o mapa
            leafletMap = L.map(mapRef.current).setView(location, 13);

            // Adicionar camada base do mapa (satellite)
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 18,
                attribution: 'Tiles &copy; Esri'
            }).addTo(leafletMap);

            // Criar camada para desenhos
            const newDrawnItems = new L.FeatureGroup();
            leafletMap.addLayer(newDrawnItems);
            setDrawnItems(newDrawnItems);

            // Se já existe um desenho, mostrar no mapa
            if (desenhoPoligono && desenhoPoligono.coordinates && desenhoPoligono.coordinates.length > 0) {
                try {
                    const latlngs = desenhoPoligono.coordinates[0];
                    const polygon = L.polygon(latlngs, {
                        color: '#34A853',
                        fillColor: '#34A853',
                        fillOpacity: 0.5,
                    });
                    newDrawnItems.addLayer(polygon);
                    leafletMap.fitBounds(polygon.getBounds());
                } catch (error) {
                    console.error('Erro ao renderizar polígono existente:', error);
                }
            }
            
            // Configurar controles de desenho
            const drawOptions = {
                edit: {
                    featureGroup: newDrawnItems,
                    poly: {
                        allowIntersection: false
                    }
                },
                draw: {
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        shapeOptions: {
                            color: '#34A853',
                            fillColor: '#34A853',
                            fillOpacity: 0.5
                        }
                    },
                    polyline: false,
                    circle: false,
                    rectangle: false,
                    marker: false,
                    circlemarker: false
                }
            };
            
            drawControl = new L.Control.Draw(drawOptions);
            leafletMap.addControl(drawControl);
            
            // Configurar eventos de desenho
            leafletMap.on(L.Draw.Event.CREATED, (e: any) => {
                const layer = e.layer;
                newDrawnItems.clearLayers();
                newDrawnItems.addLayer(layer);
                const coordinates = layer.getLatLngs()[0].map((latlng: any) => [latlng.lat, latlng.lng]);
                setDesenhoPoligono({
                    type: 'Polygon',
                    coordinates: [coordinates]
                });
            });
            
            leafletMap.on(L.Draw.Event.EDITED, (e: any) => {
                const layers = e.layers;
                layers.eachLayer((layer: any) => {
                    const coordinates = layer.getLatLngs()[0].map((latlng: any) => [latlng.lat, latlng.lng]);
                    setDesenhoPoligono({
                        type: 'Polygon',
                        coordinates: [coordinates]
                    });
                });
            });
            
            leafletMap.on(L.Draw.Event.DELETED, () => {
                newDrawnItems.clearLayers();
                setDesenhoPoligono(null);
            });

            // Remover mensagem de erro
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.general;
                return newErrors;
            });

        } catch (error) {
            console.error("Erro ao inicializar o mapa:", error);
            setErrors(prev => ({ ...prev, general: 'Erro ao carregar o mapa. Por favor, tente novamente.' }));
        }
    };

    const cleanupMap = () => {
        try {
            if (leafletMap) {
                // Primeiro, remover todos os event listeners
                leafletMap.off();
                
                // Remover as camadas em ordem
                if (drawnItems) {
                    drawnItems.clearLayers();
                    leafletMap.removeLayer(drawnItems);
                    setDrawnItems(null);
                }
                
                if (drawControl) {
                    leafletMap.removeControl(drawControl);
                    drawControl = null;
                }
                
                // Por último, remover o mapa
                leafletMap.remove();
                leafletMap = null;
            }
        } catch (error) {
            console.error('Erro ao limpar o mapa:', error);
        }
    };

    const toggleDrawMap = () => {
        if (showMap) {
            cleanupMap();
        }
        setShowMap(!showMap);
    };

    const navigateToPhotoCollection = (talhaoId: string) => {
        const talhao = talhoes.find(t => t.id === talhaoId);
        if (talhao) {
            setSelectedTalhaoId(talhaoId);
            setSelectedTalhaoNome(talhao.nome || talhaoId);
            setModalColetaVisible(true);
        }
    };

    const handleDrawDeleted = () => {
        setDesenhoPoligono(null);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await api.getAllTalhoes();
            // Ordenar talhões alfabeticamente por nome
            const sortedTalhoes = response.data.sort((a: TalhaoData, b: TalhaoData) => 
                a.nome.localeCompare(b.nome)
            );
            setTalhoes(sortedTalhoes);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar talhões:', error);
            setErrors({ general: 'Erro ao carregar talhões. Tente novamente.' });
            setLoading(false);
        }
    };

    const fetchFazendas = async () => {
        try {
            const response = await api.getAllFazendas();
            // Ordenar fazendas alfabeticamente por nome
            const sortedFazendas = response.data.sort((a: any, b: any) => 
                a.nome.localeCompare(b.nome)
            );
            setFazendas(sortedFazendas);
        } catch (error) {
            console.error('Erro ao carregar fazendas:', error);
            setErrors({ general: 'Erro ao carregar fazendas. Tente novamente.' });
        }
    };

    const fetchCultivares = async () => {
        try {
            const response = await api.getAllCultivares();
            // Ordenar cultivares alfabeticamente por nome
            const sortedCultivares = response.data.sort((a: any, b: any) => 
                a.nome.localeCompare(b.nome)
            );
            setCultivares(sortedCultivares);
        } catch (error) {
            console.error('Erro ao carregar cultivares:', error);
            setErrors({ general: 'Erro ao carregar cultivares. Tente novamente.' });
        }
    };

    const handleSort = (key: 'nome' | 'fazenda') => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        const sortedTalhoes = [...talhoes].sort((a, b) => {
            if (key === 'fazenda') {
                const fazendaA = fazendas.find(f => f.id === a.fazendaId)?.nome || '';
                const fazendaB = fazendas.find(f => f.id === b.fazendaId)?.nome || '';
                return direction === 'asc' 
                    ? fazendaA.localeCompare(fazendaB)
                    : fazendaB.localeCompare(fazendaA);
            }
            
            // Para 'nome' ou qualquer outra chave
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setTalhoes(sortedTalhoes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validação básica dos campos obrigatórios
        const newErrors: FormErrors = {};
        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
        if (!formData.fazendaId) newErrors.fazendaId = 'Fazenda é obrigatória';
        if (!desenhoPoligono) {
            newErrors.desenho = 'É necessário desenhar a área do talhão no mapa';
            alert('Por favor, desenhe a área do talhão no mapa antes de salvar.');
            return;
        }
        
        // Se houver erros, exibir e parar a submissão
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        try {
            setLoading(true);
            
            // Dados básicos do talhão com o desenho
            const talhaoData: TalhaoData = {
                nome: formData.nome.trim(),
                fazendaId: formData.fazendaId,
                desenho: desenhoPoligono, // Incluir o desenho nos dados
                dataPlantio: formData.dataPlantio || null,
                espacamentoLinhas: formData.espacamentoLinhas ? parseFloat(formData.espacamentoLinhas) : null,
                espacamentoMudas: formData.espacamentoMudas ? parseFloat(formData.espacamentoMudas) : null,
                cultivarId: formData.cultivarId ? parseInt(formData.cultivarId) : null
            };
            
            let responseId: string;
            
            if (editId) {
                // Atualizar talhão existente
                await api.updateTalhao(editId, talhaoData);
                responseId = editId;
                setSuccess('Talhão atualizado com sucesso!');
            } else {
                // Criar novo talhão
                const response = await api.createTalhao(talhaoData);
                responseId = response.data.id;
                setSuccess('Talhão criado com sucesso!');
                
                // Perguntar se deseja ir para a coleta de imagens
                if (window.confirm('Talhão criado com sucesso! Deseja ir para a coleta de imagens?')) {
                    window.location.href = `/coleta-imagens/${responseId}`;
                    return; // Retorna aqui para não executar o resto do código
                }
            }
            
            // Atualizar a lista de talhões
            const talhoesResponse = await api.getAllTalhoes();
            setTalhoes(talhoesResponse.data);
            
            // Limpar totalmente o mapa e reinicializar
            cleanupMap();
            
            // Limpar o formulário e estados
            setFormData({
                nome: '',
                fazendaId: '',
                dataPlantio: '',
                espacamentoLinhas: '',
                espacamentoMudas: '',
                cultivarId: ''
            });
            
            setDesenhoPoligono(null);
            setEditId(null);
            setShowMap(false);
            
            // Limpar mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (error) {
            console.error('Erro ao salvar talhão:', error);
            setErrors({ general: 'Erro ao salvar talhão. Por favor, tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este talhão?')) return;
        
        try {
            setLoading(true);
            await api.deleteTalhao(id);
            loadData();
            setSuccess('Talhão excluído com sucesso!');
            setTimeout(() => setSuccess(''), 3000);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao excluir talhão:', error);
            setErrors({ general: 'Erro ao excluir talhão. Tente novamente.' });
            setLoading(false);
        }
    };

    const handleSelectForEdit = async (talhao: TalhaoData) => {
        try {
            if (!talhao.id) {
                throw new Error('ID do talhão não encontrado');
            }

            setLoading(true);
            // Buscar dados completos do talhão pelo ID
            const response = await api.getTalhaoById(talhao.id);
            const talhaoCompleto = response.data;
            
            setEditId(talhao.id);
            setFormData({
                nome: talhaoCompleto.nome || '',
                fazendaId: talhaoCompleto.fazendaId || '',
                dataPlantio: talhaoCompleto.Plantio?.data || '',
                espacamentoLinhas: talhaoCompleto.Plantio?.espacamentoLinhasMetros?.toString() || '',
                espacamentoMudas: talhaoCompleto.Plantio?.espacamentoMudasMetros?.toString() || '',
                cultivarId: talhaoCompleto.Plantio?.cultivarId?.toString() || ''
            });
            
            // Verificar se há desenho do talhão
            if (talhaoCompleto.TalhaoDesenho && talhaoCompleto.TalhaoDesenho.desenhoGeometria) {
                setDesenhoPoligono(talhaoCompleto.TalhaoDesenho.desenhoGeometria);
            } else {
                setDesenhoPoligono(null);
                // Mostrar alerta informando que o talhão ainda não tem desenho
                alert('Este talhão ainda não possui um desenho definido. Por favor, desenhe a área do talhão no mapa.');
            }
            
            setShowMap(true);
            setShowInstructions(true); // Mostrar as instruções novamente
            window.scrollTo(0, 0);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar dados do talhão para edição:', error);
            setErrors({ general: 'Erro ao carregar dados do talhão. Tente novamente.' });
            setLoading(false);
        }
    };

    const filteredTalhoes = talhoes.filter(talhao => 
        talhao.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedTalhoes = filteredTalhoes.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const totalPages = Math.ceil(filteredTalhoes.length / itemsPerPage);

    // Adicionar função para fechar o modal e atualizar a lista após upload bem-sucedido
    const handleSuccessfulUpload = () => {
        // Opcionalmente, atualize a lista de talhões ou mostre mensagem de sucesso
    };

    // Adicionar função para lidar com a seleção de localização
    const handleLocationSelect = async (location: { lat: number; lng: number }) => {
        if (!leafletMap) {
            console.error('Mapa não inicializado');
            return;
        }

        try {
            // Criar o objeto LatLng
            const latlng = L.latLng(location.lat, location.lng);

            // Primeiro, limpar qualquer marcador existente
            if (drawnItems) {
                drawnItems.clearLayers();
            }

            // Criar um novo marcador com ícone personalizado
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="background-color: #047502; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const marker = L.marker(latlng, { icon: customIcon });

            // Adicionar o marcador ao mapa
            if (drawnItems) {
                drawnItems.addLayer(marker);
            } else {
                marker.addTo(leafletMap);
            }

            // Centralizar o mapa na nova localização com zoom apropriado
            leafletMap.setView(latlng, 16);

            // Remover o marcador após 3 segundos
            setTimeout(() => {
                if (drawnItems) {
                    drawnItems.clearLayers();
                } else {
                    leafletMap.removeLayer(marker);
                }
            }, 3000);

        } catch (error) {
            console.error('Erro ao atualizar localização no mapa:', error);
        }
    };

    return (
        <Container>
            <Title>Gerenciamento de Talhões</Title>
            
            {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <FormContainer>
                <FormGroup>
                    <Label>Nome*</Label>
                    <Input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Nome do talhão"
                    />
                    {errors.nome && <ErrorText>{errors.nome}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                    <Label>Fazenda*</Label>
                    <Select
                        value={formData.fazendaId}
                        onChange={(e) => setFormData({ ...formData, fazendaId: e.target.value })}
                    >
                        <option value="">Selecione uma fazenda</option>
                        {fazendas.map(fazenda => (
                            <option key={fazenda.id} value={fazenda.id}>{fazenda.nome}</option>
                        ))}
                    </Select>
                    {errors.fazendaId && <ErrorText>{errors.fazendaId}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                    <Label>Data de Plantio*</Label>
                    <Input
                        type="date"
                        value={formData.dataPlantio}
                        onChange={(e) => setFormData({ ...formData, dataPlantio: e.target.value })}
                    />
                    {errors.dataPlantio && <ErrorText>{errors.dataPlantio}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                    <Label>Espaçamento entre linhas (m)*</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={formData.espacamentoLinhas}
                        onChange={(e) => setFormData({ ...formData, espacamentoLinhas: e.target.value })}
                        placeholder="Ex: 3.5"
                    />
                    {errors.espacamentoLinhas && <ErrorText>{errors.espacamentoLinhas}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                    <Label>Espaçamento entre mudas (m)*</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={formData.espacamentoMudas}
                        onChange={(e) => setFormData({ ...formData, espacamentoMudas: e.target.value })}
                    />
                    {errors.espacamentoMudas && <ErrorText>{errors.espacamentoMudas}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                    <Label>Cultivar*</Label>
                    <Select
                        value={formData.cultivarId}
                        onChange={(e) => setFormData({ ...formData, cultivarId: e.target.value })}
                    >
                        <option value="">Selecione uma cultivar</option>
                        {cultivares.map(cultivar => (
                            <option key={cultivar.id} value={cultivar.id}>{cultivar.nome}</option>
                        ))}
                    </Select>
                    {errors.cultivarId && <ErrorText>{errors.cultivarId}</ErrorText>}
                </FormGroup>
                
                <AddButton onClick={handleSubmit}>
                    {editId ? 'Salvar Alterações' : 'Adicionar Talhão'}
                </AddButton>
                
                {editId && (
                    <Button 
                        onClick={() => {
                            setEditId(null);
                            setFormData({
                                nome: '',
                                fazendaId: '',
                                cultivarId: '',
                                dataPlantio: '',
                                espacamentoLinhas: '',
                                espacamentoMudas: ''
                            });
                            setDesenhoPoligono(null);
                            setShowMap(false);
                        }}
                        style={{ backgroundColor: '#6c757d', marginLeft: '10px' }}
                    >
                        Cancelar Edição
                    </Button>
                )}
            </FormContainer>
            
            <DrawMapContainer>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button onClick={toggleDrawMap}>
                        {showMap ? 'Ocultar Mapa' : 'Desenhar Talhão'}
                    </Button>
                    {showMap && <MapSearch onLocationSelect={handleLocationSelect} />}
                    {desenhoPoligono && <SuccessMessage style={{ padding: '8px', margin: 0 }}>✓ Área do talhão desenhada</SuccessMessage>}
                    {errors.desenho && <ErrorText style={{ margin: 0 }}>{errors.desenho}</ErrorText>}
                </div>
                {showMap && (
                    <>
                        <MapContainer ref={mapRef} />
                        {showInstructions && (
                            <DrawingInstructions>
                                <CloseButton onClick={() => setShowInstructions(false)}>×</CloseButton>
                                <p><strong>Como desenhar:</strong></p>
                                <p>1. Clique no ícone de polígono <FaDrawPolygon /> na barra lateral</p>
                                <p>2. Clique nos pontos do mapa para marcar o contorno do talhão</p>
                                <p>3. Para finalizar, clique no primeiro ponto ou dê um duplo clique</p>
                                <p>4. Use as ferramentas de edição para ajustar se necessário</p>
                            </DrawingInstructions>
                        )}
                    </>
                )}
            </DrawMapContainer>

            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Buscar talhões..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchContainer>
            
            {loading && !editId ? (
                <LoadingMessage>Carregando talhões...</LoadingMessage>
            ) : paginatedTalhoes.length > 0 ? (
                <>
                    <Table>
                        <thead>
                            <tr>
                                <Th onClick={() => handleSort('nome')} className={sortConfig.key === 'nome' ? `sorted-${sortConfig.direction}` : ''}>
                                    Nome
                                </Th>
                                <Th onClick={() => handleSort('fazenda')} className={sortConfig.key === 'fazenda' ? `sorted-${sortConfig.direction}` : ''}>
                                    Fazenda
                                </Th>
                                <Th>Ações</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTalhoes.map(talhao => (
                                <tr key={talhao.id}>
                                    <Td>{talhao.nome}</Td>
                                    <Td>{fazendas.find(f => f.id === talhao.fazendaId)?.nome || 'N/A'}</Td>
                                    <Td>
                                        <ActionButtonGroup>
                                            <ActionButton 
                                              onClick={() => handleSelectForEdit(talhao)}
                                              title="Editar talhão"
                                              color="#3498db"
                                            >
                                                <FaEdit />
                                            </ActionButton>
                                            <ActionButton 
                                              onClick={() => handleDelete(talhao.id)}
                                              title="Excluir talhão"
                                              color="#e74c3c"
                                            >
                                                <FaTrash />
                                            </ActionButton>
                                            <ActionButton 
                                              onClick={() => navigateToPhotoCollection(talhao.id)}
                                              title="Coletar imagens do talhão"
                                              color="#047502"
                                            >
                                                <FaCamera />
                                            </ActionButton>
                                        </ActionButtonGroup>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationButton
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            >
                                Anterior
                            </PaginationButton>
                            
                            <PageInfo>
                                Página {page} de {totalPages}
                            </PageInfo>
                            
                            <PaginationButton
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                Próxima
                            </PaginationButton>
                        </Pagination>
                    )}
                </>
            ) : (
                <NoDataMessage>
                    {searchTerm ? 'Nenhum talhão encontrado com esse nome.' : 'Nenhum talhão cadastrado.'}
                </NoDataMessage>
            )}
            
            {/* Modal para coleta de imagens com carregamento assíncrono */}
            {modalColetaVisible && (
                <Suspense fallback={<LoadingFallback>Carregando...</LoadingFallback>}>
                    <ModalColetaImagens 
                        isOpen={modalColetaVisible}
                        onClose={() => setModalColetaVisible(false)}
                        talhaoId={selectedTalhaoId || ''}
                        talhaoNome={selectedTalhaoNome}
                        onSuccessfulUpload={handleSuccessfulUpload}
                    />
                </Suspense>
            )}
        </Container>
    );
};

export default TalhoesPage;
