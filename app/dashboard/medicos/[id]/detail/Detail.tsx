// app/dashboard/medicos/[id]/detail/Detail.tsx
import { Medico } from "@/app/types/MedicosTypes";
import Link from "next/link";

interface DetailProps {
  medico: Medico;
}

const Detail: React.FC<DetailProps> = ({ medico }) => {
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
      <h1 className="text-2xl font-bold mb-4">Detalles del Médico</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Cédula:</strong> {medico.cedula}</p>
          <p><strong>Primer Nombre:</strong> {medico.primerNombre}</p>
          <p><strong>Segundo Nombre:</strong> {medico.segundoNombre || "No especificado"}</p>
          <p><strong>Primer Apellido:</strong> {medico.primerApellido}</p>
          <p><strong>Segundo Apellido:</strong> {medico.segundoApellido || "No especificado"}</p>
          <p><strong>Fecha de Nacimiento:</strong> {new Date(medico.fechaNacimiento).toLocaleDateString("es-ES")}</p>
          <p><strong>Lugar de Nacimiento:</strong> {medico.lugarNacimiento}</p>
          <p><strong>Nacionalidad:</strong> {medico.nacionalidad}</p>
        </div>
        <div>
          <p><strong>Ciudad de Residencia:</strong> {medico.ciudadDondeVive}</p>
          <p><strong>Dirección:</strong> {medico.direccion}</p>
          <p><strong>Teléfono:</strong> {medico.telefono}</p>
          <p><strong>Celular:</strong> {medico.celular}</p>
          <p><strong>Género:</strong> {medico.genero}</p>
          <p>
            <strong>Especialidades:</strong>{" "}
            {Array.isArray(medico.especialidades) && medico.especialidades.length > 0
              ? medico.especialidades.map((esp: any) => esp.nombre || esp).join(", ")
              : "No especificado"}
          </p>
          <p>
            <strong>Usuario:</strong>{" "}
            {typeof medico.usuario === "string" ? medico.usuario : (medico.usuario as any)?.name || "No especificado"}
          </p>
          <p><strong>Estado:</strong> {medico.estado}</p>
          <p><strong>Activo:</strong> {medico.estaActivo ? "Sí" : "No"}</p>
        </div>
      </div>
      <div className="mt-4">
        <p><strong>Creado:</strong> {formatDate(medico.createdAt)}</p>
        <p><strong>Actualizado:</strong> {formatDate(medico.updatedAt)}</p>
      </div>
      <div className="mt-6">
        <Link href="/dashboard/medicos" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
          Volver
        </Link>
      </div>
    </div>
  );
};

export default Detail;