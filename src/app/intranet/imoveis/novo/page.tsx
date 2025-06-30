"use client";

import { useState } from "react";
import { Imovel } from "@/types";
import { PropertyForm } from "@/components/PropertyForm";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { criarImovelComIdSequencial } from "@/lib/firestoreUtils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdicionarImovelPage() {
  const [newProperty, setNewProperty] = useState<Partial<Imovel>>({
    titulo: "",
    descricao: "",
    preco: 0,
    valorCondominio: 0,
    valorIptu: 0,
    quartos: 0,
    suites: 0,
    banheiros: 0,
    vagas: 0,
    area: 0,
    finalidade: "Comprar",
    tipo: "",
    emDestaque: false,
    status: "Ativo",
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
      tipoPortaria: "Nenhuma",
    },
    proprietario: {
      nome: "",
      contato: "",
      horarioContato: "",
    },
    fotos: [],
    videoUrl: "",
    dataCadastro: new Date().toISOString(),
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const storage = getStorage();

  // Upload das fotos selecionadas e retorno das URLs
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

  // Submit do formulário: upload fotos e salvar imóvel
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fotosAtualizadas = [...(newProperty.fotos || [])];

      if (selectedFiles.length > 0) {
        const urls = await fazerUploadDasFotosSelecionadas();
        fotosAtualizadas = [...fotosAtualizadas, ...urls];
        setSelectedFiles([]); // limpa arquivos locais após upload
      }

      const dataToSave: Omit<Imovel, "id"> = {
        titulo: newProperty.titulo || "",
        descricao: newProperty.descricao || "",
        preco: newProperty.preco || 0,
        valorCondominio: newProperty.valorCondominio || 0,
        valorIptu: newProperty.valorIptu || 0,
        quartos: newProperty.quartos || 0,
        suites: newProperty.suites || 0,
        banheiros: newProperty.banheiros || 0,
        vagas: newProperty.vagas || 0,
        area: newProperty.area || 0,
        finalidade: newProperty.finalidade || "Comprar",
        tipo: newProperty.tipo || "",
        emDestaque: newProperty.emDestaque || false,
        status: newProperty.status || "Ativo",
        dataCadastro: Timestamp.now().toDate().toISOString(),
        endereco: newProperty.endereco || {
          rua: "",
          numero: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
        },
        caracteristicasImovel: newProperty.caracteristicasImovel || {},
        caracteristicasEdificio: newProperty.caracteristicasEdificio || {
          tipoPortaria: "Nenhuma",
        },
        proprietario: newProperty.proprietario || {
          nome: "",
          contato: "",
          horarioContato: "",
        },
        fotos: fotosAtualizadas,
        videoUrl: newProperty.videoUrl || "",
      };

      const novoId = await criarImovelComIdSequencial(dataToSave);

      alert(`Imóvel salvo com sucesso! ID: ${novoId}`);
      router.push("/intranet/imoveis");
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      alert("Erro ao salvar imóvel. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Adicionar Novo Imóvel
        </h1>

        <PropertyForm
          property={newProperty}
          setProperty={setNewProperty}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </div>
    </ProtectedRoute>
  );
}
