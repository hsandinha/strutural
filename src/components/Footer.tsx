// src/components/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1: Logo e Sobre */}
          <div className="md:col-span-2">
            <Link href="/">
              <Image
                src="/strutural2.png" // Crie uma versão branca do seu logo
                alt="Logo Strutural Imóveis"
                width={300}
                height={80}
              />
            </Link>
            <p className="mt-4 max-w-md">
              Sua parceira de confiança para encontrar o imóvel ideal.
              Oferecemos consultoria especializada e as melhores oportunidades
              do mercado.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="font-bold text-white mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/comprar" className="hover:text-white">
                  Comprar
                </Link>
              </li>
              <li>
                <Link href="/cadastrar-imovel" className="hover:text-white">
                  Anuncie seu Imóvel
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato e Redes Sociais */}
          <div>
            <h3 className="font-bold text-white mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/struturalimoveis/"
                aria-label="Instagram"
                className="hover:text-white"
              >
                <Instagram />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white">
                <Facebook />
              </a>

              <a
                href="https://www.instagram.com/struturalimoveis/"
                aria-label="Instagram"
                className="hover:text-white"
              >
                <Linkedin />
              </a>
            </div>
            <h3 className="font-bold text-white mt-6 mb-2">Contatos</h3>
            <p className="text-sm">contato@struturalimoveis.com.br</p>
            <p className="text-sm">Adhimar Salgado Chagas (31) 9 9417-8066</p>
            <p className="text-sm">Simone Ferreira Campos (31) 9 9572-1272</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Strutural Imóveis. Todos os
            direitos reservados.
          </p>
          <p>Desenvolvido com por Hebert Sandinha</p>
        </div>
      </div>
    </footer>
  );
}
