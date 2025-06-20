// src/components/ScheduleVisitModal.tsx
"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, ArrowLeft } from "lucide-react";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

const availableTimes = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export function ScheduleVisitModal({
  isOpen,
  onClose,
  propertyTitle,
}: ScheduleVisitModalProps) {
  // 1. NOVO ESTADO para controlar a etapa do formulário
  const [step, setStep] = useState(1);

  // Estados para guardar os dados coletados
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  if (!isOpen) return null;

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(2); // Avança para a próxima etapa
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSchedule = () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !contactInfo.nome ||
      !contactInfo.email
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formattedDate = format(selectedDate, "PPP", { locale: ptBR });
    const leadData = {
      propertyTitle,
      visitDate: formattedDate,
      visitTime: selectedTime,
      ...contactInfo,
    };

    console.log("Novo Lead de Agendamento:", leadData);
    alert(
      `Sugestão de visita para "${propertyTitle}" enviada com sucesso! Um corretor entrará em contato para confirmar.`
    );
    onClose(); // Fecha o modal
    setStep(1); // Reseta para a etapa 1 para a próxima vez
  };

  const inputClass =
    "mt-1 w-full p-2 rounded-md shadow-sm border border-white focus:ring-blue-500 focus:border-blue-500 transition-colors";

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-black/60 rounded-xl p-8 relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Lógica para voltar para a Etapa 1 */}
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-sm text-white hover:text-black mb-4"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        )}

        <h2 className="text-2xl font-bold mb-2">Agendar Visita</h2>
        <p className="text-sm text-white mb-4">
          Para o imóvel:{" "}
          <span className="font-semibold">"{propertyTitle}"</span>
        </p>

        {/* ETAPA 1: SELEÇÃO DE DATA E HORA */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                1. Escolha uma data
              </h3>
              <div className="flex justify-center border rounded-md p-2 bg-black/60">
                <DayPicker
                  className="small-daypicker"
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  fromDate={new Date()}
                />
              </div>
            </div>

            {selectedDate && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  2. Escolha um horário
                </h3>
                <div className="grid grid-cols-7 gap-2 ">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-1 rounded-sm border text-sm transition-colors bg-black/60 hover:bg-gray-200`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ETAPA 2: DADOS DE CONTATO */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center bg-blue-50 p-3 rounded-md">
              <p className="font-semibold text-blue-800">
                Data: {selectedDate && format(selectedDate, "dd/MM/yyyy")} às{" "}
                {selectedTime}
              </p>
            </div>
            <h3 className="text-sm font-semibold text-white pt-4">
              3. Seus Dados de Contato
            </h3>
            <div>
              <label
                htmlFor="nome"
                className="block text-xs font-medium text-white  "
              >
                Seu nome*
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                value={contactInfo.nome}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-white"
              >
                Seu email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={contactInfo.email}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="telefone"
                className="block text-xs font-medium text-white"
              >
                Seu telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={contactInfo.telefone}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div className="pt-4 ">
              <button
                onClick={handleSchedule}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
              >
                Enviar Pedido de Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
