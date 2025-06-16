// src/app/contato/page.tsx

export default function ContatoPage() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Tem alguma dúvida ou quer conversar sobre um imóvel? Preencha o
            formulário abaixo ou nos chame no WhatsApp.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border-gray-300 rounded-md p-3 shadow-sm"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                className="w-full border-gray-300 rounded-md p-3 shadow-sm"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="mensagem"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mensagem
              </label>
              <textarea
                id="mensagem"
                rows={5}
                className="w-full border-gray-300 rounded-md p-3 shadow-sm"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Enviar Mensagem
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
