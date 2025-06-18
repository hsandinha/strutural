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
  codigo: string;
  finalidade: "Comprar";
  localizacao: string;
  tipo: string[]; // <-- MUDADO DE VOLTA PARA 'tipo'
  quartos: string;
  banheiros: string;
  suites: string;
  vagas: string;
  valorMin: string;
  valorMax: string;
  areaMin: string;
  areaMax: string;
  caracteristicasImovel: string[];
  caracteristicasEdificio: string[];
};
