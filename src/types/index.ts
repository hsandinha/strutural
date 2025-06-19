// src/types/index.ts
export interface Imovel {
  id: string;
  titulo: string;
  tipo?:
    | "apartamento"
    | "casa"
    | "cobertura"
    | "terreno"
    | "loja"
    | "casa-condominio"
    | "apto-area-privativa"
    | "andar-corrido"
    | "casa-comercial"
    | "estacionamento"
    | "fazendas-sitios"
    | "flat-hotel-apart"
    | "galpao"
    | "predio-comercial"
    | "sala"
    | "vaga-de-garagem";
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
  finalidade: "Comprar";
  localizacao: string[];
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
