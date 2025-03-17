// app/components/StatsCards.tsx
import React from "react";
import { FaUsers, FaStethoscope, FaClock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

interface StatsCardsProps {
  totalPacientes: string;
  totalConsultas: string;
  pacientesPendientes: string;
  pacientesAtendidos: string;
  pacientesDerivados: string;
  consultasUrgentes: string;
  className?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalPacientes,
  totalConsultas,
  pacientesPendientes,
  pacientesAtendidos,
  consultasUrgentes,
  className = "",
}) => {
  // Convertir consultasUrgentes a número para la comparación
  const consultasUrgentesNumber = parseInt(consultasUrgentes, 10);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
      {/* Tarjeta: Total Pacientes */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Pacientes</h3>
          <FaUsers className="text-blue-500 text-lg" />
        </div>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{totalPacientes}</p>
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Pacientes
          </span>
        </div>
      </div>

      {/* Tarjeta: Total Consultas */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Consultas</h3>
          <FaStethoscope className="text-green-500 text-lg" />
        </div>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{totalConsultas}</p>
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Consultas
          </span>
        </div>
      </div>

      {/* Tarjeta: Consultas Pendientes */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consultas Pendientes</h3>
          <FaClock className="text-yellow-500 text-lg" />
        </div>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{pacientesPendientes}</p>
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        </div>
      </div>

      {/* Tarjeta: Consultas Urgentes */}
      <div className={`p-4 rounded-lg shadow-md border border-gray-200 ${consultasUrgentesNumber > 5 ? "bg-red-50" : "bg-white"}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consultas Urgentes</h3>
          <FaExclamationTriangle className="text-red-500 text-lg" />
        </div>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{consultasUrgentes}</p>
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Urgente
          </span>
        </div>
      </div>

      {/* Tarjeta: Consultas Concluidas */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consultas Concluidas</h3>
          <FaCheckCircle className="text-teal-500 text-lg" />
        </div>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{pacientesAtendidos}</p>
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
            Concluida
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;