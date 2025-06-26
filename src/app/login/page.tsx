"use client";

import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal "Esqueci minha senha"
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const perfil = userDoc.data().perfil;
          if (perfil === "admin" || perfil === "corretor") {
            router.replace("/intranet/dashboard");
          } else {
            router.replace("/minha-conta");
          }
        } else {
          router.replace("/login");
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.trim() || !senha.trim()) {
      setError("Por favor, preencha email e senha.");
      setIsLoading(false);
      return;
    }

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("Perfil do usuário não encontrado.");
        setIsLoading(false);
        return;
      }
      const perfil = userDoc.data().perfil;
      if (perfil === "admin" || perfil === "corretor") {
        router.push("/intranet/dashboard");
      } else {
        router.push("/minha-conta");
      }
    } catch (err: any) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Email ou senha inválidos.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    setResetError("");
    setResetSuccess("");

    if (!resetEmail.trim()) {
      setResetError("Por favor, informe seu email.");
      return;
    }

    setIsSendingReset(true);
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(
        "Email de redefinição enviado! Verifique sua caixa de entrada."
      );
      // Fecha modal após 3 segundos
      setTimeout(() => {
        setShowModal(false);
        setResetSuccess("");
      }, 3000);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setResetError("Usuário não encontrado com esse email.");
      } else if (err.code === "auth/invalid-email") {
        setResetError("Email inválido.");
      } else {
        setResetError("Erro ao enviar email. Tente novamente.");
      }
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Se quiser, crie o usuário no Firestore aqui com perfil padrão
        // await setDoc(doc(db, "users", user.uid), { nome: user.displayName, perfil: "cliente", email: user.email });
        setError("Usuário não cadastrado no sistema.");
        setIsLoading(false);
        return;
      }
      const perfil = userDoc.data().perfil;
      if (perfil === "admin" || perfil === "corretor") {
        router.push("/intranet/dashboard");
      } else {
        router.push("/minha-conta");
      }
    } catch (err: any) {
      setError("Erro ao fazer login com Google. Tente novamente.");
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Acesse sua Conta
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seuemail@exemplo.com"
              />
            </div>
            <div>
              <label htmlFor="senha" className="text-sm font-medium text-black">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 mt-1 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
            </div>
            {error && (
              <p className="text-sm text-center text-red-600">{error}</p>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>

          <button
            onClick={() => setShowModal(true)}
            className="w-full text-center text-blue-600 hover:underline"
            type="button"
          >
            Esqueci minha senha
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full mt-4 px-4 py-2 font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
          >
            {isLoading ? "Carregando..." : "Entrar com Google"}
          </button>

          <div className="text-center mt-6 text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a
              href="/cadastre-se"
              className="font-medium text-blue-600 hover:underline"
            >
              Cadastre-se
            </a>
          </div>
        </div>
      </main>

      {/* Modal Esqueci minha senha */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <h2 className="text-xl text-black font-semibold mb-4">
              Redefinir Senha
            </h2>
            <label
              htmlFor="resetEmail"
              className="block mb-2 font-medium text-black "
            >
              Informe seu email
            </label>
            <input
              id="resetEmail"
              type="email"
              value={resetEmail || email}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black "
              placeholder="seuemail@exemplo.com"
            />
            {resetError && <p className="text-red-600 mb-2">{resetError}</p>}
            {resetSuccess && (
              <p className="text-green-600 mb-2">{resetSuccess}</p>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 text-black "
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendResetEmail}
                disabled={isSendingReset}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                type="button"
              >
                {isSendingReset ? "Enviando..." : "Enviar email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
