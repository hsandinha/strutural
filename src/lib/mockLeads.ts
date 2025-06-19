// src/lib/mockLeads.ts
import { Lead } from "@/types";

export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    nome: "Mariana Vasconcelos",
    contato: "mariana.v@email.com",
    origem: "Portal Imobiliário",
    status: "Em Contato",
    interesse: "Coberturas no Lourdes",
    dataCriacao: "2025-06-19",
    corretorAtribuido: "Hebert",
  },
  {
    id: "lead-2",
    nome: "Ricardo Neves",
    contato: "(31) 99876-5432",
    origem: "Site",
    status: "Novo",
    interesse: "Casas no Buritis",
    dataCriacao: "2025-06-19",
  },
  {
    id: "lead-3",
    nome: "Beatriz Almeida",
    contato: "bia.almeida@email.com",
    origem: "Indicação",
    status: "Qualificado",
    interesse: "Loja comercial no Centro",
    dataCriacao: "2025-06-18",
    corretorAtribuido: "Hebert",
  },
  {
    id: "lead-4",
    nome: "Felipe Campos",
    contato: "(31) 98888-1234",
    origem: "Redes Sociais",
    status: "Perdido",
    interesse: "Qualquer apartamento barato",
    dataCriacao: "2025-06-17",
    corretorAtribuido: "Hebert",
  },
];
