// app/dashboard/pacientes/DetailModal.tsx
"use client";

import { useState } from "react";
import { Paciente } from "@/app/types/PacientesTypes";

interface DetailModalProps {
  paciente: Paciente;
}

const DetailModal: React.FC<DetailModalProps> = ({ paciente }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
      >
        <span className="mr-1">👁️</span> Ver Detalles
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detalles del Paciente</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <p><strong>Cédula:</strong> {paciente.cedula || "No especificada"}</p>
              <p><strong>Primer Nombre:</strong> {paciente.primerNombre}</p>
              <p><strong>Segundo Nombre:</strong> {paciente.segundoNombre || "No especificado"}</p>
              <p><strong>Primer Apellido:</strong> {paciente.primerApellido}</p>
              <p><strong>Segundo Apellido:</strong> {paciente.segundoApellido || "No especificado"}</p>
              <p><strong>Fecha de Nacimiento:</strong> {new Date(paciente.fechaNacimiento).toLocaleDateString()}</p>
              <p><strong>Dirección:</strong> {paciente.direccion}</p>
              <p><strong>Teléfono:</strong> {paciente.telefono}</p>
              <p><strong>Celular:</strong> {paciente.celular}</p>
              <p><strong>Género:</strong> {paciente.genero}</p>
              <p><strong>Estado:</strong> {paciente.estado}</p>
              <p><strong>Estado de Atención:</strong> {paciente.estadoAtencion}</p>
              <p><strong>Creado:</strong> {new Date(paciente.createdAt).toLocaleString()}</p>
              <p><strong>Actualizado:</strong> {new Date(paciente.updatedAt).toLocaleString()}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailModal;