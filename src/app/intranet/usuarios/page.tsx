"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FilePenLine,
  UserX,
  UserCheck,
  AlertTriangle,
  Search,
  ArrowLeftCircle,
} from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: "admin" | "corretor" | string;
  ativo: boolean;
  criadoEm: any;
}

export default function GerenciarUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [usuarioParaAcao, setUsuarioParaAcao] = useState<{
    usuario: Usuario;
    acao: "inativar" | "ativar" | "excluir";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      try {
        const usuariosRef = collection(db, "users");
        const snapshot = await getDocs(usuariosRef);
        const listaUsuarios = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Usuario[];
        setUsuarios(listaUsuarios);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  const confirmarAcao = async () => {
    if (!usuarioParaAcao) return;

    const { usuario, acao } = usuarioParaAcao;

    try {
      const docRef = doc(db, "users", usuario.id);

      if (acao === "excluir") {
        await deleteDoc(docRef);
        setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
      } else {
        await updateDoc(docRef, { ativo: acao === "ativar" });
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === usuario.id ? { ...u, ativo: acao === "ativar" } : u
          )
        );
      }

      setUsuarioParaAcao(null);
    } catch (error) {
      console.error("Erro ao executar ação:", error);
      alert("Erro ao executar ação. Tente novamente.");
    }
  };

  const usuariosFiltrados = useMemo(() => {
    if (!searchQuery) return usuarios;
    const lower = searchQuery.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower)
    );
  }, [usuarios, searchQuery]);

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <Link
              href="/intranet/dashboard"
              className="text-gray-400 hover:text-gray-700 transition-colors"
              title="Voltar ao Dashboard"
            >
              <ArrowLeftCircle size={28} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Usuários
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {usuariosFiltrados.length} usuários encontrados
            </p>
          </div>
          <Link
            href="/intranet/usuarios/novo"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FilePenLine size={20} />
            Cadastrar Novo Usuário
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Carregando usuários...
          </p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usuario.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {usuario.perfil}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usuario.ativo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/intranet/usuarios/editar/${usuario.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar Usuário"
                        >
                          <FilePenLine size={20} />
                        </Link>
                        {usuario.ativo ? (
                          <button
                            onClick={() =>
                              setUsuarioParaAcao({ usuario, acao: "inativar" })
                            }
                            className="text-gray-500 hover:text-red-600"
                            title="Inativar Usuário"
                          >
                            <UserX size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setUsuarioParaAcao({ usuario, acao: "ativar" })
                            }
                            className="text-gray-500 hover:text-green-600"
                            title="Ativar Usuário"
                          >
                            <UserCheck size={20} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setUsuarioParaAcao({ usuario, acao: "excluir" })
                          }
                          className="text-gray-500 hover:text-red-800"
                          title="Excluir Usuário"
                        >
                          <AlertTriangle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {usuarioParaAcao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Deseja confirmar a ação?
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                O usuário "{usuarioParaAcao.usuario.nome}" será{" "}
                {usuarioParaAcao.acao === "excluir"
                  ? "excluído permanentemente"
                  : usuarioParaAcao.acao === "inativar"
                  ? "inativado"
                  : "ativado"}
                .
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setUsuarioParaAcao(null)}
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAcao}
                  type="button"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
