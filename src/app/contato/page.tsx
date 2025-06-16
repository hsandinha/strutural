// src/app/contato/page.tsx

export default function ContatoPage() {
  const inputClass =
    "w-full bg-white border border-gray-200 rounded-lg h-14 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition";

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Tem alguma dúvida ou quer conversar sobre um imóvel? Preencha o
            formulário ou fale conosco!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Lado esquerdo: Mapa + contatos */}
            <div className="flex flex-col gap-8">
              {/* Mapa */}
              <div className="w-full h-64 rounded-xl overflow-hidden shadow">
                <iframe
                  title="Localização"
                  src="https://www.google.com/maps?q=-19.951551,-43.931652&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              {/* Contatos */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
                <div>
                  <span className="block text-sm text-gray-500">Endereço</span>
                  <span className="block text-base text-gray-800 font-semibold">
                    Av. Uruguai, 620 - 602 - Sion, Belo Horizonte - MG,
                    30310-300
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">WhatsApp</span>
                  <a
                    href="https://wa.me/5531984005308"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-base text-green-600 font-semibold hover:underline"
                  >
                    (31) 98400-5308
                  </a>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">E-mail</span>
                  <a
                    href="mailto:hebertsandinhacorretor@gmail.com"
                    className="block text-base text-gray-800 font-semibold hover:underline"
                  >
                    hebertsandinhacorretor@gmail.com
                  </a>
                </div>
              </div>
            </div>
            {/* Lado direito: Formulário */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-md">
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
                        placeholder="Seu nome"
                        className={inputClass}
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
                        placeholder="Seu e-mail"
                        className={inputClass}
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
                      placeholder="(00) 00000-0000"
                      className={inputClass}
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
                      placeholder="Digite sua mensagem"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors text-lg tracking-wider"
                    >
                      Enviar Mensagem
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
