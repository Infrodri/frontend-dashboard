import Link from "next/link";
import { Paciente } from "@/app/types/PacientesTypes";
import DeleteButton from "../dashboard/pacientes/DeleteButton";
import { auth } from "@/auth";

interface PacientesTableProps {
  pacientes: Paciente[];
  token: string; // Añadimos el token como prop
}

const PacientesTable: React.FC<PacientesTableProps> = ({ pacientes, token }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Estado de Atención
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente._id} className="border-t">
              <td className="px-4 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                    {paciente.primerNombre.charAt(0)}
                    {paciente.primerApellido.charAt(0)}
                  </div>
                  <span>
                    {paciente.primerNombre} {paciente.primerApellido}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    paciente.estado === "Activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {paciente.estado}
                </span>
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    paciente.estadoAtencion === "Pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : paciente.estadoAtencion === "Atendido"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {paciente.estadoAtencion}
                </span>
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <Link
                  href={`/dashboard/pacientes/${paciente._id}`}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Ver Detalles
                </Link>
                <Link
                  href={`/dashboard/pacientes/${paciente._id}/edit?type=info`}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar
                </Link>
                <Link
                  href={`/dashboard/pacientes/${paciente._id}/edit?type=status`}
                  className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Editar Estado
                </Link>
                <DeleteButton pacienteId={paciente._id} token={token} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PacientesTable;