"use client";

import { Lembrete } from "@/types";

// Definimos as propriedades que o formulário vai receber
interface LembreteFormProps {
  lembrete: Partial<Lembrete>;
  setLembrete: React.Dispatch<React.SetStateAction<Partial<Lembrete>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  buttonText: string;
  errorMessage?: string; // adiciona prop opcional para erro
  successMessage?: string; // adiciona prop opcional para sucesso
}

export function LembreteForm({
  lembrete,
  setLembrete,
  onSubmit,
  isLoading,
  buttonText,
  errorMessage,
  successMessage,
}: LembreteFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLembrete({
      ...lembrete,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md h-12 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border space-y-6"
    >
      <fieldset>
        <legend className="text-lg font-semibold text-gray-700 mb-4">
          Detalhes do Lembrete
        </legend>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Título do Lembrete*
            </label>
            <textarea
              id="titulo"
              name="titulo"
              rows={3}
              value={lembrete.titulo || ""}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Ex: Ligar para o cliente do imóvel Cód. 123"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="data"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Data e Hora do Lembrete*
            </label>
            <input
              type="datetime-local"
              id="data"
              name="data"
              value={lembrete.data || ""}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>
      </fieldset>

      {/* Mensagens de erro e sucesso */}
      {errorMessage && (
        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm mt-2">{successMessage}</p>
      )}

      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
}
