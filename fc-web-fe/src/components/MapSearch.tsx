import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import * as L from 'leaflet';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 300px;
  background: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  padding-right: 40px;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  font-size: 14px;
  height: 36px;

  &:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.1);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 16px;
  height: 32px;
  width: 32px;
  background: var(--color-primary);
  border: none;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  transform: none;
  padding: 0;
  margin: 0;
  outline: none;
  text-decoration: none;

  &:hover {
    background: var(--color-secondary);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  &::after, &::before {
    display: none;
  }
`;

const ResultsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  background: white;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1001;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-secondary);
  }
`;

const ResultItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: var(--color-primary);
    color: white;
  }

  &:last-child {
    border-bottom: none;
  }
`;

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface MapSearchProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  map?: L.Map;
}

const MapSearch: React.FC<MapSearchProps> = ({ onLocationSelect, map }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsSearching(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}, Brasil&limit=5&countrycodes=br`,
        {
          headers: {
            'Accept-Language': 'pt-BR'
          }
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = async (result: SearchResult) => {
    try {
      const location = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
      
      // Atualizar o termo de busca e limpar resultados
      setSearchTerm(result.display_name);
      setResults([]);
      
      // Se o mapa foi fornecido, atualizar a visualização primeiro
      if (map) {
        // Criar um grupo de camadas para os marcadores temporários
        const markersGroup = new L.FeatureGroup();
        
        // Adicionar um marcador temporário
        const marker = L.circleMarker([location.lat, location.lng], {
          radius: 8,
          fillColor: '#047502',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });
        
        // Adicionar o marcador ao grupo e o grupo ao mapa
        markersGroup.addLayer(marker);
        markersGroup.addTo(map);

        // Centralizar o mapa na localização com animação
        map.setView([location.lat, location.lng], 16);
        
        // Remover o grupo de marcadores após 3 segundos
        setTimeout(() => {
          markersGroup.remove();
        }, 3000);
      }
      
      // Chamar o callback com a localização
      onLocationSelect(location);

    } catch (error) {
      console.error('Erro ao selecionar localização:', error);
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar cidade ou região..."
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        autoComplete="off"
      />
      <SearchButton onClick={handleSearch} disabled={isSearching}>
        <FaSearch />
      </SearchButton>
      {results.length > 0 && (
        <ResultsList>
          {results.map((result, index) => (
            <ResultItem
              key={index}
              onClick={() => handleResultClick(result)}
              title={result.display_name}
            >
              {result.display_name}
            </ResultItem>
          ))}
        </ResultsList>
      )}
    </SearchContainer>
  );
};

export default MapSearch; 