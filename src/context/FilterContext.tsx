// src/context/FilterContext.tsx

"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// 1. Definimos o formato do nosso contexto
interface FilterContextType {
  filters: {
    finalidade: string;
    tipo: string;
    lancamento: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

// 2. Criamos o Contexto com um valor padrão
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// 3. Criamos o "Provedor", o componente que vai guardar o estado
export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState({
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

// 4. Criamos um "Hook" customizado para facilitar o uso do contexto
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
