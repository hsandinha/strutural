import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Search } from "lucide-react";

interface AutocompleteSearchProps {
  onSelect: (location: string) => void;
}

export function AutocompleteSearch({ onSelect }: AutocompleteSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    cities: string[];
    neighborhoods: string[];
  }>({
    cities: [],
    neighborhoods: [],
  });
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [allCities, setAllCities] = useState<string[]>([]);
  const [allNeighborhoods, setAllNeighborhoods] = useState<string[]>([]);

  // Busca cidades e bairros do Firestore uma vez ao montar o componente
  useEffect(() => {
    async function fetchLocations() {
      const imoveisRef = collection(db, "imoveis");
      const snapshot = await getDocs(imoveisRef);
      const citiesSet = new Set<string>();
      const neighborhoodsSet = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.endereco?.cidade) citiesSet.add(data.endereco.cidade);
        if (data.endereco?.bairro && data.endereco?.cidade) {
          neighborhoodsSet.add(
            `${data.endereco.bairro}, ${data.endereco.cidade}`
          );
        }
      });

      setAllCities(Array.from(citiesSet));
      setAllNeighborhoods(Array.from(neighborhoodsSet));
    }
    fetchLocations();
  }, []);

  const findSuggestions = useCallback(
    (searchQuery: string) => {
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
        n.toLowerCase().includes(lowerCaseQuery)
      );

      setSuggestions({
        cities: filteredCities,
        neighborhoods: filteredNeighborhoods,
      });
      setIsLoading(false);
    },
    [allCities, allNeighborhoods]
  );

  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      const timerId = setTimeout(() => {
        findSuggestions(query);
      }, 300);
      return () => clearTimeout(timerId);
    } else {
      setSuggestions({ cities: [], neighborhoods: [] });
    }
  }, [query, findSuggestions]);

  const handleSelect = (selectedValue: string) => {
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
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Digite um Bairro ou Cidade"
          className="w-full h-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        />
        <Search className="text-gray-400 shrink-0" size={20} />
      </div>

      {isFocused && query.length >= 2 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto p-2">
          {isLoading && (
            <div className="px-4 py-2 text-sm text-gray-500">Carregando...</div>
          )}

          {!isLoading &&
            suggestions.cities.length === 0 &&
            suggestions.neighborhoods.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">
                Nenhum local encontrado.
              </div>
            )}

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
