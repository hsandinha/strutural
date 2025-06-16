// src/app/cadastrar-imovel/page.tsx

export default function CadastrarImovelPage() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho da Seção */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Anuncie seu Imóvel Conosco
            </h1>
            <p className="text-lg text-gray-600">
              Preencha o formulário abaixo com os detalhes do seu imóvel e nossa
              equipe de especialistas entrará em contato em breve.
            </p>
          </div>

          {/* Formulário */}
          <form className="bg-white p-8 rounded-lg shadow-md space-y-8">
            {/* Seção de Contato do Proprietário */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">
                Suas Informações de Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    placeholder="João da Silva"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Seu Melhor Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="joao.silva@email.com"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Seu Telefone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    placeholder="(31) 99999-8888"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Seção de Informações do Imóvel */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">
                Informações do Imóvel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="finalidade"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Finalidade
                  </label>
                  <select
                    id="finalidade"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  >
                    <option>Vender</option>
                    <option>Alugar</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="tipo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Imóvel
                  </label>
                  <select
                    id="tipo"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  >
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Cobertura</option>
                    <option>Terreno</option>
                    <option>Loja</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="endereco"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Endereço Completo
                </label>
                <input
                  type="text"
                  id="endereco"
                  placeholder="Rua, Número, Bairro, Cidade, CEP"
                  className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                />
              </div>
            </div>

            {/* Seção de Detalhes do Imóvel */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">
                Detalhes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label
                    htmlFor="quartos"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quartos
                  </label>
                  <input
                    type="number"
                    id="quartos"
                    min="0"
                    placeholder="3"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="banheiros"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Banheiros
                  </label>
                  <input
                    type="number"
                    id="banheiros"
                    min="0"
                    placeholder="2"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="vagas"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Vagas
                  </label>
                  <input
                    type="number"
                    id="vagas"
                    min="0"
                    placeholder="2"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    id="area"
                    min="0"
                    placeholder="120"
                    className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-lg"
              >
                Enviar Informações do Imóvel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
