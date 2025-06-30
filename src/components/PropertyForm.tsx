"use client";

import { Imovel } from "@/types";
import { useState, useEffect } from "react";

interface PropertyFormProps {
  property: Partial<Imovel>;
  setProperty: React.Dispatch<React.SetStateAction<Partial<Imovel>>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function PropertyForm({
  property,
  setProperty,
  onSubmit,
  isLoading,
  selectedFiles,
  setSelectedFiles,
}: PropertyFormProps) {
  const [isEnderecoAutoPreenchido, setIsEnderecoAutoPreenchido] =
    useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md h-12 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  // Limpar URLs criadas para previews para evitar vazamento de memória
  useEffect(() => {
    // Cria URLs para os arquivos selecionados
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup: revoga URLs antigas quando selectedFiles mudar ou componente desmontar
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  // Busca endereço pelo CEP via ViaCEP
  const buscarEnderecoPorCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepError("CEP inválido");
      return;
    }
    try {
      setCepError(null);
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }

      setProperty((prev: Partial<Imovel>) => ({
        ...prev,
        endereco: {
          rua: data.logradouro ?? "",
          numero: prev.endereco?.numero ?? "",
          complemento: prev.endereco?.complemento ?? "",
          bairro: data.bairro ?? "",
          cidade: data.localidade ?? "",
          estado: data.uf ?? "",
          cep: cepLimpo,
        } as Imovel["endereco"],
      }));

      setIsEnderecoAutoPreenchido(true);
    } catch {
      setCepError("Erro ao buscar CEP");
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setProperty({
      ...property,
      endereco: {
        rua: property.endereco?.rua || "",
        numero: property.endereco?.numero || "",
        complemento: property.endereco?.complemento || "",
        bairro: property.endereco?.bairro || "",
        cidade: property.endereco?.cidade || "",
        estado: property.endereco?.estado || "",
        cep: valor,
      },
    });
    setIsEnderecoAutoPreenchido(false);
    setCepError(null);
  };

  const handleCepBlur = () => {
    if (property.endereco?.cep) {
      buscarEnderecoPorCep(property.endereco.cep);
    }
  };

  // Quando o usuário seleciona arquivos, só atualiza o estado local (no pai)
  function handleFotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const arquivos = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...arquivos]);
  }

  // Remove arquivo selecionado localmente
  function removerArquivoSelecionado(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // Remove foto já salva (URL)
  function removerFotoSalva(index: number) {
    setProperty({
      ...property,
      fotos: (property.fotos || []).filter((_, i) => i !== index),
    });
  }

  // Submit do formulário só chama onSubmit do pai
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(e);
  }

  // Handler genérico para campos simples
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setProperty({ ...property, [name]: e.target.checked });
    } else {
      setProperty({ ...property, [name]: value });
    }
  };

  // Handler para campos aninhados (endereco, proprietario)
  const handleNestedChange = (
    group: "endereco" | "proprietario",
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (
      isEnderecoAutoPreenchido &&
      group === "endereco" &&
      ["rua", "bairro", "cidade", "estado"].includes(e.target.name)
    ) {
      return; // bloqueia edição dos campos auto preenchidos
    }
    setProperty({
      ...property,
      [group]: {
        ...property[group],
        [e.target.name]: e.target.value,
      },
    });
  };

  // Extrai propriedades booleanas para checkboxes
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

  // Handler para checkboxes
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

  // CheckboxGroup (igual seu código original)
  const CheckboxGroup = ({
    title,
    items,
    checkedItems,
    onCheckboxChange,
  }: {
    title: string;
    items: string[];
    checkedItems: { [key: string]: boolean };
    onCheckboxChange: (name: string, isChecked: boolean) => void;
  }) => (
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
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md border p-8 space-y-8"
    >
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
              onChange={handleCepChange}
              onBlur={handleCepBlur}
              className={inputClass}
              maxLength={9}
              required
            />
            {cepError && (
              <p className="text-red-600 text-sm mt-1">{cepError}</p>
            )}
          </div>
          <div className="md:col-span-3">
            <input
              name="rua"
              placeholder="Rua / Av."
              value={property.endereco?.rua || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
              readOnly={isEnderecoAutoPreenchido}
              required
            />
          </div>
          <div className="md:col-span-1">
            <input
              name="numero"
              placeholder="Número"
              value={property.endereco?.numero || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
              required
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
              readOnly={isEnderecoAutoPreenchido}
              required
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="cidade"
              placeholder="Cidade"
              value={property.endereco?.cidade || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
              readOnly={isEnderecoAutoPreenchido}
              required
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="estado"
              placeholder="Estado"
              value={property.endereco?.estado || ""}
              onChange={(e) => handleNestedChange("endereco", e)}
              className={inputClass}
              readOnly={isEnderecoAutoPreenchido}
              required
            />
          </div>
        </div>
      </fieldset>
      {/* Título */}
      {/* Descrição */}
      {/* Preço */}
      {/* Valor Condomínio */}
      {/* Valor IPTU */}
      {/* Suítes */}
      {/* Quartos */}
      {/* Banheiros */} {/* Vagas */} {/* Tipo */}
      {/* Área */}
      {/* Finalidade */}
      {/* Em Destaque */}
      <fieldset className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Título ocupa toda a largura */}
        <div className="sm:col-span-2 lg:col-span-3">
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

        {/* Descrição ocupa toda a largura */}
        <div className="sm:col-span-2 lg:col-span-3">
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

        {/* Agora os campos numéricos e selects em colunas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preço
          </label>
          <input
            type="number"
            name="preco"
            value={property.preco ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Valor Condomínio
          </label>
          <input
            type="number"
            name="valorCondominio"
            value={property.valorCondominio ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Valor IPTU
          </label>
          <input
            type="number"
            name="valorIptu"
            value={property.valorIptu ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quartos
          </label>
          <input
            type="number"
            name="quartos"
            value={property.quartos ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Suítes
          </label>
          <input
            type="number"
            name="suites"
            value={property.suites ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Banheiros
          </label>
          <input
            type="number"
            name="banheiros"
            value={property.banheiros ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vagas
          </label>
          <input
            type="number"
            name="vagas"
            value={property.vagas ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Área (m²)
          </label>
          <input
            type="number"
            name="area"
            value={property.area ?? ""}
            onChange={handleChange}
            className={inputClass}
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Finalidade
          </label>
          <select
            name="finalidade"
            value={property.finalidade || "Comprar"}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="Comprar">Comprar</option>
            <option value="Alugar">Alugar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo
          </label>
          <select
            name="tipo"
            value={property.tipo || ""}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="" disabled>
              Selecione o tipo
            </option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="cobertura">Cobertura</option>
            <option value="loja">Loja</option>
            <option value="terreno">Terreno</option>
            <option value="galpao">Galpão</option>
            {/* Adicione outros tipos que desejar */}
          </select>
        </div>

        {/* Checkbox em destaque ocupa 1 coluna */}
        <div className="flex items-center space-x-2 mt-6">
          <input
            type="checkbox"
            name="emDestaque"
            checked={property.emDestaque || false}
            onChange={(e) =>
              setProperty({ ...property, emDestaque: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">Em Destaque</label>
        </div>
      </fieldset>
      {/* Características do Imóvel */}
      <fieldset>
        <legend className="text-xl font-bold text-gray-800 mb-4">
          Características do Imóvel
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: "Aceita Permuta", name: "aceitaPermuta" },
            { label: "Churrasqueira", name: "churrasqueira" },
            { label: "Closet", name: "closet" },
            { label: "DCE", name: "dce" },
            { label: "Lavabo", name: "lavabo" },
            { label: "Mobiliado", name: "mobiliado" },
            { label: "Na planta", name: "naPlanta" },
            { label: "Alugado", name: "alugado" },
          ].map(({ label, name }) => {
            // Define o tipo da chave para o TypeScript
            type CaracteristicasImovelKeys =
              keyof typeof property.caracteristicasImovel;
            const key = name as CaracteristicasImovelKeys;

            return (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={property.caracteristicasImovel?.[key] || false}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "caracteristicasImovel",
                      key,
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {/* Características do Edifício */}
      <fieldset>
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
            "Gás Canalizado",
            "Tomada Eletrica",
            "Box despejo",
            "Bicicletario",
            "Jardim",
            "Aquecimento Solar",
            "Cerca elétrica",
            "Circuito TV",
            "Precisa de autorização",
          ]}
          checkedItems={getBooleanCheckedItems(
            property.caracteristicasEdificio
          )}
          onCheckboxChange={(name, checked) =>
            handleCheckboxChange("caracteristicasEdificio", name, checked)
          }
        />
      </fieldset>
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
      <fieldset>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos do Imóvel
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFotosChange}
            disabled={isLoading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {/* Previews das fotos selecionadas */}
          {selectedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-16 rounded-md overflow-hidden border border-gray-300"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview da foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removerArquivoSelecionado(idx)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl-md px-1.5 py-0.5 text-xs font-bold hover:bg-opacity-75 transition"
                    aria-label={`Remover foto ${idx + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Fotos já salvas */}
          {(property.fotos || []).length > 0 && (
            <>
              <p className="mt-4 font-semibold">Fotos já salvas:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(property.fotos || []).map((foto, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-16 rounded-md overflow-hidden border border-gray-300"
                  >
                    <img
                      src={foto}
                      alt={`Foto salva ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removerFotoSalva(idx)}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl-md px-1.5 py-0.5 text-xs font-bold hover:bg-opacity-75 transition"
                      aria-label={`Remover foto salva ${idx + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Resto do formulário (vídeo, botões, etc) */}
        {/* ... */}
      </fieldset>
      {/* Botão salvar */}
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
