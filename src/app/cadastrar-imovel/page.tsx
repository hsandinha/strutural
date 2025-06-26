"use client";

import { useState } from "react";
import { Award, TrendingUp, Megaphone } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export default function CadastrarImovelPage() {
  const inputClass =
    "w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition";

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [finalidade, setFinalidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoTexto, setTipoTexto] = useState("");
  const [destinacao, setDestinacao] = useState("");
  const [valor, setValor] = useState("");
  const [valorCondominio, setValorCondominio] = useState("");
  const [valorIptu, setValorIptu] = useState("");
  const [areaInterna, setAreaInterna] = useState("");
  const [areaExterna, setAreaExterna] = useState("");
  const [areaLote, setAreaLote] = useState("");
  const [andar, setAndar] = useState("");
  const [quartos, setQuartos] = useState("");
  const [suites, setSuites] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [aceitaPermuta, setAceitaPermuta] = useState(false);
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Buscar último documento para pegar o número sequencial
      const captacaoRef = collection(db, "captacao");
      const q = query(captacaoRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let lastNum = 0;
      querySnapshot.forEach((doc) => {
        const idStr = doc.data().id as string; // ex: "cap-12"
        const num = parseInt(idStr.split("-")[1]);
        if (!isNaN(num) && num > lastNum) lastNum = num;
      });

      const newNum = lastNum + 1;
      const newId = `cap-${newNum.toString().padStart(2, "0")}`;

      // Montar objeto para salvar
      const dataToSave = {
        id: newId,
        dadosPessoais: {
          nome,
          telefone,
          email,
        },
        finalidade,
        tipo,
        tipoTexto,
        destinacao,
        valor: valor ? parseFloat(valor) : null,
        valorCondominio: valorCondominio ? parseFloat(valorCondominio) : null,
        valorIptu: valorIptu ? parseFloat(valorIptu) : null,
        areaInterna: areaInterna ? parseFloat(areaInterna) : null,
        areaExterna: areaExterna ? parseFloat(areaExterna) : null,
        areaLote: areaLote ? parseFloat(areaLote) : null,
        andar,
        quartos: quartos ? parseInt(quartos) : null,
        suites: suites ? parseInt(suites) : null,
        banheiros: banheiros ? parseInt(banheiros) : null,
        vagas: vagas ? parseInt(vagas) : null,
        aceitaPermuta,
        aceitaFinanciamento,
        ocupado,
        endereco: {
          cep,
          endereco,
          numero,
          bairro,
          complemento,
          cidade,
        },
        criadoEm: Timestamp.now(),
      };

      // Salvar no Firestore com ID customizado
      await setDoc(doc(db, "captacao", newId), dataToSave);

      setSubmitSuccess(true);

      // Limpar formulário
      setNome("");
      setTelefone("");
      setEmail("");
      setFinalidade("");
      setTipo("");
      setTipoTexto("");
      setDestinacao("");
      setValor("");
      setValorCondominio("");
      setValorIptu("");
      setAreaInterna("");
      setAreaExterna("");
      setAreaLote("");
      setAndar("");
      setQuartos("");
      setSuites("");
      setBanheiros("");
      setVagas("");
      setAceitaPermuta(false);
      setAceitaFinanciamento(false);
      setOcupado(false);
      setCep("");
      setEndereco("");
      setNumero("");
      setBairro("");
      setComplemento("");
      setCidade("");
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      setSubmitError("Erro ao salvar imóvel. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 w-full">
          {/* Coluna Esquerda */}
          <div className="flex flex-col justify-start h-full">
            <h2 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
              Ajudamos você a vender seu imóvel de forma rápida e fácil
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
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Dados Pessoais */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 mb-3">
                  Dados Pessoais
                </legend>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    className={inputClass}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="*TELEFONE"
                    className={inputClass}
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="E-MAIL"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  <select
                    className={inputClass}
                    value={finalidade}
                    onChange={(e) => setFinalidade(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      *Selecione a finalidade
                    </option>
                    <option value="vender">Vender</option>
                  </select>
                </div>

                {/* Segunda linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    className={inputClass}
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecione o tipo
                    </option>
                    <option value="andar-corrido">Andar corrido</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="apto-area-privativa">
                      Apto Área Privativa
                    </option>
                    <option value="casa-comercial">Casa comercial</option>
                    <option value="casa-condominio">Casa Condomínio</option>
                    <option value="casa-residencial">Casa Residencial</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="estacionamento">Estacionamento</option>
                    <option value="fazenda">Fazendas / Sítios</option>
                    <option value="hotel">Flat/Hotel/Apart</option>
                    <option value="galpao">Galpão</option>
                    <option value="loja">Loja</option>
                    <option value="lote-terreno">Lote / Terreno</option>
                    <option value="predio-comercial">Prédio comercial</option>
                    <option value="sala">Sala(s)</option>
                    <option value="vaga-garagem">Vaga de garagem</option>
                    <option value="outros">Outros</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Escreva o tipo do seu imóvel"
                    className={inputClass}
                    value={tipoTexto}
                    onChange={(e) => setTipoTexto(e.target.value)}
                  />
                </div>

                {/* Terceira linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    className={inputClass}
                    value={destinacao}
                    onChange={(e) => setDestinacao(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Destinação
                    </option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="residencial-comercial">
                      Residencial e Comercial
                    </option>
                    <option value="industrial">Industrial</option>
                    <option value="rural">Rural</option>
                    <option value="temporada">Temporada</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Valor"
                    className={inputClass}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>

                {/* Quarta linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Valor do Condomínio"
                    className={inputClass}
                    value={valorCondominio}
                    onChange={(e) => setValorCondominio(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Valor do IPTU"
                    className={inputClass}
                    value={valorIptu}
                    onChange={(e) => setValorIptu(e.target.value)}
                  />
                </div>

                {/* Quinta linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Área interna"
                    className={inputClass}
                    value={areaInterna}
                    onChange={(e) => setAreaInterna(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Área externa"
                    className={inputClass}
                    value={areaExterna}
                    onChange={(e) => setAreaExterna(e.target.value)}
                  />
                </div>

                {/* Sexta linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Área Lote"
                    className={inputClass}
                    value={areaLote}
                    onChange={(e) => setAreaLote(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Andar"
                    className={inputClass}
                    value={andar}
                    onChange={(e) => setAndar(e.target.value)}
                  />
                </div>

                {/* Sétima linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Quartos"
                    className={inputClass}
                    value={quartos}
                    onChange={(e) => setQuartos(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Suítes"
                    className={inputClass}
                    value={suites}
                    onChange={(e) => setSuites(e.target.value)}
                  />
                </div>

                {/* Oitava linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Quantidade de Banheiros"
                    className={inputClass}
                    value={banheiros}
                    onChange={(e) => setBanheiros(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Quantidade de vagas"
                    className={inputClass}
                    value={vagas}
                    onChange={(e) => setVagas(e.target.value)}
                  />
                </div>

                {/* Nona linha */}
                <div className="flex flex-wrap gap-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={aceitaPermuta}
                      onChange={(e) => setAceitaPermuta(e.target.checked)}
                    />
                    <span className="text-gray-700">Aceita Permuta</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={aceitaFinanciamento}
                      onChange={(e) => setAceitaFinanciamento(e.target.checked)}
                    />
                    <span className="text-gray-700">Aceita Financiamento</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={ocupado}
                      onChange={(e) => setOcupado(e.target.checked)}
                    />
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
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    className="col-span-3 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </div>

                {/* Segunda linha */}
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Bairro"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Complemento"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    className="col-span-1 bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </div>
              </fieldset>

              {/* Submissão */}
              <div className="border-t pt-6">
                {submitError && (
                  <p className="text-red-600 mb-4 text-center">{submitError}</p>
                )}
                {submitSuccess && (
                  <p className="text-green-600 mb-4 text-center">
                    Imóvel cadastrado com sucesso!
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-4 text-center">
                  Ao informar meus dados, eu concordo com a{" "}
                  <Link href="/politica-de-privacidade" className="underline">
                    Política de Privacidade
                  </Link>
                  .
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors text-lg tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "ANUNCIAR IMÓVEL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
