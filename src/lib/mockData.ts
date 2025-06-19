// src/lib/mockData.ts
// src/lib/mockData.ts
import { Imovel } from "@/types";

export const mockImoveis: Imovel[] = [
  {
    id: "1",
    titulo: "Apartamento Moderno na Savassi",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "apartamento",
    descricao:
      "Um apartamento incrível com vista panorâmica e acabamento de primeira linha.",
    preco: 1250000,
    quartos: 3,
    banheiros: 2,
    area: 120,
    cidade: "Belo Horizonte",
    bairro: "Savassi",
    emDestaque: true,
    fotos: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070",
    ],
  },
  {
    id: "2",
    titulo: "Casa Espaçosa com Quintal no Buritis",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "casa",
    descricao:
      "Perfeita para famílias que buscam conforto e espaço verde, com área gourmet completa.",
    preco: 2500000,
    quartos: 4,
    banheiros: 3,
    area: 250,
    cidade: "Belo Horizonte",
    bairro: "Buritis",
    emDestaque: true,
    fotos: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974",
    ],
  },
  {
    id: "3",
    titulo: "Cobertura Duplex para Alugar",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "apartamento",
    descricao:
      "Vista deslumbrante da cidade, com piscina privativa e área de lazer completa.",
    preco: 12000, // Preço de aluguel
    quartos: 4,
    banheiros: 5,
    area: 350,
    cidade: "Belo Horizonte",
    bairro: "Lourdes",
    emDestaque: true,
    fotos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    ],
  },
  {
    id: "4",
    titulo: "Loja Comercial no Centro",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "loja",
    descricao:
      "Ponto comercial excelente com grande fluxo de pessoas, ideal para seu negócio.",
    preco: 4500, // Preço de aluguel
    quartos: 0,
    banheiros: 1,
    area: 80,
    cidade: "Belo Horizonte",
    bairro: "Centro",
    emDestaque: false,
    fotos: [
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974",
    ],
  },
  {
    id: "5",
    titulo: "Terreno em Condomínio Fechado",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "terreno",
    descricao:
      "Ótima oportunidade para construir a casa dos seus sonhos em local seguro e tranquilo.",
    preco: 950000,
    quartos: 0,
    banheiros: 0,
    area: 1000,
    cidade: "Nova Lima",
    bairro: "Alphaville",
    emDestaque: false,
    fotos: [
      "https://images.unsplash.com/photo-1530906358829-e84b276907de?q=80&w=2070",
    ],
  },
  {
    id: "6",
    titulo: "Apartamento para Alugar no Castelo",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "apartamento",
    descricao:
      "Apartamento aconchegante, recém-reformado, próximo a comércios e parques.",
    preco: 2800, // Preço de aluguel
    quartos: 2,
    banheiros: 2,
    area: 75,
    cidade: "Belo Horizonte",
    bairro: "Castelo",
    emDestaque: true,
    fotos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070",
    ],
  },
  {
    id: "7",
    titulo: "Cobertura Duplex para Alugar",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "cobertura",
    descricao:
      "Vista deslumbrante da cidade, com piscina privativa e área de lazer completa.",
    preco: 12000, // Preço de aluguel
    quartos: 4,
    banheiros: 5,
    area: 350,
    cidade: "Belo Horizonte",
    bairro: "Lourdes",
    emDestaque: true,
    fotos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    ],
  },
  {
    id: "8",
    titulo: "Cobertura Duplex para Alugar",
    finalidade: "Comprar", // <-- Adicionado
    tipo: "apartamento",
    descricao:
      "Vista deslumbrante da cidade, com piscina privativa e área de lazer completa.",
    preco: 12000, // Preço de aluguel
    quartos: 4,
    banheiros: 5,
    area: 350,
    cidade: "Belo Horizonte",
    bairro: "Lourdes",
    emDestaque: true,
    fotos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    ],
  },
];
