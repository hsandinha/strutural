"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Imovel, SearchFilters } from "@/types";
import { FilterForm } from "@/components/FilterForm";
import { PropertyCard } from "@/components/PropertyCard";
import { PlusIcon, X } from "lucide-react";

export default function ComprarPage() {
  return (
    <Suspense
      fallback={<div className="text-center p-10">Carregando imóveis...</div>}
    >
      <ComprarPageContent />
    </Suspense>
  );
}

const defaultFilters: SearchFilters = {
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

async function fetchImoveis(filters: SearchFilters): Promise<Imovel[]> {
  const imoveisRef = collection(db, "imoveis");
  const constraints: QueryConstraint[] = [];

  constraints.push(where("finalidade", "==", "Comprar"));

  if (filters.tipo.length > 0) {
    // Firestore limita 'in' a 10 valores
    constraints.push(where("tipo", "in", filters.tipo));
  }

  if (filters.quartos !== "Todos") {
    constraints.push(where("quartos", ">=", parseInt(filters.quartos)));
  }

  // Você pode adicionar outros filtros simples aqui

  const q = query(imoveisRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Imovel[];
}

function ComprarPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [imoveisExibidos, setImoveisExibidos] = useState<Imovel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const buildFiltersFromParams = useCallback(() => {
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
    return newFilters;
  }, [searchParams]);

  useEffect(() => {
    const filtersFromUrl = buildFiltersFromParams();
    setFilters(filtersFromUrl);
  }, [searchParams, buildFiltersFromParams]);

  useEffect(() => {
    async function fetchAndFilterImoveis() {
      try {
        const imoveisFromFirestore = await fetchImoveis(filters);

        let filtered = imoveisFromFirestore;

        if (filters.localizacao.length > 0) {
          filtered = filtered.filter((p) => {
            const bairro = p.endereco?.bairro?.toLowerCase() || "";
            const cidade = p.endereco?.cidade?.toLowerCase() || "";

            return filters.localizacao.some((loc) => {
              const locLower = loc.toLowerCase();
              if (locLower.includes(",")) {
                const [filtroBairro, filtroCidade] = locLower
                  .split(",")
                  .map((s) => s.trim());
                return bairro === filtroBairro && cidade === filtroCidade;
              } else {
                return bairro === locLower || cidade === locLower;
              }
            });
          });
        }

        const sortOrder = searchParams.get("sort") || "relevancia";
        if (sortOrder === "preco_asc") {
          filtered.sort((a, b) => a.preco - b.preco);
        } else if (sortOrder === "preco_desc") {
          filtered.sort((a, b) => b.preco - a.preco);
        } else if (sortOrder === "data_desc") {
          filtered.sort(
            (a, b) =>
              new Date(b.dataCadastro).getTime() -
              new Date(a.dataCadastro).getTime()
          );
        }

        setImoveisExibidos(filtered);
      } catch (error) {
        console.error("Erro ao buscar imóveis do Firestore:", error);
        setImoveisExibidos([]);
      }
    }

    fetchAndFilterImoveis();
  }, [filters, searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (newSortOrder === "relevancia") {
      params.delete("sort");
    } else {
      params.set("sort", newSortOrder);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

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

  const removeFilterPill = (
    filterName: keyof SearchFilters,
    valueToRemove?: string
  ) => {
    const currentValues = filters[filterName];
    let newValues;

    if (Array.isArray(currentValues) && valueToRemove) {
      newValues = currentValues.filter((v) => v !== valueToRemove);
    } else {
      newValues = defaultFilters[filterName];
    }
    updateUrlWithFilters({ ...filters, [filterName]: newValues });
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

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div>
              <label htmlFor="sort" className="sr-only">
                Ordenar por:
              </label>
              <select
                id="sort"
                onChange={handleSortChange}
                className="block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
              >
                <option value="relevancia">Mais Relevantes</option>
                <option value="data_desc">Mais Recentes</option>
                <option value="preco_asc">Menor Preço</option>
                <option value="preco_desc">Maior Preço</option>
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 border-gray-300 text-black font-semibold py-2 px-5 cursor-pointer hover:bg-blue-500 transition-colors whitespace-nowrap text-sm rounded-md shadow-sm"
            >
              <PlusIcon size={18} />
              <span>Mais Filtros</span>
            </button>
          </div>
        </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl p-8 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <FilterForm
              filters={filters}
              onFiltersChange={updateUrlWithFilters}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
