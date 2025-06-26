"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import InputMask from "react-input-mask";

interface Endereco {
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export default function EditarPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [endereco, setEndereco] = useState<Endereco>({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email || "");
      setEmailInput(user.email || "");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNome(data.nome || "");
        setWhatsapp(data.whatsapp || "");
        setEndereco({
          rua: data.endereco?.rua || "",
          numero: data.endereco?.numero || "",
          bairro: data.endereco?.bairro || "",
          cidade: data.endereco?.cidade || "",
          estado: data.endereco?.estado || "",
          cep: data.endereco?.cep || "",
        });
      } else {
        setError("Dados do usuário não encontrados.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleChangeEndereco = (field: keyof Endereco, value: string) => {
    setEndereco((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    // Regex simples para validar email
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (!nome.trim()) {
      setError("O nome é obrigatório.");
      setSaving(false);
      return;
    }

    if (!validateEmail(emailInput)) {
      setError("Email inválido.");
      setSaving(false);
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("Usuário não autenticado.");
        setSaving(false);
        return;
      }

      // Atualizar email se mudou
      if (emailInput !== email) {
        await updateEmail(user, emailInput);
        setEmail(emailInput);
      }

      // Atualizar nome, whatsapp e endereço no Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        nome,
        whatsapp,
        endereco,
      });

      setSuccess("Perfil atualizado com sucesso!");
      // Opcional: redirecionar após sucesso
      router.push("/minha-conta");
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      if (err.code === "auth/requires-recent-login") {
        setError("Por segurança, faça login novamente para atualizar o email.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Este email já está em uso por outro usuário.");
      } else {
        setError("Erro ao salvar perfil. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Carregando dados...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-lg bg-white p-8 rounded shadow">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl text-black font-bold mb-6">Editar Perfil</h1>

        {error && (
          <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
        )}
        {success && (
          <p className="mb-4 text-green-600 font-semibold text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block font-medium mb-1 text-black">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-medium mb-1 text-black"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="block font-medium mb-1 text-black"
            >
              WhatsApp
            </label>
            <InputMask
              mask="(99) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            >
              {(inputProps: any) => (
                <input
                  {...inputProps}
                  id="whatsapp"
                  type="tel"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  placeholder="(31) 99999-9999"
                />
              )}
            </InputMask>
          </div>

          <fieldset className="border border-gray-300 rounded p-4 text-black">
            <legend className="font-semibold mb-2">Endereço</legend>

            <div className="mb-4">
              <label
                htmlFor="rua"
                className="block font-medium mb-1 text-black"
              >
                Rua
              </label>
              <input
                id="rua"
                type="text"
                value={endereco.rua || ""}
                onChange={(e) => handleChangeEndereco("rua", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="numero"
                className="block font-medium mb-1 text-black"
              >
                Número
              </label>
              <input
                id="numero"
                type="text"
                value={endereco.numero || ""}
                onChange={(e) => handleChangeEndereco("numero", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="bairro"
                className="block font-medium mb-1 text-black"
              >
                Bairro
              </label>
              <input
                id="bairro"
                type="text"
                value={endereco.bairro || ""}
                onChange={(e) => handleChangeEndereco("bairro", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="cidade"
                className="block font-medium mb-1 text-black"
              >
                Cidade
              </label>
              <input
                id="cidade"
                type="text"
                value={endereco.cidade || ""}
                onChange={(e) => handleChangeEndereco("cidade", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="estado"
                className="block font-medium mb-1 text-black"
              >
                Estado
              </label>
              <input
                id="estado"
                type="text"
                value={endereco.estado || ""}
                onChange={(e) => handleChangeEndereco("estado", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="cep"
                className="block font-medium mb-1 text-black"
              >
                CEP
              </label>
              <InputMask
                mask="99999-999"
                value={endereco.cep || ""}
                onChange={(e) => handleChangeEndereco("cep", e.target.value)}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    id="cep"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    placeholder="12345-678"
                  />
                )}
              </InputMask>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </main>
  );
}
