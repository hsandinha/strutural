"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { Lead } from "@/types";
import { LeadForm } from "@/components/intranet/LeadForm";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

export default function EditarLeadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [corretores, setCorretores] = useState<{ id: string; nome: string }[]>(
    []
  );
  const [leadData, setLeadData] = useState<Partial<Lead> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Busca os dados do lead
  useEffect(() => {
    async function fetchLead() {
      if (!id) return;

      try {
        const docRef = doc(db, "leads", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLeadData({ id: docSnap.id, ...docSnap.data() } as Partial<Lead>);
        } else {
          alert("Lead não encontrado!");
          router.push("/intranet/leads");
        }
      } catch (error) {
        console.error("Erro ao buscar lead:", error);
        alert("Erro ao carregar lead.");
        router.push("/intranet/leads");
      } finally {
        setLoadingData(false);
      }
    }

    fetchLead();
  }, [id, router]);

  // Busca os corretores
  useEffect(() => {
    async function fetchCorretores() {
      try {
        const corretoresRef = collection(db, "corretores");
        const snapshot = await getDocs(corretoresRef);
        const listaCorretores = snapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCorretores(listaCorretores);
      } catch (error) {
        console.error("Erro ao buscar corretores:", error);
      }
    }
    fetchCorretores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData || !id) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const docRef = doc(db, "leads", id);
      await updateDoc(docRef, leadData);
      setSuccessMessage("Alterações salvas com sucesso!");
      setTimeout(() => {
        router.push("/intranet/leads");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      setErrorMessage("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return <div className="text-center p-10">Carregando dados do lead...</div>;
  }

  if (!leadData) {
    return null;
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href={`/intranet/leads/${id}`}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeftCircle size={24} /> Voltar para os Detalhes do Lead
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Editar Lead: <span className="font-normal">{leadData.nome}</span>
        </h1>

        <LeadForm
          lead={leadData}
          setLead={setLeadData as any}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText="Salvar Alterações"
          corretores={corretores}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>
    </ProtectedRoute>
  );
}
