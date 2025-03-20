// app/dashboard/pacientes/[id]/detail/Detail.tsx
import { Paciente } from "@/app/types/PacientesTypes";
import Link from "next/link";

interface DetailProps {
  paciente: Paciente;
}

const Detail: React.FC<DetailProps> = ({ paciente }) => {
  // Función para formatear las fechas
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Detalles del Paciente</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Cédula:</strong> {paciente.cedula || "No especificada"}</p>
          <p><strong>Primer Nombre:</strong> {paciente.primerNombre}</p>
          <p><strong>Segundo Nombre:</strong> {paciente.segundoNombre || "No especificado"}</p>
          <p><strong>Primer Apellido:</strong> {paciente.primerApellido}</p>
          <p><strong>Segundo Apellido:</strong> {paciente.segundoApellido || "No especificado"}</p>
          <p><strong>Fecha de Nacimiento:</strong> {new Date(paciente.fechaNacimiento).toLocaleDateString("es-ES")}</p>
        </div>
        <div>
          <p><strong>Dirección:</strong> {paciente.direccion}</p>
          <p><strong>Teléfono:</strong> {paciente.telefono}</p>
          <p><strong>Celular:</strong> {paciente.celular}</p>
          <p><strong>Género:</strong> {paciente.genero}</p>
          <p><strong>Estado:</strong> {paciente.estado}</p>
          <p><strong>Estado de Atención:</strong> {paciente.estadoAtencion}</p>
        </div>
      </div>
      <div className="mt-4">
        <p><strong>Creado:</strong> {formatDate(paciente.createdAt)}</p>
        <p><strong>Actualizado:</strong> {formatDate(paciente.updatedAt)}</p>
      </div>
      <div className="mt-6">
        <Link href="/dashboard/pacientes" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
          Volver
        </Link>
      </div>
    </div>
  );
};

export default Detail;