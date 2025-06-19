// src/app/intranet/imoveis/editar/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockImoveis } from "@/lib/mockData";
import { Imovel } from "@/types";
import { PropertyForm } from "@/components/PropertyForm";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function EditarImovelPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // O estado começa como nulo, pois os dados ainda não foram carregados
  const [propertyData, setPropertyData] = useState<Partial<Imovel> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Efeito que busca os dados do imóvel ao carregar a página
  useEffect(() => {
    if (id) {
      const imovelEncontrado = mockImoveis.find((p) => p.id === id);
      if (imovelEncontrado) {
        setPropertyData(imovelEncontrado);
      } else {
        // Se não encontrar um imóvel com esse ID, marca como não encontrado
        setNotFound(true);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando alterações para o imóvel:", propertyData);

    // SIMULAÇÃO DE UMA CHAMADA DE API PARA ATUALIZAR
    setTimeout(() => {
      alert(
        "Alterações salvas com sucesso! (Simulação)\nEm uma aplicação real, os dados seriam atualizados no banco de dados."
      );
      setIsLoading(false);
      // Redireciona de volta para a lista após salvar
      router.push("/intranet/imoveis");
    }, 1500);
  };

  if (notFound) {
    return (
      <div className="container mx-auto text-center p-10">
        <h1 className="text-2xl font-bold text-red-600">
          Imóvel não encontrado
        </h1>
        <p className="text-gray-500 mt-2">
          O imóvel com o código "{id}" não existe.
        </p>
        <Link
          href="/intranet/imoveis"
          className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Voltar para a lista
        </Link>
      </div>
    );
  }
  // 1. Enquanto os dados não forem carregados, exibimos uma mensagem
  if (!propertyData) {
    return (
      <div className="text-center p-10">Carregando dados do imóvel...</div>
    );
  }

  // 2. Apenas depois que 'propertyData' tem um valor, renderizamos o formulário
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar Imóvel</h1>
      <p className="text-gray-500 mb-8">
        Alterando dados do imóvel:{" "}
        <span className="font-semibold text-gray-700">
          {propertyData.titulo}
        </span>{" "}
        (Cód: {propertyData.id})
      </p>

      <PropertyForm
        property={propertyData}
        setProperty={
          setPropertyData as React.Dispatch<
            React.SetStateAction<Partial<Imovel>>
          >
        }
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
