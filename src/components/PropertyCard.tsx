"use client";

import { useState, useEffect } from "react";
import { Imovel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Scan } from "lucide-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface PropertyCardProps {
  imovel: Imovel;
}

const formatPrice = (price: number) => {
  if (!price) return "A consultar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export function PropertyCard({ imovel }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPerfil, setUserPerfil] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const router = useRouter();

  // Observar usuário logado e buscar perfil
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Buscar perfil do usuário
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserPerfil(userDoc.data().perfil || null);
        } else {
          setUserPerfil(null);
        }
      } else {
        setUserId(null);
        setUserPerfil(null);
        setIsFavorited(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Verificar se imóvel está favoritado pelo usuário (somente se perfil for cliente)
  useEffect(() => {
    if (!userId || !userPerfil) return;
    if (userPerfil === "admin" || userPerfil === "corretor") {
      setIsFavorited(false);
      return;
    }

    async function checkFavorite() {
      const favoritosRef = collection(db, "favoritos");
      const q = query(
        favoritosRef,
        where("userId", "==", userId),
        where("imovelId", "==", imovel.id)
      );
      const snapshot = await getDocs(q);
      setIsFavorited(!snapshot.empty);
    }

    checkFavorite();
  }, [userId, userPerfil, imovel.id]);

  // Função para favoritar/desfavoritar
  const toggleFavorite = async () => {
    if (!userId) {
      alert("Você precisa estar logado para favoritar imóveis.");
      router.push("/login");
      return;
    }
    if (userPerfil === "admin" || userPerfil === "corretor") {
      alert("Administradores e corretores não podem favoritar imóveis.");
      return;
    }
    setLoadingFavorite(true);

    try {
      const favoritosRef = collection(db, "favoritos");
      const q = query(
        favoritosRef,
        where("userId", "==", userId),
        where("imovelId", "==", imovel.id)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Adicionar favorito
        await addDoc(favoritosRef, {
          userId,
          imovelId: imovel.id,
          criadoEm: new Date(),
        });
        setIsFavorited(true);
      } else {
        // Remover favorito
        const batchDeletes = snapshot.docs.map((docSnap) =>
          deleteDoc(doc(db, "favoritos", docSnap.id))
        );
        await Promise.all(batchDeletes);
        setIsFavorited(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      alert("Erro ao atualizar favorito. Tente novamente.");
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-56">
        <button
          onClick={toggleFavorite}
          disabled={loadingFavorite}
          className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          aria-label={
            isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          title={
            isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          type="button"
        >
          <Heart
            size={20}
            className={isFavorited ? "text-red-500" : "text-gray-600"}
            fill={isFavorited ? "currentColor" : "none"}
          />
        </button>

        {isHovered && imovel.fotos.length > 1 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            className="h-full w-full"
            style={
              {
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
                "--swiper-navigation-size": "15px",
              } as React.CSSProperties
            }
          >
            {imovel.fotos.map((foto, index) => (
              <SwiperSlide key={index} className="overflow-hidden">
                <Link
                  href={`/imoveis/${imovel.id}`}
                  className="block h-full w-full"
                >
                  <Image
                    src={foto}
                    alt={`Foto ${index + 1} de ${imovel.titulo}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Link href={`/imoveis/${imovel.id}`} className="block h-full w-full">
            <Image
              src={imovel.fotos[0]}
              alt={imovel.titulo}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {imovel.titulo}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {imovel.endereco.bairro}, {imovel.endereco.cidade}
        </p>

        <div className="mt-auto">
          <p className="text-2xl font-bold text-blue-700 mb-4">
            {formatPrice(imovel.preco)}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3">
            <span className="flex items-center gap-2">
              <Bed size={16} /> {imovel.quartos}
            </span>
            <span className="flex items-center gap-2">
              <Bath size={16} /> {imovel.banheiros}
            </span>
            <span className="flex items-center gap-2">
              <Scan size={16} /> {imovel.area} m²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
