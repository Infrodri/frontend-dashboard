// app/dashboard/fichas-medicas/FichasMedicasTable.tsx
import Link from "next/link";
import { FichaMedica } from "@/helpers/apifichasmedicas";

interface FichasMedicasTableProps {
  fichas: FichaMedica[];
}

export default function FichasMedicasTable({ fichas }: FichasMedicasTableProps) {
  // Verificar si fichas es un array, si no, mostrar un mensaje
  if (!Array.isArray(fichas)) {
    console.error("fichas no es un array:", fichas);
    return <div>No se encontraron fichas médicas para mostrar.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paciente
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
          {fichas.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No hay fichas médicas disponibles.
              </td>
            </tr>
          ) : (
            fichas.map((ficha) => (
              <tr key={ficha._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ficha.paciente.primerNombre} {ficha.paciente.primerApellido}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ficha.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ficha.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/fichas-medicas/details/${ficha._id}`}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Ver Detalles
                  </Link>
                  <Link
                    href={`/dashboard/fichas-medicas/reporte/${ficha._id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Generar Reporte
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}