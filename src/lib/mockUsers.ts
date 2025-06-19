// src/lib/mockUsers.ts
import { User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-01",
    nome: "Ana Cliente",
    email: "cliente@email.com",
    senha_plaintext: "123456",
    perfil: "cliente",
  },
  {
    id: "user-02",
    nome: "Hebert Corretor",
    email: "admin@email.com",
    senha_plaintext: "admin123",
    perfil: "admin",
  },
];
