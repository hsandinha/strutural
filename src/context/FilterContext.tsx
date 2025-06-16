// src/context/FilterContext.tsx
"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// 1. Definimos o tipo exato para os nossos filtros globais
type GlobalFiltersState = {
  finalidade: string;
  lancamento: boolean;
  tipo: string;
};

// 2. Definimos como será o nosso contexto, usando o tipo que criamos
interface FilterContextType {
  filters: GlobalFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFiltersState>>;
}

// Criamos o Contexto com um valor padrão
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// O "Provedor" que vai guardar o estado
export function FilterProvider({ children }: { children: ReactNode }) {
  // 3. Usamos o tipo no nosso estado inicial, em vez de 'any'
  const [filters, setFilters] = useState<GlobalFiltersState>({
    finalidade: "todos",
    lancamento: true,
    tipo: "todos",
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

// O "Hook" customizado para facilitar o uso do contexto
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
