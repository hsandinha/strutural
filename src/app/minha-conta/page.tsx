"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Link from "next/link";

interface ImovelFavorito {
  id: string;
  titulo: string;
  endereco: {
    bairro: string;
    cidade: string;
  };
  preco: number;
  fotos: string[];
}

export default function MinhaContaPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<ImovelFavorito[]>([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const perfil = userDoc.data().perfil;
          if (perfil === "admin" || perfil === "corretor") {
            router.replace("/intranet/dashboard");
          } else {
            setUserName(userDoc.data().nome || "Usuário");
            await carregarFavoritos(user.uid);
          }
        } else {
          router.replace("/login");
        }
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  async function carregarFavoritos(uid: string) {
    setLoadingFavoritos(true);
    try {
      const favoritosRef = collection(db, "favoritos");
      const q = query(favoritosRef, where("userId", "==", uid));
      const snapshot = await getDocs(q);

      const imoveisFavoritos: ImovelFavorito[] = [];

      for (const docSnap of snapshot.docs) {
        const favoritoData = docSnap.data();
        const imovelId = favoritoData.imovelId;
        const imovelDoc = await getDoc(doc(db, "imoveis", imovelId));
        if (imovelDoc.exists()) {
          const imovelData = imovelDoc.data();
          imoveisFavoritos.push({
            id: imovelDoc.id,
            titulo: imovelData.titulo,
            endereco: imovelData.endereco,
            preco: imovelData.preco,
            fotos: imovelData.fotos,
          });
        }
      }

      setFavoritos(imoveisFavoritos);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoadingFavoritos(false);
    }
  }

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <header className="flex justify-between items-center mb-8">
          <div className="bg-white p-6 rounded shadow flex flex-wrap gap-4 items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Olá, {userName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Seja bem-vindo de volta à sua área.
              </p>
            </div>

            <Link
              href="/minha-conta/editar"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Editar Perfil
            </Link>
            <Link
              href="/comprar"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Pesquisar mais imóveis
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </header>
        <section>
          <h2 className="text-2xl  text-black font-semibold mb-4">
            Imóveis Favoritos
          </h2>
          {loadingFavoritos ? (
            <p>Carregando seus favoritos...</p>
          ) : favoritos.length === 0 ? (
            <p>Você ainda não favoritou nenhum imóvel.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritos.map((imovel) => (
                <li
                  key={imovel.id}
                  className="bg-white rounded shadow overflow-hidden"
                >
                  <Link href={`/imoveis/${imovel.id}`} className="block">
                    <img
                      src={imovel.fotos[0]}
                      alt={imovel.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{imovel.titulo}</h3>
                      <p className="text-gray-600">
                        {imovel.endereco.bairro}, {imovel.endereco.cidade}
                      </p>
                      <p className="text-blue-700 font-bold mt-2">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(imovel.preco)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
