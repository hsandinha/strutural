"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { ArrowLeftCircle } from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

type Imovel = {
  id: string;
  titulo: string;
  endereco?: {
    rua: string;
    numero: string | number;
    bairro?: string;
    cidade?: string;
  };
};

type Usuario = {
  id: string;
  nome: string;
  whatsapp?: string;
  perfil?: string;
};

type Favorito = {
  id: string;
  imovelId: string;
  userId: string;
  criadoEm: any; // Timestamp
};

export default function UsuariosFavoritosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [favoritosMap, setFavoritosMap] = useState<Record<string, Favorito[]>>(
    {}
  );
  const [imoveisMap, setImoveisMap] = useState<Record<string, Imovel>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Buscar usuários clientes
        const usuariosSnapshot = await getDocs(
          query(collection(db, "users"), where("perfil", "==", "cliente"))
        );
        const usuariosData: Usuario[] = usuariosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Usuario, "id">),
        }));

        // 2. Buscar todos os favoritos dos usuários clientes
        const favoritosSnapshot = await getDocs(collection(db, "favoritos"));
        const favoritosData: Favorito[] = favoritosSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Favorito, "id">),
          }))
          // filtrar só favoritos dos usuários clientes
          .filter((fav) => usuariosData.some((u) => u.id === fav.userId));

        // 3. Mapear favoritos por userId
        const mapFavoritosPorUsuario: Record<string, Favorito[]> = {};
        favoritosData.forEach((fav) => {
          if (!mapFavoritosPorUsuario[fav.userId]) {
            mapFavoritosPorUsuario[fav.userId] = [];
          }
          mapFavoritosPorUsuario[fav.userId].push(fav);
        });

        // 4. Buscar imóveis únicos dos favoritos
        const imovelIdsUnicos = Array.from(
          new Set(favoritosData.map((fav) => fav.imovelId))
        );

        const imoveisCollection = collection(db, "imoveis");
        const imoveisData: Record<string, Imovel> = {};

        await Promise.all(
          imovelIdsUnicos.map(async (id) => {
            const imovelDoc = await getDoc(doc(imoveisCollection, id));
            if (imovelDoc.exists()) {
              imoveisData[id] = {
                id: imovelDoc.id,
                ...(imovelDoc.data() as Omit<Imovel, "id">),
              };
            }
          })
        );

        setUsuarios(usuariosData);
        setFavoritosMap(mapFavoritosPorUsuario);
        setImoveisMap(imoveisData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">Carregando usuários e favoritos...</div>
    );
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <main className="container mx-auto p-6">
        <Link
          href="/intranet/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
        >
          <ArrowLeftCircle size={20} /> Voltar ao Dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-6 text-black">
          Usuários Clientes e Imóveis Favoritos
        </h1>

        {usuarios.length === 0 ? (
          <p>Nenhum usuário cliente encontrado.</p>
        ) : (
          usuarios.map((usuario) => {
            const whatsappFormatado = usuario.whatsapp
              ? usuario.whatsapp.replace(/\D/g, "")
              : "";

            const favoritosUsuario = favoritosMap[usuario.id] || [];

            return (
              <div
                key={usuario.id}
                className="mb-8 p-6 border rounded-lg shadow-sm text-black"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{usuario.nome}</h2>
                    <p className="text-sm text-gray-600">
                      WhatsApp: {usuario.whatsapp || "Não informado"}
                    </p>
                  </div>
                  {whatsappFormatado ? (
                    <a
                      href={`https://wa.me/${whatsappFormatado}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Enviar WhatsApp
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">
                      WhatsApp não disponível
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Imóveis Favoritos:</h3>
                  {favoritosUsuario.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {favoritosUsuario.map((fav) => {
                        const imovel = imoveisMap[fav.imovelId];
                        if (!imovel) return null;
                        return (
                          <li key={fav.id}>
                            <strong>
                              <a
                                href={`/imoveis/${imovel.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                [{imovel.id}]
                              </a>{" "}
                              - {imovel.titulo}
                            </strong>
                            {imovel.endereco && (
                              <span>
                                {" "}
                                - {imovel.endereco.rua},{" "}
                                {imovel.endereco.numero}
                                {imovel.endereco.bairro
                                  ? `, ${imovel.endereco.bairro}`
                                  : ""}
                                {imovel.endereco.cidade
                                  ? ` - ${imovel.endereco.cidade}`
                                  : ""}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Nenhum imóvel favoritado.</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </ProtectedRoute>
  );
}
