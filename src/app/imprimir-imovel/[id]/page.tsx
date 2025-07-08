// src/app/imprimir-imovel/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Imovel } from "@/types"; // Certifique-se de que este tipo está correto

const formatPrice = (price: number) => {
  if (!price || price === 0) return "A consultar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export default function ImprimirImovelPage() {
  const params = useParams();
  const imovelId = params.id as string;
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImovel() {
      if (!imovelId) {
        setError("ID do imóvel não fornecido.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "imoveis", imovelId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setImovel({ id: docSnap.id, ...docSnap.data() } as Imovel);
        } else {
          setError("Imóvel não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar imóvel para impressão:", err);
        setError("Erro ao carregar os dados do imóvel.");
      } finally {
        setLoading(false);
      }
    }

    fetchImovel();
  }, [imovelId]);

  useEffect(() => {
    // Automaticamente imprime quando o imóvel é carregado e não há erro
    if (!loading && !error && imovel) {
      window.print();
      // Opcional: fechar a aba após a impressão (nem todos os navegadores permitem por segurança)
      // window.onafterprint = () => window.close();
    }
  }, [loading, error, imovel]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">
          Carregando informações do imóvel para impressão...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <p className="text-xl text-red-700">Erro: {error}</p>
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-100">
        <p className="text-xl text-yellow-700">
          Imóvel não encontrado ou dados ausentes.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans text-gray-800 print:p-0">
      <h1 className="text-2xl font-bold mb-4 border-b pb-2 print:text-xl print:mb-2">
        Detalhes do Imóvel: {imovel.titulo} (Cód: {imovel.id})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 print:grid-cols-1 print:gap-y-2">
        {imovel.preco && (
          <p className="text-lg print:text-base">
            <strong className="font-semibold">Valor:</strong>{" "}
            {formatPrice(imovel.preco)}
          </p>
        )}
        {imovel.valorCondominio && imovel.valorCondominio > 0 && (
          <p className="text-lg print:text-base">
            <strong className="font-semibold">Condomínio:</strong>{" "}
            {formatPrice(imovel.valorCondominio)}
          </p>
        )}
        {imovel.valorIptu && imovel.valorIptu > 0 && (
          <p className="text-lg print:text-base">
            <strong className="font-semibold">IPTU:</strong>{" "}
            {formatPrice(imovel.valorIptu)}
          </p>
        )}
      </div>

      {imovel.descricao && (
        <div className="mb-6 print:mb-2">
          <h2 className="text-xl font-bold mb-2 border-b pb-1 print:text-lg print:mb-1">
            Descrição
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap print:text-sm">
            {imovel.descricao}
          </p>
        </div>
      )}

      {imovel.endereco && (
        <div className="mb-6 print:mb-2">
          <h2 className="text-xl font-bold mb-2 border-b pb-1 print:text-lg print:mb-1">
            Endereço
          </h2>
          <p className="text-gray-700 print:text-sm">
            {imovel.endereco.rua}, {imovel.endereco.numero}
            {imovel.endereco.complemento
              ? ` - ${imovel.endereco.complemento}`
              : ""}
            , {imovel.endereco.bairro}, {imovel.endereco.cidade} -{" "}
            {imovel.endereco.estado}
            {imovel.endereco.cep ? `, CEP: ${imovel.endereco.cep}` : ""}
          </p>
        </div>
      )}

      {/* Detalhes específicos do imóvel (quartos, banheiros, etc.) */}
      {(imovel.quartos ||
        imovel.suites ||
        imovel.banheiros ||
        imovel.vagas ||
        imovel.area ||
        imovel.area) && (
        <div className="mb-6 print:mb-2">
          <h2 className="text-xl font-bold mb-2 border-b pb-1 print:text-lg print:mb-1">
            Características Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 print:grid-cols-1 print:gap-y-1">
            {imovel.quartos && (
              <p className="text-gray-700 print:text-sm">
                <strong className="font-semibold">Quartos:</strong>{" "}
                {imovel.quartos}
              </p>
            )}
            {imovel.suites && (
              <p className="text-gray-700 print:text-sm">
                <strong className="font-semibold">Suítes:</strong>{" "}
                {imovel.suites}
              </p>
            )}
            {imovel.banheiros && (
              <p className="text-gray-700 print:text-sm">
                <strong className="font-semibold">Banheiros:</strong>{" "}
                {imovel.banheiros}
              </p>
            )}
            {imovel.vagas && (
              <p className="text-gray-700 print:text-sm">
                <strong className="font-semibold">Vagas de Garagem:</strong>{" "}
                {imovel.vagas}
              </p>
            )}
            {imovel.area && (
              <p className="text-gray-700 print:text-sm">
                <strong className="font-semibold">Área:</strong> {imovel.area}{" "}
                m²
              </p>
            )}
            {imovel.area && (
              <p className="text-gray-700 print:text-sm">
                <strong className="font-semibold">Área Construída:</strong>{" "}
                {imovel.area} m²
              </p>
            )}
          </div>
        </div>
      )}

      {/* Características do Imóvel (se existirem e forem verdadeiras) */}
      {imovel.caracteristicasImovel &&
        Object.values(imovel.caracteristicasImovel).some(
          (val) => val === true
        ) && (
          <div className="mb-6 print:mb-2">
            <h2 className="text-xl font-bold mb-2 border-b pb-1 print:text-lg print:mb-1">
              Características do Imóvel
            </h2>
            <ul className="list-disc list-inside text-gray-700 print:text-sm print:list-none print:pl-0">
              {Object.entries(imovel.caracteristicasImovel)
                .filter(([_, value]) => value === true)
                .map(([key]) => {
                  const formatted = key.replace(/([A-Z])/g, " $1");
                  return (
                    <li key={key}>
                      {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}

      {/* Características do Edifício (se existirem e forem verdadeiras/não "Nenhuma") */}
      {imovel.caracteristicasEdificio &&
        (Object.values(imovel.caracteristicasEdificio).some(
          (val) => val === true
        ) ||
          imovel.caracteristicasEdificio.tipoPortaria !== "Nenhuma") && (
          <div className="mb-6 print:mb-2">
            <h2 className="text-xl font-bold mb-2 border-b pb-1 print:text-lg print:mb-1">
              Características do Edifício
            </h2>
            <ul className="list-disc list-inside text-gray-700 print:text-sm print:list-none print:pl-0">
              {Object.entries(imovel.caracteristicasEdificio)
                .filter(
                  ([key, value]) => value === true && key !== "tipoPortaria"
                )
                .map(([key]) => {
                  const formatted = key.replace(/([A-Z])/g, " $1");
                  return (
                    <li key={key}>
                      {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
                    </li>
                  );
                })}
              {imovel.caracteristicasEdificio.tipoPortaria &&
                imovel.caracteristicasEdificio.tipoPortaria !== "Nenhuma" && (
                  <li>
                    Portaria: {imovel.caracteristicasEdificio.tipoPortaria}
                  </li>
                )}
            </ul>
          </div>
        )}

      {imovel.proprietario && (
        <div className="mb-6 print:mb-2">
          <h2 className="text-xl font-bold mb-2 border-b pb-1 print:text-lg print:mb-1">
            Dados do Proprietário
          </h2>
          <p className="text-gray-700 print:text-sm">
            <strong className="font-semibold">Nome:</strong>{" "}
            {imovel.proprietario.nome}
          </p>
          {imovel.proprietario.contato && (
            <p className="text-gray-700 print:text-sm">
              <strong className="font-semibold">Contato:</strong>{" "}
              {imovel.proprietario.contato}
            </p>
          )}
          {imovel.proprietario.contato && (
            <p className="text-gray-700 print:text-sm">
              <strong className="font-semibold">Email:</strong>{" "}
              {imovel.proprietario.contato}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 text-center text-gray-500 text-sm print:hidden">
        Esta é uma versão para impressão do imóvel.
      </div>
    </div>
  );
}
