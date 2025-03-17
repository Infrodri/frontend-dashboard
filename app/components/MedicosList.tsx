// app/dashboard/(overview)/MedicosList.tsx
import React from "react";
import Image from "next/image";

// Definir tipo para los datos transformados
interface Medico {
  id: string;
  name: string;
  email: string; // Usado para especialidades
  amount: number;
  image_url: string;
}

interface MedicosListProps {
  medicos: Medico[];
  className?: string;
  footerClassName?: string;
}

// Lista de colores suaves de Tailwind
const colorPalette = [
  "red",    // Para Cardiología
  "green",  // Para Pediatría
  "blue",   // Para otras especialidades
  "yellow", // Para otras especialidades
  "purple", // Para otras especialidades
  "pink",   // Para otras especialidades
  "teal",   // Para otras especialidades
  "orange", // Para otras especialidades
  "indigo", // Para otras especialidades
  "cyan",   // Para otras especialidades
];

// Función para asignar un color basado en la especialidad
const getColorForEspecialidad = (especialidad: string): string => {
  // Mapeo específico para ciertas especialidades
  if (especialidad.toLowerCase() === "cardiología") return "red";
  if (especialidad.toLowerCase() === "pediatría") return "green";

  // Para otras especialidades, usamos un hash simple para seleccionar un color
  let hash = 0;
  for (let i = 0; i < especialidad.length; i++) {
    hash = especialidad.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

const MedicosList: React.FC<MedicosListProps> = ({ medicos, className = "", footerClassName = "" }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 ${className}`}>
      <ul className="space-y-4">
        {medicos.map((medico) => {
          // Obtener el color basado en la especialidad (email)
          const especialidad = medico.email;
          const colorKey = getColorForEspecialidad(especialidad);
          const bgColor = `bg-${colorKey}-100`; // Ejemplo: bg-red-100, bg-green-100
          const textColor = `text-${colorKey}-800`; // Ejemplo: text-red-800, text-green-800

          return (
            <li key={medico.id} className="flex items-center">
  <div className="flex items-center space-x-3">
    <Image
      src={medico.image_url}
      alt={medico.name}
      width={32}
      height={32}
      className="rounded-full"
    />
    <div>
      <p className="text-sm font-medium text-gray-900">{medico.name}</p>
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {especialidad}
      </span>
    </div>
  </div>
</li>
          );
        })}
      </ul>
      {/* Footer */}
      <div className={`mt-4 ${footerClassName}`}>
        <p className="text-xs text-gray-500">Updated just now</p>
      </div>
    </div>
  );
};

export default MedicosList;