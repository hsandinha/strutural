// src/types/index.ts
export interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  finalidade: "Comprar" | "Alugar";
  tipo: string;
  preco: number;
  valorCondominio: number;
  valorIptu: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  area: number;

  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };

  caracteristicasImovel: {
    aceitaPermuta?: boolean;
    churrasqueira?: boolean;
    closet?: boolean;
    dce?: boolean;
    lavabo?: boolean;
    mobiliado?: boolean;
    naPlanta?: boolean;
    alugado?: boolean;
  };

  caracteristicasEdificio: {
    piscina?: boolean;
    piscinaDeRaia?: boolean;
    quadraDeTenis?: boolean;
    academia?: boolean;
    areaDeLazer?: boolean;
    playground?: boolean;
    quadraEsportiva?: boolean;
    quadraDeAreia?: boolean;
    salaoDeJogos?: boolean;
    sauna?: boolean;
    portaoEletronico?: boolean;
    precisaDeAutorizacao?: boolean;
    mercadinho?: boolean;
    lavanderia?: boolean;

    // O campo que causava o erro, agora definido corretamente
    tipoPortaria: "Nenhuma" | "24h" | "Virtual" | "Diurna" | "Noturna";
  };

  proprietario: {
    nome: string;
    contato: string;
    horarioContato: string;
  };

  emDestaque: boolean;
  status: "Ativo" | "Vendido" | "Inativo";
  dataCadastro: string;
  fotos: string[];
  videoUrl?: string;
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

export interface User {
  id: string;
  nome: string;
  email: string;
  // Em uma aplicação real, esta senha seria um "hash" criptografado
  senha_plaintext: string;
  perfil: "cliente" | "corretor" | "admin";
}

export interface Visita {
  id: string;
  imovelId: string;
  imovelTitulo: string;
  imovelFoto: string;
  nomeCliente: string;
  telefoneCliente: string;
  data: string; // Usaremos o formato 'AAAA-MM-DDTHH:mm' para data e hora
  corretorResponsavel: string;
  status: "Agendada" | "Confirmada" | "Realizada" | "Cancelada";
}

export interface Corretor {
  id: string;
  nome: string;
}

export interface Lead {
  id: string;
  nome: string;
  contato: string; // Pode ser email ou telefone
  origem: "Portal Imobiliário" | "Redes Sociais" | "Indicação" | "Site";
  status: "Novo" | "Em Contato" | "Qualificado" | "Perdido";
  interesse: string; // Ex: "Apartamentos de 3 quartos na Savassi"
  dataCriacao: string;
  corretorAtribuido?: string;
}

export interface Lembrete {
  id: string;
  titulo: string;
  data: string; // Formato AAAA-MM-DDTHH:mm
  concluido: boolean;
  corretorId: string;
  imovelId?: string; // Lembrete pode ou não estar associado a um imóvel
  leadId?: string;
}
