// src/components/AutocompleteSearch.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { mockImoveis } from "@/lib/mockData";
import { Search } from "lucide-react";

interface AutocompleteSearchProps {
  // A única responsabilidade do componente é avisar quando um local é selecionado
  onSelect: (location: string) => void;
}

// Geramos as listas de locais fora do componente para melhor performance
const allCities = [...new Set(mockImoveis.map((p) => p.cidade))];
const allNeighborhoods = [
  ...new Set(mockImoveis.map((p) => `${p.bairro}, ${p.cidade}`)),
];

export function AutocompleteSearch({ onSelect }: AutocompleteSearchProps) {
  // O componente agora gerencia seus próprios estados internos de busca
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    cities: string[];
    neighborhoods: string[];
  }>({ cities: [], neighborhoods: [] });
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função que realiza a filtragem das sugestões
  const findSuggestions = useCallback((searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions({ cities: [], neighborhoods: [] });
      setIsLoading(false);
      return;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredCities = allCities.filter((city) =>
      city.toLowerCase().includes(lowerCaseQuery)
    );
    const filteredNeighborhoods = allNeighborhoods.filter((n) =>
      n.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions({
      cities: filteredCities,
      neighborhoods: filteredNeighborhoods,
    });
    setIsLoading(false); // Terminou de carregar
  }, []);

  // O useEffect com "debounce" para controlar a busca
  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true); // Ativa o "Carregando..."
      const timerId = setTimeout(() => {
        findSuggestions(query);
      }, 300); // Espera 300ms após o usuário parar de digitar
      return () => clearTimeout(timerId); // Limpa o timer se o usuário continuar digitando
    } else {
      setSuggestions({ cities: [], neighborhoods: [] });
    }
  }, [query, findSuggestions]);

  // Função para quando o usuário seleciona uma sugestão
  const handleSelect = (selectedValue: string) => {
    // Pega apenas o nome do bairro/cidade antes da vírgula
    const cleanValue = selectedValue.split(",")[0];
    onSelect(cleanValue);
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center w-full border border-gray-300 rounded-md px-3 bg-white h-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay para permitir o clique
          placeholder="Digite um Bairro ou Cidade"
          className="w-full h-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        />
        <Search className="text-gray-400 shrink-0" size={20} />
      </div>

      {/* A lista de sugestões com toda a lógica de exibição */}
      {isFocused && query.length >= 2 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto p-2">
          {/* Mensagem de Carregando */}
          {isLoading && (
            <div className="px-4 py-2 text-sm text-gray-500">Carregando...</div>
          )}

          {/* Mensagem de Nenhuma Opção Encontrada */}
          {!isLoading &&
            suggestions.cities.length === 0 &&
            suggestions.neighborhoods.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">
                Nenhum local encontrado.
              </div>
            )}

          {/* Sugestões de Cidades e Bairros */}
          {!isLoading && (
            <>
              {suggestions.cities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 px-2 py-1">
                    Cidades
                  </h4>
                  {suggestions.cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onMouseDown={() => handleSelect(city)}
                      className="w-full text-left px-2 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
              {suggestions.neighborhoods.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 px-2 py-2 border-t mt-2">
                    Bairros
                  </h4>
                  {suggestions.neighborhoods.map((neighborhood) => (
                    <button
                      key={neighborhood}
                      type="button"
                      onMouseDown={() => handleSelect(neighborhood)}
                      className="w-full text-left px-2 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
                    >
                      {neighborhood}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
