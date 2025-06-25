"use client";

import type { SearchFilters, Imovel } from "@/types";
import { AutocompleteSearch } from "./AutocompleteSearch";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface FilterFormProps {
  filters: SearchFilters;
  onFiltersChange: (newFilters: SearchFilters) => void;
  closeModal: () => void; // Adicione esta linha
}

const ButtonGroupField = ({ label, name, value, options, onChange }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex space-x-2">
      {options.map((option: string) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(name, option)}
          className={`px-4 py-2 text-sm rounded-md border ${
            value === option
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {option}
          {option !== "Todos" && "+"}
        </button>
      ))}
    </div>
  </div>
);

export function FilterForm({ filters, onFiltersChange }: FilterFormProps) {
  const [codeQuery, setCodeQuery] = useState("");
  const [codeSearchAttempted, setCodeSearchAttempted] = useState(false);
  const [foundProperty, setFoundProperty] = useState<Imovel | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFiltersChange({ ...filters, [name]: value });
    if (name === "codigo" && value === "") {
      setFoundProperty(null);
      setCodeSearchAttempted(false);
    }
  };

  const handleButtonGroupChange = (
    name: keyof SearchFilters,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [name]: filters[name as keyof typeof filters] === value ? "Todos" : value,
    });
  };

  const handleCheckboxChange = (
    group: "tipo" | "caracteristicasImovel" | "caracteristicasEdificio",
    value: string
  ) => {
    const currentValues = filters[group];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    onFiltersChange({ ...filters, [group]: newValues });
  };

  const addLocationFilter = (location: string) => {
    const lowerCaseLocation = location.toLowerCase();
    if (!filters.localizacao.includes(lowerCaseLocation)) {
      const newLocations = [...filters.localizacao, lowerCaseLocation];
      onFiltersChange({ ...filters, localizacao: newLocations });
    }
  };

  const removeLocationFilter = (locationToRemove: string) => {
    const newLocations = filters.localizacao.filter(
      (loc) => loc !== locationToRemove
    );
    onFiltersChange({ ...filters, localizacao: newLocations });
  };

  const handleCodeSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCodeSearchAttempted(true);
    if (!codeQuery) return;

    try {
      const docRef = doc(db, "imoveis", codeQuery);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFoundProperty({ id: docSnap.id, ...docSnap.data() } as Imovel);
      } else {
        setFoundProperty(null);
      }
    } catch (error) {
      console.error("Erro ao buscar imóvel por código:", error);
      setFoundProperty(null);
    }
  };

  const tiposDeImovel = [
    { name: "Andar Corrido", value: "andar-corrido" },
    { name: "Apartamento", value: "apartamento" },
    { name: "Apto Área Privativa", value: "apto-area-privativa" },
    { name: "Casa Comercial", value: "casa-comercial" },
    { name: "Casa Residencial", value: "casa" },
    { name: "Casa Condomínio", value: "casa-condominio" },
    { name: "Cobertura", value: "cobertura" },
    { name: "Estacionamento", value: "estacionamento" },
    { name: "Fazendas / Sítios", value: "fazenda" },
    { name: "Flat/Hotel/Apart", value: "hotel" },
    { name: "Galpão", value: "galpao" },
    { name: "Loja", value: "loja" },
    { name: "Lote / Terreno", value: "terreno" },
    { name: "Prédio Comercial", value: "predio-comercial" },
    { name: "Salas", value: "sala" },
    { name: "Vaga de Garagem", value: "garagem" },
  ];

  const caracteristicasImovel = [
    "Aceita Permuta",
    "Área Privativa",
    "Churrasqueira",
    "Closet",
    "DCE",
    "Exclusivo",
    "Lavabo",
    "Mobiliado",
    "Na Planta",
    "Alugado",
  ];

  const caracteristicasEdificio = [
    "Piscina",
    "Quadra de Tênis",
    "Academia",
    "Área de Lazer",
    "Code playground",
    "Portaria 24h",
    "Quadra Esportiva",
    "Salão de Jogos",
    "Sauna",
    "Portão Eletrônico",
  ];

  return (
    <form className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Busca Detalhada
      </h1>

      <div className="grid grid-cols-1 ">
        <div>
          <label
            htmlFor="codigo"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Código
          </label>
          <div className="flex items-center gap-0 w-full border border-gray-300 rounded-md bg-white h-12">
            <input
              type="text"
              value={codeQuery}
              onChange={(e) => {
                setCodeQuery(e.target.value);
                if (e.target.value === "") setFoundProperty(null);
              }}
              placeholder="Digite o código do imóvel"
              className="w-full h-full px-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleCodeSearch}
              className="px-3 h-full text-gray-400 hover:text-blue-600"
            >
              <Search size={20} />
            </button>
          </div>

          {foundProperty && (
            <Link href={`/imoveis/${foundProperty.id}`} className="block mt-2">
              <div className="border rounded-md p-2 flex items-center gap-3 hover:bg-gray-50">
                <div className="relative w-20 h-16 rounded overflow-hidden">
                  <Image
                    src={foundProperty.fotos[0]}
                    alt={foundProperty.titulo}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {foundProperty.tipo} | {foundProperty.endereco.bairro}
                  </p>
                  <p className="text-sm text-blue-600 font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(foundProperty.preco)}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {codeSearchAttempted && !foundProperty && (
            <div className="mt-2 px-3 py-2 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
              Imóvel não encontrado.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div>
          <label
            htmlFor="localizacao"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Localização
          </label>
          <AutocompleteSearch onSelect={addLocationFilter} />

          {filters.localizacao.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.localizacao.map((loc) => (
                <div
                  key={loc}
                  className="flex items-center bg-gray-200 text-gray-800 text-xs font-medium pl-3 pr-2 py-1 rounded-full"
                >
                  <span className="capitalize">{loc}</span>
                  <button
                    type="button"
                    onClick={() => removeLocationFilter(loc)}
                    className="ml-2 text-gray-500 hover:text-black"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Tipo de Imóvel
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {tiposDeImovel.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleCheckboxChange("tipo", item.value)}
              className={`px-3 py-2 text-sm rounded-md border text-center ${
                filters.tipo.includes(item.value)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        <ButtonGroupField
          label="Quartos"
          name="quartos"
          value={filters.quartos}
          options={["1", "2", "3", "4"]}
          onChange={handleButtonGroupChange}
        />
        <ButtonGroupField
          label="Banheiros"
          name="banheiros"
          value={filters.banheiros}
          options={["1", "2", "3", "4"]}
          onChange={handleButtonGroupChange}
        />
        <ButtonGroupField
          label="Suítes"
          name="suites"
          value={filters.suites}
          options={["1", "2", "3", "4"]}
          onChange={handleButtonGroupChange}
        />
        <ButtonGroupField
          label="Vagas"
          name="vagas"
          value={filters.vagas}
          options={["1", "2", "3", "4"]}
          onChange={handleButtonGroupChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Valor
          </label>
          <div className="flex items-center ">
            <input
              type="number"
              name="valorMin"
              value={filters.valorMin}
              onChange={handleInputChange}
              placeholder="Mínimo"
              className="w-full h-12 gap-0 px-3 bg-transparent focus:outline-none border border-gray-300 rounded-md text-gray-700 placeholder-gray-400"
            />
            <span>-</span>
            <input
              type="number"
              name="valorMax"
              value={filters.valorMax}
              onChange={handleInputChange}
              placeholder="Máximo"
              className="w-full h-12 gap-0 px-3 bg-transparent focus:outline-none border border-gray-300 rounded-md text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Área (m²)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="areaMin"
              value={filters.areaMin}
              onChange={handleInputChange}
              placeholder="Mínima"
              className="w-full h-12 gap-0 px-3 bg-transparent focus:outline-none border border-gray-300 rounded-md text-gray-700 placeholder-gray-400"
            />
            <span>-</span>
            <input
              type="number"
              name="areaMax"
              value={filters.areaMax}
              onChange={handleInputChange}
              placeholder="Máxima"
              className="w-full h-12 gap-0 px-3 bg-transparent focus:outline-none border border-gray-300 rounded-md text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Características do Imóvel
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {caracteristicasImovel.map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.caracteristicasImovel.includes(item)}
                onChange={() =>
                  handleCheckboxChange("caracteristicasImovel", item)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Características do Edifício
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {caracteristicasEdificio.map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.caracteristicasEdificio.includes(item)}
                onChange={() =>
                  handleCheckboxChange("caracteristicasEdificio", item)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
