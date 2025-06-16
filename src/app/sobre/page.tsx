// src/app/sobre/page.tsx

import Image from "next/image";
import { Target, Eye, Heart } from "lucide-react";

export default function SobrePage() {
  return (
    <main className="bg-white">
      {/* Seção Principal (Hero) */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
            alt="Escritório moderno da imobiliária"
            fill
            style={{ objectFit: "cover" }}
            className="filter brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Sobre a Strutural Imóveis
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            Conectando pessoas aos seus lares dos sonhos com confiança e
            expertise.
          </p>
        </div>
      </section>

      {/* Seção Nossa História */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose lg:prose-lg max-w-none text-gray-600">
              <h2 className="text-3xl font-bold text-gray-800">
                Nossa História
              </h2>
              <p>
                Fundada em [Ano de Fundação] com a paixão por transformar o
                mercado imobiliário de Belo Horizonte, a Strutural Imóveis
                nasceu do desejo de oferecer uma consultoria que vai além da
                simples transação. Entendemos que a busca por um imóvel é um dos
                momentos mais importantes na vida de uma pessoa.
              </p>
              <p>
                Ao longo dos anos, construímos uma reputação sólida baseada na
                transparência, no conhecimento profundo do mercado local e em um
                atendimento que prioriza as necessidades e os sonhos de cada
                cliente. Nossa trajetória é marcada por milhares de sorrisos e
                chaves entregues.
              </p>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932"
                alt="Equipe da imobiliária em reunião"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Missão, Visão e Valores */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Nossos Pilares
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Target size={48} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Missão</h3>
              <p className="text-gray-600">
                Oferecer uma assessoria imobiliária de excelência, com ética e
                transparência, para realizar os projetos de vida dos nossos
                clientes.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Eye size={48} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Visão</h3>
              <p className="text-gray-600">
                Ser a imobiliária referência em Belo Horizonte, reconhecida pela
                inovação, confiança e pela satisfação de nossos clientes e
                parceiros.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Heart size={48} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Valores</h3>
              <p className="text-gray-600">
                Ética, Comprometimento, Inovação, Confiança e Foco no Cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Nossa Equipe */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Conheça Nossa Equipe
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Exemplo de Membro da Equipe - Copie e cole este bloco para cada membro */}
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071" // Substitua pela foto do corretor
                alt="Foto do Corretor 1"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 shadow-md"
                style={{ objectFit: "cover" }}
              />
              <h4 className="text-xl font-semibold text-gray-800">
                Hebert Corretor
              </h4>
              <p className="text-gray-500">Corretor Especialista</p>
            </div>
            {/* Fim do Exemplo */}

            {/* Adicione mais membros aqui */}
          </div>
        </div>
      </section>
    </main>
  );
}
