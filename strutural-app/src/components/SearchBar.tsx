// src/components/SearchBar.tsx

export function SearchBar() {
  return (
    // Caixa de busca com fundo branco semi-transparente
    <div className="bg-white/90 p-8 rounded-lg shadow-2xl w-full max-w-5xl mx-auto backdrop-blur-sm opacity-65">
      {/* Linha 1 de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Campo Finalidade */}
        <div>
          <label
            htmlFor="finalidade"
            className="block text-xs font-semibold text-gray-500 uppercase mb-1"
          >
            Finalidade
          </label>
          <select
            id="finalidade"
            className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
          >
            <option>Comprar</option>
            <option>Alugar</option>
          </select>
        </div>

        {/* Campo Tipo */}
        <div>
          <label
            htmlFor="tipo"
            className="block text-xs font-semibold text-gray-500 uppercase mb-1"
          >
            Tipo
          </label>
          <select
            id="tipo"
            className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
          >
            <option>Todos</option>
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Terreno</option>
            <option>Lojas</option>
          </select>
        </div>

        {/* Campo Localização */}
        <div>
          <label
            htmlFor="localizacao"
            className="block text-xs font-semibold text-gray-500 uppercase mb-1"
          >
            Localização
          </label>
          <input
            type="text"
            id="localizacao"
            placeholder="Bairro ou Cidade"
            className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
          />
        </div>
      </div>

      {/* Linha 2 de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campo Quartos */}
        <div>
          <label
            htmlFor="quartos"
            className="block text-xs font-semibold text-gray-500 uppercase mb-1"
          >
            Quartos
          </label>
          <select
            id="quartos"
            className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
          >
            <option>Quartos</option>
            <option>1+</option>
            <option>2+</option>
            <option>3+</option>
          </select>
        </div>

        {/* Campo Valor (Min e Max) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Valor
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Min"
              className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
            />
            <input
              type="text"
              placeholder="Max"
              className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Botão de Busca */}
      <div className="mt-8 flex justify-center">
        <button className="w-full md:w-1/3 bg-gray-900/80 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-900 transition-colors border-2 border-blue-500 text-sm tracking-wider">
          BUSCAR IMÓVEIS
        </button>
      </div>
    </div>
  );
}
