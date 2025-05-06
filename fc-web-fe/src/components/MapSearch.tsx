import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import * as L from 'leaflet';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 10px;
  width: 400px;
  background: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  vertical-align: middle;
  z-index: 1000;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  padding-right: 45px;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  font-size: 14px;
  height: 42px;

  &:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.1);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  height: 42px;
  width: 42px;
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
    width: 16px;
    height: 16px;
  }

  &::after, &::before {
    display: none;
  }
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const ResultItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
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
}

const MapSearch: React.FC<MapSearchProps> = ({ onLocationSelect }) => {
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
      
      // Chamar o callback com a localização
      await onLocationSelect(location);
    } catch (error) {
      console.error('Erro ao selecionar localização:', error);
    }
  };

  return (
    <SearchContainer>
      <div style={{ position: 'relative' }}>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cidade ou região..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchButton onClick={handleSearch} disabled={isSearching}>
          <FaSearch />
        </SearchButton>
      </div>
      {results.length > 0 && (
        <ResultsList>
          {results.map((result, index) => (
            <ResultItem
              key={index}
              onClick={() => handleResultClick(result)}
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