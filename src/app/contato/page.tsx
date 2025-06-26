"use client";

import { useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function ContatoPage() {
  const inputClass =
    "w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition";

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email) {
      alert("Por favor, preencha os campos obrigatórios: nome e email.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Buscar último lead para pegar o número sequencial
      const leadsRef = collection(db, "leads");
      const q = query(leadsRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let lastNum = 0;
      querySnapshot.forEach((doc) => {
        const idStr = doc.data().id as string; // ex: "lead-12"
        const num = parseInt(idStr.split("-")[1]);
        if (!isNaN(num) && num > lastNum) lastNum = num;
      });

      const newNum = lastNum + 1;
      const newId = `lead-${newNum}`;

      // Data atual no formato YYYY-MM-DD
      const now = new Date();
      const dataCriacao = now.toISOString().split("T")[0];

      // Montar objeto para salvar
      const leadData = {
        contato: email,
        corretorAtribuido: "Hebert",
        dataCriacao,
        id: newId,
        interesse: "Contato geral", // ou personalize conforme desejar
        nome,
        origem: "Site - Página Contato",
        status: "Qualificado",
        telefone,
        mensagem,
      };

      // Salvar no Firestore
      await setDoc(doc(db, "leads", newId), leadData);

      alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");

      // Limpar formulário
      setNome("");
      setEmail("");
      setTelefone("");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Tem alguma dúvida ou quer conversar sobre um imóvel? Preencha o
            formulário ou fale conosco!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Lado esquerdo: Mapa + contatos */}
            <div className="flex flex-col gap-8">
              {/* Mapa */}
              <div className="w-full h-64 rounded-xl overflow-hidden shadow">
                <iframe
                  title="Localização"
                  src="https://www.google.com/maps?q=-19.951551,-43.931652&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              {/* Contatos */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
                <div>
                  <span className="block text-sm text-gray-500">Endereço</span>
                  <span className="block text-base text-gray-800 font-semibold">
                    Av. Uruguai, 620 - 602 - Sion, Belo Horizonte - MG,
                    30310-300
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">WhatsApp</span>
                  <a
                    href="https://wa.me/3155994178066"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-base text-green-600 font-semibold hover:underline"
                  >
                    (31) 99417-8066
                  </a>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">E-mail</span>
                  <a
                    href="mailto:hebertsandinhacorretor@gmail.com"
                    className="block text-base text-gray-800 font-semibold hover:underline"
                  >
                    contato@struturalimoveis.com.br
                  </a>
                </div>
              </div>
            </div>
            {/* Lado direito: Formulário */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="nome"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nome
                      </label>
                      <input
                        type="text"
                        id="nome"
                        placeholder="Seu nome"
                        className={inputClass}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Seu e-mail"
                        className={inputClass}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      className={inputClass}
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="mensagem"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      rows={5}
                      placeholder="Digite sua mensagem"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition resize-none"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors text-lg tracking-wider"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
