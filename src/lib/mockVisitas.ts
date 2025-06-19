// src/lib/mockVisitas.ts

import { Visita } from "@/types";

export const mockVisitas: Visita[] = [
  {
    id: "vis-01",
    imovelId: "1",
    imovelTitulo: "Apartamento Moderno na Savassi",
    imovelFoto: "/imoveis/imovel-1.jpg",
    nomeCliente: "Carlos Pereira",
    telefoneCliente: "5531988887777",
    data: "2025-06-20T10:00",
    corretorResponsavel: "Hebert",
    status: "Confirmada",
  },
  {
    id: "vis-02",
    imovelId: "2",
    imovelTitulo: "Casa Espaçosa com Quintal no Buritis",
    imovelFoto: "/imoveis/imovel-2.jpg",
    nomeCliente: "Juliana Costa",
    telefoneCliente: "5531977776666",
    data: "2025-06-20T14:30",
    corretorResponsavel: "Hebert",
    status: "Agendada",
  },
  {
    id: "vis-03",
    imovelId: "3",
    imovelTitulo: "Cobertura Duplex para Alugar no Lourdes",
    imovelFoto: "/imoveis/imovel-3.jpg",
    nomeCliente: "Marcos Andrade",
    telefoneCliente: "5531966665555",
    data: "2025-06-19T16:00",
    corretorResponsavel: "Hebert",
    status: "Realizada",
  },
  {
    id: "vis-04",
    imovelId: "6",
    imovelTitulo: "Apartamento para Alugar no Castelo",
    imovelFoto: "/imoveis/imovel-6.jpg",
    nomeCliente: "Fernanda Lima",
    telefoneCliente: "5531955554444",
    data: "2025-06-21T09:00",
    corretorResponsavel: "Hebert",
    status: "Cancelada",
  },
];
