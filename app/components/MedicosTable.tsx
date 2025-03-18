// app/dashboard/medicos/MedicosTable.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "@/app/dashboard/medicos/DeleteButton";
import { Medico } from "@/app/types/medico";

// Lista de colores suaves de Tailwind
const colorPalette = [
  "red",    // Para Cardiología
  "green",  // Para Pediatría
  "blue",
  "yellow",
  "purple",
  "pink",
  "teal",
  "orange",
  "indigo",
  "cyan",
];

// Función para asignar un color basado en la especialidad
const getColorForEspecialidad = (especialidad: string): string => {
  if (especialidad.toLowerCase() === "cardiología") return "red";
  if (especialidad.toLowerCase() === "pediatría") return "green";

  let hash = 0;
  for (let i = 0; i < especialidad.length; i++) {
    hash = especialidad.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

interface MedicosTableProps {
  medicos: Medico[];
}

const MedicosTable: React.FC<MedicosTableProps> = ({ medicos }) => {
    if (!medicos || medicos.length === 0) {
      return <div className="text-gray-500">No se encontraron médicos.</div>;
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicos.map((medico) => {
              const nombreCompleto = `${medico.primerNombre} ${medico.primerApellido}`.trim();
              const especialidad = medico.especialidades[0]?.nombre || "Sin especialidad";
              const colorKey = getColorForEspecialidad(especialidad);
              const bgColor = `bg-${colorKey}-100`;
              const textColor = `text-${colorKey}-800`;
              const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto)}&size=32&background=random&color=fff`;
  
              return (
                <tr key={medico._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={avatarUrl}
                        alt={nombreCompleto}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900">{nombreCompleto}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
                    >
                      {especialidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        medico.estaActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {medico.estaActivo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
<td className="px-6 py-4 whitespace-nowrap flex space-x-3">
  <Link
    href={`/dashboard/medicos/${medico._id}/detail`}
    className="text-blue-600 hover:text-blue-800 text-sm"
  >
    Ver Detalles
  </Link>
  <Link
    href={`/dashboard/medicos/${medico._id}/edit`}
    className="text-gray-600 hover:text-gray-800"
  >
    <FaEdit size={16} />
  </Link>
  <Link
    href={`/dashboard/medicos/${medico._id}/active-status`}
    className="px-2 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs"
  >
    Editar Estado
  </Link>
  <DeleteButton medicoId={medico._id} />
</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default MedicosTable;