// src/types/index.ts
export interface Imovel {
  id: string;
  titulo: string;
  tipo: string;
  finalidade: string;
  descricao: string;
  preco: number;
  quartos: number;
  banheiros: number;
  area: number;
  cidade: string;
  bairro: string;
  emDestaque: boolean;
  fotos: string[];
}

export type SearchFilters = {
  finalidade: string;
  tipo: string;
  localizacao: string;
  quartos: string;
  valorMin: string;
  valorMax: string;
};
