// src/components/FloatingWhatsAppButton.tsx

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa"; // Importando o ícone do WhatsApp

export function FloatingWhatsAppButton() {
  const phoneNumber = "5531984005308"; // 👈 SUBSTITUA PELO SEU NÚMERO
  const message = "Olá! Tenho interesse em um dos seus imóveis.";

  // Formata a mensagem para ser usada em uma URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank" // Abre o link em uma nova aba
      rel="noopener noreferrer" // Boas práticas de segurança para links externos
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Entrar em contato via WhatsApp"
    >
      <FaWhatsapp size={28} />
    </Link>
  );
}
