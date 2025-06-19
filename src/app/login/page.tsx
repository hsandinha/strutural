// src/app/login/page.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (data.sucesso) {
        // Login bem-sucedido, agora redirecionamos
        const perfil = data.usuario.perfil;
        if (perfil === "admin" || perfil === "corretor") {
          router.push("/intranet/dashboard"); // Redireciona para o dashboard da intranet
        } else {
          router.push("/minha-conta"); // Redireciona para a área do cliente
        }
      } else {
        // Login falhou
        setError(data.mensagem || "Ocorreu um erro.");
      }
    } catch (err) {
      setError("Falha ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <Image
            src="/strutural.png" // Verifique se o caminho do seu logo está correto
            alt="Logo da Strutural Imobiliária"
            width={220}
            height={60}
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Acesse sua Conta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bem-vindo! Faça login para continuar.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              name="email"
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
              name="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2 mt-1 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
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
        <p className="text-sm text-center text-gray-600">
          Não tem uma conta?{" "}
          <Link
            href="/cadastre-se"
            className="font-medium text-blue-600 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
