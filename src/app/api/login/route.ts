// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mockUsers";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Procura o usuário no nosso "banco de dados" mock
    const usuarioEncontrado = mockUsers.find((user) => user.email === email);

    if (!usuarioEncontrado) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    // Verifica a senha (em um app real, isso seria uma comparação de hash)
    if (usuarioEncontrado.senha_plaintext !== senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Senha incorreta." },
        { status: 401 }
      );
    }

    // Login bem-sucedido! Retorna os dados do usuário (sem a senha)
    const { senha_plaintext, ...dadosDoUsuario } = usuarioEncontrado;
    return NextResponse.json({ sucesso: true, usuario: dadosDoUsuario });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
