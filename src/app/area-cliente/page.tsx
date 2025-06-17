// src/app/area-cliente/page.tsx

import Image from "next/image";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function AreaClientePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md m-4">
        {/* Logo */}
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
            Bem-vindo de volta! Faça login para continuar.
          </p>
        </div>

        {/* Formulário de Login */}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400"
                placeholder="seuemail@exemplo.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400"
                placeholder="Sua senha"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700"
            >
              ENTRAR
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Ainda não tem uma conta?{" "}
          <Link
            href="/cadastrar"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
