// src/app/area-cliente/dashboard/page.tsx
import { Heart, User, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800">Olá, Hebert!</h1>
        <p className="text-gray-600 mt-1">
          Seja bem-vindo de volta à sua área.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {/* Card de Favoritos */}
          <Link
            href="/area-cliente/favoritos"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
          >
            <Heart className="w-10 h-10 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Meus Favoritos</h2>
            <p className="text-gray-600 mt-2">
              Veja e gerencie os imóveis que você salvou.
            </p>
          </Link>

          {/* Card de Editar Perfil */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 opacity-50 cursor-not-allowed">
            <User className="w-10 h-10 text-blue-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Editar Perfil</h2>
            <p className="text-gray-600 mt-2">
              Atualize seus dados de contato e senha (em breve).
            </p>
          </div>

          {/* Card de Logout */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 opacity-50 cursor-not-allowed">
            <LogOut className="w-10 h-10 text-gray-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Sair</h2>
            <p className="text-gray-600 mt-2">
              Desconecte-se da sua conta com segurança (em breve).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
