// app/dashboard/medicos/[id]/DetailMedico.tsx
"use client";
import { Medico } from "@/app/types/medico";
import { useRouter } from "next/navigation"; // Importamos useRouter para la navegación

interface DetailMedicoProps {
  medico: Medico;
}

const DetailMedico: React.FC<DetailMedicoProps> = ({ medico }) => {
  const router = useRouter(); // Inicializamos useRouter

  // Función para formatear fechas con validación
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString || typeof dateString !== "string") return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles del Médico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Cédula:</p>
          <p className="text-gray-900">{medico.cedula}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Primer Nombre:</p>
          <p className="text-gray-900">{medico.primerNombre}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Segundo Nombre:</p>
          <p className="text-gray-900">{medico.segundoNombre || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Primer Apellido:</p>
          <p className="text-gray-900">{medico.primerApellido}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Segundo Apellido:</p>
          <p className="text-gray-900">{medico.segundoApellido || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Fecha de Nacimiento:</p>
          <p className="text-gray-900">{medico.fechaNacimiento || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Lugar de Nacimiento:</p>
          <p className="text-gray-900">{medico.lugarNacimiento || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Nacionalidad:</p>
          <p className="text-gray-900">{medico.nacionalidad || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Ciudad donde vive:</p>
          <p className="text-gray-900">{medico.ciudadDondeVive || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Dirección:</p>
          <p className="text-gray-900">{medico.direccion || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Teléfono:</p>
          <p className="text-gray-900">{medico.telefono || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Celular:</p>
          <p className="text-gray-900">{medico.celular || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Género:</p>
          <p className="text-gray-900">{medico.genero || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Estado:</p>
          <p className="text-gray-900">{medico.estaActivo ? "Activo" : "Inactivo"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Especialidades:</p>
          <p className="text-gray-900">
            {medico.especialidades.length > 0
              ? medico.especialidades.map((esp) => esp.nombre).join(", ")
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Usuario:</p>
          <p className="text-gray-900">{medico.usuario.username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Creado:</p>
          <p className="text-gray-900">{formatDate(medico.createdAt)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Actualizado:</p>
          <p className="text-gray-900">{formatDate(medico.updatedAt)}</p>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => router.push("/dashboard/medicos")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default DetailMedico;