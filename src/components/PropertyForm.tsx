"use client";

import { Imovel, SearchFilters } from "@/types";
import { Award, TrendingUp, Megaphone } from "lucide-react";

// As props que o formulário recebe
interface PropertyFormProps {
  property: Partial<Imovel>;
  setProperty: React.Dispatch<React.SetStateAction<Partial<Imovel>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}
// Props para o componente auxiliar de grupo de botões
interface ButtonGroupFieldProps {
  label: string;
  name: keyof SearchFilters; // Garante que 'name' seja uma chave válida de SearchFilters
  value: string;
  options: string[];
  onChange: (name: keyof SearchFilters, value: string) => void;
}

// Props para o componente auxiliar de checkboxes
interface CheckboxGroupProps {
  title: string;
  items: string[];
  checkedItems: { [key: string]: boolean };
  onCheckboxChange: (name: string, isChecked: boolean) => void;
}
interface TipoPortariaProps {
  tipoPortaria: "Nenhuma" | "24h" | "Virtual" | "Diurna" | "Noturna";
  onTipoPortariaChange: (
    valor: "Nenhuma" | "24h" | "Virtual" | "Diurna" | "Noturna"
  ) => void;
}

// Função para extrair só as propriedades booleanas do objeto
function getBooleanCheckedItems(
  obj: Partial<{ [key: string]: boolean | string }> | undefined
): { [key: string]: boolean } {
  if (!obj) return {};
  return Object.entries(obj)
    .filter(([_, value]) => typeof value === "boolean")
    .reduce((acc, [key, value]) => {
      acc[key] = value as boolean;
      return acc;
    }, {} as { [key: string]: boolean });
}

// --- COMPONENTES AUXILIARES COM TIPAGEM CORRETA ---

