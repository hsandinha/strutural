// src/app/comprar/page.tsx
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { mockImoveis } from "@/lib/mockData";
import { Imovel, SearchFilters } from "@/types";
import { FilterForm } from "@/components/FilterForm";
import { PropertyCard } from "@/components/PropertyCard";
import { Filter, X } from "lucide-react";

/**
 * O Next.js recomenda usar <Suspense> ao usar o hook useSearchParams.
 * Este componente principal apenas envolve o conteúdo real em um Suspense
 * para lidar com o carregamento inicial.
 */
export default function ComprarPage() {
  return (
    <Suspense
      fallback={<div className="text-center p-10">Carregando imóveis...</div>}
    >
      <ComprarPageContent />
    </Suspense>
  );
}

// Objeto com os valores padrão para ser usado na inicialização e para limpar os filtros.
// É a nossa "fonte da verdade" para o estado inicial de um filtro.
const defaultFilters: SearchFilters = {
  codigo: "",
  finalidade: "Comprar",
  localizacao: [],
  tipo: [],
  quartos: "Todos",
  banheiros: "Todos",
  suites: "Todos",
  vagas: "Todos",
  valorMin: "",
  valorMax: "",
  areaMin: "",
  areaMax: "",
  caracteristicasImovel: [],
  caracteristicasEdificio: [],
};

/**
 * Este componente contém toda a lógica e a aparência da página.
 */

function ComprarPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ----- ESTADOS DO COMPONENTE -----
  const [imoveisExibidos, setImoveisExibidos] = useState<Imovel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // O estado 'filters' é um espelho do que está na URL.
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // ----- FUNÇÕES DE ATUALIZAÇÃO E LÓGICA -----

  // Função que constrói um objeto de filtros a partir dos parâmetros da URL
  const buildFiltersFromParams = useCallback(() => {
    const newFilters = { ...defaultFilters };
    searchParams.forEach((value, key) => {
      const filterKey = key as keyof SearchFilters;
      if (key in newFilters) {
        // Se a propriedade no nosso tipo é um array, transforma a string da URL em array
        if (Array.isArray(newFilters[filterKey])) {
          (newFilters[filterKey] as string[]) = value.split(",");
        } else {
          (newFilters as any)[filterKey] = value;
        }
      }
    });
    return newFilters;
  }, [searchParams]);

  // Efeito que sincroniza a URL com o estado dos filtros sempre que a URL muda
  useEffect(() => {
    const filtersFromUrl = buildFiltersFromParams();
    setFilters(filtersFromUrl);
  }, [searchParams, buildFiltersFromParams]);

  // Efeito que filtra os imóveis sempre que o estado 'filters' é atualizado
  useEffect(() => {
    let imoveisResultantes = mockImoveis.filter(
      (imovel) => imovel.finalidade === "Comprar"
    );

    // Lógica de filtragem em cascata
    if (filters.localizacao.length > 0) {
      imoveisResultantes = imoveisResultantes.filter((p) =>
        filters.localizacao.some(
          (loc) =>
            p.bairro.toLowerCase() === loc.toLowerCase() ||
            p.cidade.toLowerCase() === loc.toLowerCase()
        )
      );
    }
    if (filters.tipo.length > 0) {
      imoveisResultantes = imoveisResultantes.filter((p) =>
        filters.tipo.includes(p.tipo?.toLowerCase() || "")
      );
    }
    if (filters.quartos && filters.quartos !== "Todos") {
      imoveisResultantes = imoveisResultantes.filter(
        (p) => p.quartos >= parseInt(filters.quartos)
      );
    }
    // ... adicione a lógica para os outros filtros aqui (banheiros, valor, area, etc)

    setImoveisExibidos(imoveisResultantes);
  }, [filters]);

  // Função que atualiza a URL com os novos filtros
  const updateUrlWithFilters = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    (Object.keys(newFilters) as Array<keyof SearchFilters>).forEach((key) => {
      const value = newFilters[key];
      // Apenas adiciona à URL se não for o valor padrão
      if (Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(","));
      } else if (value && value !== defaultFilters[key]) {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Função para remover um "pill" de filtro (atualizando a URL)
  const removeFilterPill = (
    filterName: keyof SearchFilters,
    valueToRemove?: string
  ) => {
    const currentValues = filters[filterName];
    let newValues;

    if (Array.isArray(currentValues) && valueToRemove) {
      newValues = currentValues.filter((v) => v !== valueToRemove);
    } else {
      newValues = defaultFilters[filterName]; // Reseta para o valor padrão
    }
    updateUrlWithFilters({ ...filters, [filterName]: newValues });
  };

  // Função para capitalizar texto para exibição nos pills
  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

  // ----- RENDERIZAÇÃO DO COMPONENTE -----
  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Imóveis à Venda
            </h1>
            <p className="text-gray-600">
              {imoveisExibidos.length} imóveis encontrados
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors self-start md:self-center"
          >
            <Filter size={18} /> Mais Filtros
          </button>
        </div>

        {/* "Pills" de Filtros Ativos */}
        <div className="flex flex-wrap gap-2 mb-8 min-h-[30px]">
          {filters.localizacao.map((loc) => (
            <div
              key={loc}
              className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium pl-3 pr-2 py-1 rounded-full capitalize"
            >
              {loc}
              <button
                onClick={() => removeFilterPill("localizacao", loc)}
                className="ml-2 text-gray-500 hover:text-black"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {filters.tipo.map((t) => (
            <div
              key={t}
              className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium pl-3 pr-2 py-1 rounded-full"
            >
              {capitalize(t)}
              <button
                onClick={() => removeFilterPill("tipo", t)}
                className="ml-2 text-gray-500 hover:text-black"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {filters.quartos !== "Todos" && (
            <div className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
              Quartos: {filters.quartos}+
              <button
                onClick={() => removeFilterPill("quartos")}
                className="ml-2 text-gray-500 hover:text-black"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Grade de Imóveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {imoveisExibidos.length > 0 ? (
            imoveisExibidos.map((imovel) => (
              <PropertyCard key={imovel.id} imovel={imovel} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">
              Nenhum imóvel encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </div>

      {/* Modal de Filtros */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl p-8 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <ModalFilterContent
              currentFilters={filters}
              onApply={updateUrlWithFilters}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

// Componente interno para o conteúdo do modal
function ModalFilterContent({
  currentFilters,
  onApply,
  closeModal,
}: {
  currentFilters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
  closeModal: () => void;
}) {
  const [modalFilters, setModalFilters] = useState(currentFilters);

  const handleApply = () => {
    onApply(modalFilters);
    closeModal();
  };

  return (
    <>
      <FilterForm filters={modalFilters} onFiltersChange={setModalFilters} />
      <div className="flex justify-end items-center mt-6 gap-4">
        <button
          onClick={closeModal}
          className="text-sm text-gray-600 hover:underline"
        >
          Limpar e Fechar
        </button>
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700"
        >
          Ver Imóveis
        </button>
      </div>
    </>
  );
}
