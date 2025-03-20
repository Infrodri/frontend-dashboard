// app/components/MedicosTable.tsx
import Link from "next/link";
import DeleteButton from "@/app/dashboard/medicos/DeleteButton";
import { Medico } from "@/app/types/MedicosTypes";

interface MedicosTableProps {
  medicos: Medico[];
}

const MedicosTable: React.FC<MedicosTableProps> = ({ medicos }) => {
  const getInitials = (primerNombre: string, primerApellido: string) => {
    return `${primerNombre.charAt(0)}${primerApellido.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {medicos.map((medico) => (
            <tr key={medico._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {getInitials(medico.primerNombre, medico.primerApellido)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {medico.primerNombre} {medico.primerApellido}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    medico.estado === "Activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {medico.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    medico.estaActivo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {medico.estaActivo ? "Sí" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/dashboard/medicos/${medico._id}`}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Ver Detalles
                </Link>
                <Link
                  href={`/dashboard/medicos/${medico._id}/edit?type=info`}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar
                </Link>
                <Link
                  href={`/dashboard/medicos/${medico._id}/edit?type=status`}
                  className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Editar Estado
                </Link>
                <DeleteButton id={medico._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicosTable;