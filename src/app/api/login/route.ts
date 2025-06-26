import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    // Como email é único, pega o primeiro documento
    const usuarioDoc = querySnapshot.docs[0];
    const usuarioData = usuarioDoc.data();

    if (usuarioData.senha_plaintext !== senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Senha incorreta." },
        { status: 401 }
      );
    }

    // Remove a senha antes de retornar
    const { senha_plaintext, ...dadosDoUsuario } = usuarioData;

    return NextResponse.json({ sucesso: true, usuario: dadosDoUsuario });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
