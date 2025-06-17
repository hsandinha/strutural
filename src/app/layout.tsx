import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/Header";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { FilterProvider } from "@/context/FilterContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Opcional: melhora o carregamento
});

export const metadata: Metadata = {
  title: "Strutural Imobiliária",
  description: "Encontre o imóvel dos seus sonhos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <h1>Olá</h1>
      </body>
    </html>
  );
}
