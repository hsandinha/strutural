"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Imovel } from "@/types";
import { PropertyForm } from "@/components/PropertyForm";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditarImovelPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [propertyData, setPropertyData] = useState<Partial<Imovel> | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchImovel() {
      if (!id) return;

      const idStr = Array.isArray(id) ? id[0] : id;

      try {
        const docRef = doc(db, "imoveis", idStr);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPropertyData({
            id: docSnap.id,
            ...docSnap.data(),
          } as Partial<Imovel>);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
        setNotFound(true);
      }
    }

    fetchImovel();
  }, [id]);

  const storage = getStorage();

  // Função para upload das fotos selecionadas
  async function fazerUploadDasFotosSelecionadas(): Promise<string[]> {
    const urls: string[] = [];
    for (const arquivo of selectedFiles) {
      const storageRef = ref(storage, `imoveis/${Date.now()}_${arquivo.name}`);
      await uploadBytes(storageRef, arquivo);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyData || !id) return;

    setIsLoading(true);

    const idStr = Array.isArray(id) ? id[0] : id;

    try {
      let fotosAtualizadas = [...(propertyData.fotos || [])];

      if (selectedFiles.length > 0) {
        const urls = await fazerUploadDasFotosSelecionadas();
        fotosAtualizadas = [...fotosAtualizadas, ...urls];
        setSelectedFiles([]); // limpa arquivos locais após upload
      }

      const docRef = doc(db, "imoveis", idStr);

      // Atualiza o documento com os dados do formulário, incluindo fotos atualizadas
      await updateDoc(docRef, {
        ...propertyData,
        fotos: fotosAtualizadas,
      });

      alert("Alterações salvas com sucesso!");
      router.push("/intranet/imoveis");
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      alert("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (notFound) {
    return (
      <div className="container mx-auto text-center p-10">
        <h1 className="text-2xl font-bold text-red-600">
          Imóvel não encontrado
        </h1>
        <p className="text-gray-500 mt-2">
          O imóvel com o código "{Array.isArray(id) ? id[0] : id}" não existe.
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

  if (!propertyData) {
    return (
      <div className="text-center p-10 text-black">
        Carregando dados do imóvel...
      </div>
    );
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
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
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </div>
    </ProtectedRoute>
  );
}
