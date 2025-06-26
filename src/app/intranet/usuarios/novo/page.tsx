"use client";

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

export default function CadastroUsuario() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [perfil, setPerfil] = useState<"admin" | "corretor">("corretor");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    if (!nome || !email || !senha) {
      setError("Preencha todos os campos obrigatórios.");
      setIsSaving(false);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      // Salvar dados no Firestore com o perfil selecionado
      await setDoc(doc(db, "users", user.uid), {
        nome,
        email,
        whatsapp,
        perfil,
        criadoEm: new Date(),
      });

      router.push("/intranet/dashboard"); // ou outra página após cadastro
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email já está em uso.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("Senha muito fraca.");
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow text-black">
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:underline"
            type="button"
          >
            &larr; Voltar
          </button>
          <h1 className="text-2xl font-bold mb-6">Cadastrar Usuário</h1>
          {error && <p className="mb-4 text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-black">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="(xx) xxxxx-xxxx"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Perfil</label>
              <select
                value={perfil}
                onChange={(e) =>
                  setPerfil(e.target.value as "admin" | "corretor")
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="corretor">Corretor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSaving ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
