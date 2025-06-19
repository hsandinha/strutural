// src/app/intranet/imoveis/novo/page.tsx
"use client";

import { useState } from "react";
import { Imovel } from "@/types";
import { PropertyForm } from "@/components/PropertyForm";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function AdicionarImovelPage() {
  const [newProperty, setNewProperty] = useState<Partial<Imovel>>({
    finalidade: "Comprar",
    status: "Ativo",
    emDestaque: false,
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    caracteristicasImovel: {},
    caracteristicasEdificio: {
      tipoPortaria: "Nenhuma", // valor inicial obrigatório
    },
    proprietario: {
      nome: "",
      contato: "",
      horarioContato: "",
    },
    fotos: [],
    dataCadastro: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando novo imóvel:", newProperty);

    // SIMULAÇÃO DE UMA CHAMADA DE API
    setTimeout(() => {
      alert(
        "Imóvel salvo com sucesso! (Simulação)\nVerifique o console para ver os dados."
      );
      setIsLoading(false);
      // Aqui, em um app real, você seria redirecionado para a página de gerenciamento
      // router.push('/intranet/imoveis');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/intranet/imoveis"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftCircle size={24} />
          Voltar para a lista de imóveis
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Adicionar Novo Imóvel
      </h1>

      {/* Usamos nosso componente de formulário reutilizável */}
      <PropertyForm
        property={newProperty}
        setProperty={setNewProperty}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