const ButtonGroupField = ({
  label,
  name,
  value,
  options,
  onChange,
}: ButtonGroupFieldProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(name, option)}
          className={`px-3 py-1.5 text-xs rounded-md border ${
            value === option
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {option}
          {option.length === 1 && "+"}
        </button>
      ))}
    </div>
  </div>
);
// Componente auxiliar para os grupos de checkboxes para evitar repetição
const CheckboxGroup = ({
  title,
  items,
  checkedItems,
  onCheckboxChange,
}: CheckboxGroupProps) => (
  <fieldset>
    <legend className="text-lg font-semibold text-gray-700 mb-3">
      {title}
    </legend>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <label key={item} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={
              checkedItems[
                item.toLowerCase().replace(/ /g, "").replace(/ê/g, "e")
              ] || false
            }
            onChange={(e) =>
              onCheckboxChange(
                item.toLowerCase().replace(/ /g, "").replace(/ê/g, "e"),
                e.target.checked
              )
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">{item}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

// Componente Principal do Formulário
export function PropertyForm({
  property,
  setProperty,
  onSubmit,
  isLoading,
}: PropertyFormProps) {
  // Handler genérico para a maioria dos campos
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  // Handler para campos dentro de objetos aninhados (ex: endereço, proprietario)
  const handleNestedChange = (
    group: "endereco" | "proprietario",
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProperty({
      ...property,
      [group]: {
        ...property[group],
        [e.target.name]: e.target.value,
      },
    });
  };

  // Handler específico para checkboxes de características
  const handleCheckboxChange = (
    group: "caracteristicasImovel" | "caracteristicasEdificio",
    name: string,
    isChecked: boolean
  ) => {
    setProperty({
      ...property,
      [group]: {
        ...property[group],
        [name]: isChecked,
      },
    });
  };

  // Handler para upload múltiplo de fotos
  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newFotos = filesArray.map((file) => URL.createObjectURL(file));
    setProperty({
      ...property,
      fotos: [...(property.fotos || []), ...newFotos],
    });
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md h-12 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-md border p-8 space-y-8"
    >
      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Título
        </label>
        <input
          type="text"
          name="titulo"
          value={property.titulo || ""}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          name="descricao"
          value={property.descricao || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
          rows={4}
        />
      </div>

      {/* Endereço */}
      <fieldset>
        <legend className="text-xl font-bold text-gray-800 mb-4">
          Endereço do Imóvel
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <input
              name="cep"
              placeholder="CEP"
              value={property.endereco?.cep || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-3">
            <input
              name="rua"
              placeholder="Rua / Av."
              value={property.endereco?.rua || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-1">
            <input
              name="numero"
              placeholder="Número"
              value={property.endereco?.numero || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-1">
            <input
              name="complemento"
              placeholder="Complemento"
              value={property.endereco?.complemento || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="bairro"
              placeholder="Bairro"
              value={property.endereco?.bairro || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="cidade"
              placeholder="Cidade"
              value={property.endereco?.cidade || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="estado"
              placeholder="Estado"
              value={property.endereco?.estado || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Características do Imóvel */}
      <fieldset>
        <legend className="text-xl font-bold text-gray-800 mb-4">
          Características do Imóvel
        </legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <select
              name="tipo"
              value={property.tipo || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Apartamento</option>
              <option>Casa</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Quartos</label>
            <input
              type="number"
              name="quartos"
              value={property.quartos || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Suítes</label>
            <input
              type="number"
              name="suites"
              value={property.suites || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Banheiros</label>
            <input
              type="number"
              name="banheiros"
              value={property.banheiros || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Vagas</label>
            <input
              type="number"
              name="vagas"
              value={property.vagas || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Área (m²)</label>
            <input
              type="number"
              name="area"
              value={property.area || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Valor (R$)</label>
            <input
              type="number"
              name="preco"
              value={property.preco || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Condomínio (R$)</label>
            <input
              type="number"
              name="valorCondominio"
              value={property.valorCondominio || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium">IPTU (R$)</label>
            <input
              type="number"
              name="valorIptu"
              value={property.valorIptu || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-6">
          <CheckboxGroup
            title=""
            items={[
              "Aceita Permuta",
              "Churrasqueira",
              "Closet",
              "DCE",
              "Lavabo",
              "Mobiliado",
              "Na planta",
              "Alugado",
            ]}
            checkedItems={property.caracteristicasImovel || {}}
            onCheckboxChange={(name, checked) =>
              handleCheckboxChange("caracteristicasImovel", name, checked)
            }
          />
        </div>
      </fieldset>

      {/* Características do Edifício */}
      <CheckboxGroup
        title="Características do Edifício"
        items={[
          "Área de Lazer",
          "Piscina",
          "Piscina de raia",
          "Mercadinho",
          "Lavanderia",
          "Quadra de Tênis",
          "Quadra de areia",
          "Quadra Esportiva",
          "Academia",
          "Code Code Playground",
          "Salão de Jogos",
          "Sauna",
          "Portão Eletrônico",
          "Precisa de autorização",
        ]}
        checkedItems={getBooleanCheckedItems(property.caracteristicasEdificio)}
        onCheckboxChange={(name, checked) =>
          handleCheckboxChange("caracteristicasEdificio", name, checked)
        }
      />
      <div>
        <label className="text-sm font-medium">Portaria</label>
        <select
          name="tipoPortaria"
          value={property.caracteristicasEdificio?.tipoPortaria || "Nenhuma"}
          onChange={(e) =>
            setProperty({
              ...property,
              caracteristicasEdificio: {
                ...property.caracteristicasEdificio,
                tipoPortaria: e.target.value as
                  | "Nenhuma"
                  | "24h"
                  | "Virtual"
                  | "Diurna"
                  | "Noturna",
              },
            })
          }
          className={inputClass}
        >
          <option>Nenhuma</option>
          <option>24h</option>
          <option>Virtual</option>
          <option>Diurna</option>
          <option>Noturna</option>
        </select>
      </div>

      {/* Proprietário */}
      <fieldset>
        <legend className="text-xl font-bold text-gray-800 mb-4">
          Dados do Proprietário
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nome"
            placeholder="Nome Completo"
            value={property.proprietario?.nome || ""}
            onChange={(e) => handleNestedChange("proprietario", e)}
            className={inputClass}
          />
          <input
            name="contato"
            placeholder="Contato (Telefone/WhatsApp)"
            value={property.proprietario?.contato || ""}
            onChange={(e) => handleNestedChange("proprietario", e)}
            className={inputClass}
          />
          <div className="md:col-span-2">
            <input
              name="horarioContato"
              placeholder="Melhor horário para contato e visitas"
              value={property.proprietario?.horarioContato || ""}
              onChange={(e) => handleNestedChange("proprietario", e)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Upload múltiplo de fotos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos do Imóvel
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files) return;
            const filesArray = Array.from(e.target.files);
            const newFotos = filesArray.map((file) =>
              URL.createObjectURL(file)
            );
            setProperty({
              ...property,
              fotos: [...(property.fotos || []), ...newFotos],
            });
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {(property.fotos || []).map((foto, idx) => (
            <div
              key={idx}
              className="relative w-20 h-16 rounded-md overflow-hidden"
            >
              <img
                src={foto}
                alt={`Foto ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  const fotosAtualizadas = (property.fotos || []).filter(
                    (_, i) => i !== idx
                  );
                  setProperty({ ...property, fotos: fotosAtualizadas });
                }}
                className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl-md px-1.5 py-0.5 text-xs font-bold hover:bg-opacity-75 transition"
                aria-label={`Remover foto ${idx + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isLoading ? "Salvando..." : "Salvar Imóvel"}
        </button>
      </div>
    </form>
  );
}
