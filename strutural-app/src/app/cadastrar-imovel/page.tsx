"use client";
import { Award, TrendingUp, Megaphone } from "lucide-react";
import Link from "next/link";

export default function CadastrarImovelPage() {
  const inputClass =
    "w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition";

  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 w-full">
          {/* Coluna Esquerda - alinhada ao topo */}
          <div className="flex flex-col justify-start h-full">
            <h2 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
              Ajudamos você a alugar ou vender seu imóvel de forma rápida e
              fácil
            </h2>
            <p className="text-xl text-gray-500 mb-10">
              Publique nos portais do mercado imobiliário.
            </p>
            <div className="space-y-8 mb-16">
              {[
                "Preencha o formulário com as informações do seu imóvel.",
                "Seu contato e as informações serão direcionados para um captador especialista da nossa imobiliária.",
                "Nosso captador fará contato para agendar a visita de avaliação do seu imóvel e da documentação imobiliária.",
              ].map((txt, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="text-4xl font-extrabold text-blue-600 mr-6">{`0${
                    idx + 1
                  }`}</span>
                  <p className="text-lg text-gray-700">{txt}</p>
                </div>
              ))}
            </div>
            <hr className="my-8" />
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Benefícios que oferecemos para você
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Award size={44} className="text-blue-600" />
                </div>
                <p className="text-base text-gray-600 text-center">
                  Qualidade no atendimento com cliente em potencial
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <TrendingUp size={44} className="text-blue-600" />
                </div>
                <p className="text-base text-gray-600 text-center">
                  Aumento em suas vendas com a melhor segmentação
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Megaphone size={44} className="text-blue-600" />
                </div>
                <p className="text-base text-gray-600 text-center">
                  Maior visibilidade em seus anúncios
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Formulário */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full mx-auto flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Preencha o formulário e anuncie seu imóvel conosco!
            </h2>
            <form className="space-y-6">
              {/* Dados Pessoais */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 mb-3">
                  Dados Pessoais
                </legend>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="*NOME"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="*TELEFONE"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="email"
                    placeholder="E-MAIL"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>
              </fieldset>
              <hr className="my-8 border-t border-gray-200" />
              {/* Dados do Imóvel */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 mb-3">
                  Dados do Imóvel
                </legend>

                {/* Primeira linha */}
                <div className="mb-4">
                  <select className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition">
                    <option value="" disabled>
                      *Selecione a finalidade
                    </option>
                    <option value="vender">Vender</option>
                    <option value="alugar">Alugar</option>
                  </select>
                </div>

                {/* Segunda linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition">
                    <option value="" disabled>
                      Selecione o tipo
                    </option>
                    <option value="9">Andar corrido</option>
                    <option value="2">Apartamento</option>
                    <option value="63">Apto Área Privativa</option>
                    <option value="17">Casa comercial</option>
                    <option value="68">Casa Condomínio</option>
                    <option value="26">Casa Residencial</option>
                    <option value="18">Cobertura</option>
                    <option value="27">Estacionamento</option>
                    <option value="34">Fazendas / Sítios</option>
                    <option value="29">Flat/Hotel/Apart</option>
                    <option value="11">Galpão</option>
                    <option value="5">Loja</option>
                    <option value="32">Lote / Terreno</option>
                    <option value="24">Prédio comercial</option>
                    <option value="6">Sala(s)</option>
                    <option value="22">Vaga de garagem</option>
                    <option value="0">Outros</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Escreva o tipo do seu imóvel"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Terceira linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition">
                    <option value="" disabled>
                      Destinação
                    </option>
                    <option value="1">Residencial</option>
                    <option value="2">Comercial</option>
                    <option value="3">Residencial e Comercial</option>
                    <option value="4">Industrial</option>
                    <option value="5">Rural</option>
                    <option value="6">Temporada</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Valor"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Quarta linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Valor do Condomínio"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Valor do IPTU"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Quinta linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Área interna"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Área externa"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Sexta linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Área Lote"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Andar"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Sétima linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Quartos"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Suítes"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Oitava linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Quantidade de Banheiros"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Quantidade de vagas"
                    className="w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Nona linha */}
                <div className="flex flex-wrap gap-6 mt-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-700">Aceita Permuta</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-700">Aceita Financiamento</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-700">Ocupado</span>
                  </label>
                </div>
              </fieldset>
              <hr className="my-8 border-t border-gray-200" />

              {/* Endereço */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 mb-3">
                  Endereço
                </legend>

                {/* Primeira linha */}
                <div className="grid grid-cols-6 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="CEP"
                    className="col-span-2 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    className="col-span-3 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                {/* Segunda linha */}
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Bairro"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Complemento"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>
              </fieldset>

              {/* Submissão */}
              <div className="border-t pt-6">
                <p className="text-xs text-gray-500 mb-4 text-center">
                  Ao informar meus dados, eu concordo com a{" "}
                  <Link href="/politica-de-privacidade" className="underline">
                    Política de Privacidade
                  </Link>
                  .
                </p>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors text-lg tracking-wider"
                >
                  ANUNCIAR IMÓVEL
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
