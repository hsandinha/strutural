// src/lib/mockLembretes.ts
import { Lembrete } from "@/types";

export const mockLembretes: Lembrete[] = [
  {
    id: "lem-1",
    titulo: "Ligar para o cliente Carlos Pereira sobre a visita ao imóvel #1",
    data: "2025-06-19T17:00:00", // Hoje
    concluido: true,
    corretorId: "cor-01",
    imovelId: "1",
    leadId: "lead-1",
  },
  {
    id: "lem-2",
    titulo: "Preparar documentação para a proposta da casa no Buritis",
    data: "2025-06-20T11:00:00", // Amanhã
    concluido: false,
    corretorId: "cor-01",
    imovelId: "2",
  },
  {
    id: "lem-3",
    titulo: "Follow-up com o lead Ricardo Neves",
    data: "2025-06-20T15:00:00", // Amanhã
    concluido: false,
    corretorId: "cor-01",
    leadId: "lead-2",
  },
  {
    id: "lem-4",
    titulo: "Verificar status do IPTU da loja no Centro",
    data: "2025-06-23T09:30:00", // Próxima semana
    concluido: false,
    corretorId: "cor-01",
    imovelId: "49578",
  },
  {
    id: "lem-5",
    titulo: "Confirmar visita com a cliente Juliana Costa",
    data: "2025-06-19T14:00:00", // Hoje, mas já passou
    concluido: true,
    corretorId: "cor-01",
    imovelId: "2",
  },
];
