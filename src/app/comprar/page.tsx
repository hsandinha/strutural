// src/app/comprar/page.tsx
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { mockImoveis } from "@/lib/mockData";
import { Imovel, SearchFilters } from "@/types";
import { FilterForm } from "@/components/FilterForm";
import { PropertyCard } from "@/components/PropertyCard";
import { Filter, X } from "lucide-react";

// Componente principal que usa Suspense, pois `useSearchParams` requer isso.
export default function ComprarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Carregando...
        </div>
      }
    >
      <ComprarPageContent />
    </Suspense>
  );
}

// Objeto com os valores padrão para ser usado na inicialização e para limpar os filtros
const defaultFilters: SearchFilters = {
  codigo: "",
  finalidade: "Comprar",
  localizacao: "",
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

// Componente que contém toda a lógica e a aparência da página.
function ComprarPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [imoveisExibidos, setImoveisExibidos] = useState<Imovel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // Efeito que lê a URL e atualiza o estado dos filtros
  useEffect(() => {
    const newFilters = { ...defaultFilters };
    searchParams.forEach((value, key) => {
      const filterKey = key as keyof SearchFilters;
      if (key in newFilters) {
        if (Array.isArray(newFilters[filterKey])) {
          (newFilters[filterKey] as string[]) = value.split(",");
        } else {
          (newFilters as any)[filterKey] = value;
        }
      }
    });
    setFilters(newFilters);
  }, [searchParams]);

  // Efeito que filtra os imóveis sempre que o estado 'filters' muda
  useEffect(() => {
    let imoveisResultantes = mockImoveis.filter(
      (imovel) => imovel.finalidade === "Comprar"
    );

    if (filters.localizacao) {
      imoveisResultantes = imoveisResultantes.filter(
        (p) =>
          p.cidade.toLowerCase().includes(filters.localizacao.toLowerCase()) ||
          p.bairro.toLowerCase().includes(filters.localizacao.toLowerCase())
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
    if (filters.valorMin) {
      imoveisResultantes = imoveisResultantes.filter(
        (p) => p.preco >= parseFloat(filters.valorMin)
      );
    }
    if (filters.valorMax) {
      imoveisResultantes = imoveisResultantes.filter(
        (p) => p.preco <= parseFloat(filters.valorMax)
      );
    }

    setImoveisExibidos(imoveisResultantes);
  }, [filters]);

  // Função que constrói uma nova URL com os filtros e navega para ela
  const updateUrlWithFilters = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    (Object.keys(newFilters) as Array<keyof SearchFilters>).forEach((key) => {
      const value = newFilters[key];
      if (Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(","));
      } else if (value && value !== defaultFilters[key]) {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Função para remover um filtro (pill) da URL
  const removeFilterPill = (
    filterName: keyof SearchFilters,
    valueToRemove?: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // Lógica para remover um item de um filtro de array (como 'tipo')
    if (
      (filterName === "tipo" ||
        filterName === "caracteristicasImovel" ||
        filterName === "caracteristicasEdificio") &&
      valueToRemove
    ) {
      const currentValues = params.get(filterName)?.split(",") || [];
      const newValues = currentValues.filter((v) => v !== valueToRemove);
      if (newValues.length > 0) {
        params.set(filterName, newValues.join(","));
      } else {
        params.delete(filterName);
      }
    } else {
      // Remove filtros de valor único
      params.delete(filterName);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
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

        <div className="flex flex-wrap gap-2 mb-8 min-h-[30px]">
          {filters.tipo.map((t) => (
            <div
              key={t}
              className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium pl-3 pr-2 py-1 rounded-full capitalize"
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
          {/* Adicione mais pills para outros filtros aqui... */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {imoveisExibidos.length > 0 ? (
            imoveisExibidos.map((imovel) => (
              <PropertyCard key={imovel.id} imovel={imovel} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Nenhum imóvel encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </div>

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
      <FilterForm filters={modalFilters} setFilters={setModalFilters} />
      <div className="flex justify-end items-center mt-6 gap-4">
        <button
          onClick={closeModal}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancelar
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
