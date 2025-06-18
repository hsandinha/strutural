// src/components/FilterForm.tsx
"use client";

import type { SearchFilters } from "@/types";
import { Search } from "lucide-react";

interface FilterFormProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}

// Pequeno componente auxiliar para os botões (Quartos, Banheiros, etc)
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

// Componente principal do formulário
export function FilterForm({ filters, setFilters }: FilterFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleButtonGroupChange = (
    name: keyof SearchFilters,
    value: string
  ) => {
    setFilters({
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
    setFilters({ ...filters, [group]: newValues });
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
    { name: "Vaga de Garagem", value: "geragem" },
    // Adicione os outros tipos aqui seguindo o mesmo padrão
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
    "Playground",
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

      {/* Código e Bairro/Cidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            name="codigo"
            value={filters.codigo}
            onChange={handleInputChange}
            placeholder="Digite o código do imóvel"
            className="w-full border-gray-300 rounded-md p-3 pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <div className="relative">
            {/* Garanta que o 'name' e o 'value' aqui são 'localizacao' */}
            <input
              type="text"
              name="localizacao"
              value={filters.localizacao}
              onChange={handleInputChange}
              placeholder="Digite aqui o Bairro ou Cidade"
              className="w-full border-gray-300 rounded-md p-3 pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      {/* Tipo de Imóvel */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Tipo de Imóvel
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {/* AGORA USAMOS OS OBJETOS DA NOSSA NOVA LISTA */}
          {tiposDeImovel.map((item) => (
            <button
              key={item.value}
              type="button"
              // O onClick agora usa o 'value' (minúsculo)
              onClick={() => handleCheckboxChange("tipo", item.value)}
              className={`px-3 py-2 text-sm rounded-md border text-center ${
                // A verificação também usa o 'value'
                filters.tipo.includes(item.value)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {/* A exibição usa o 'name' (capitalizado) */}
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quartos, Banheiros, Suítes, Vagas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Valor e Área */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Valor
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="valorMin"
              value={filters.valorMin}
              onChange={handleInputChange}
              placeholder="Mínimo"
              className="w-full border-gray-300 rounded-md p-2"
            />
            <span>-</span>
            <input
              type="number"
              name="valorMax"
              value={filters.valorMax}
              onChange={handleInputChange}
              placeholder="Máximo"
              className="w-full border-gray-300 rounded-md p-2"
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
              className="w-full border-gray-300 rounded-md p-2"
            />
            <span>-</span>
            <input
              type="number"
              name="areaMax"
              value={filters.areaMax}
              onChange={handleInputChange}
              placeholder="Máxima"
              className="w-full border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
      </div>

      {/* Características do Imóvel */}
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

      {/* Características do Edifício */}
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
