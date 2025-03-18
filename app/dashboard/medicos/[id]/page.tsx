// app/dashboard/medicos/[id]/page.tsx
import { fetchMedicoById } from "@/app/helpers/api";
import { bebas } from "@/app/ui/fonts";
import { notFound } from "next/navigation";

interface MedicoDetailsPageProps {
  params: { id: string };
}

const MedicoDetailsPage = async ({ params }: MedicoDetailsPageProps) => {
  let medico;
  try {
    const response = await fetchMedicoById(params.id);
    medico = response.medico;
  } catch (error) {
    notFound();
  }

  const nombreCompleto = `${medico.primerNombre} ${medico.segundoNombre || ""} ${medico.primerApellido} ${medico.segundoApellido || ""}`.trim();
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto)}&size=64&background=random&color=fff`;

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Detalles del Médico
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={avatarUrl}
            alt={nombreCompleto}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{nombreCompleto}</h2>
            <p className="text-sm text-gray-500">{medico.usuario.email}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ID</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico._id}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cédula</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.cedula}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Primer Nombre</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.primerNombre}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Segundo Nombre</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.segundoNombre || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Primer Apellido</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.primerApellido}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Segundo Apellido</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.segundoApellido || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fecha de Nacimiento</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {medico.fechaNacimiento ? new Date(medico.fechaNacimiento).toLocaleDateString() : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lugar de Nacimiento</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.lugarNacimiento || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nacionalidad</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.nacionalidad || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ciudad Donde Vive</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.ciudadDondeVive || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dirección</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.direccion || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Teléfono</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.telefono || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Celular</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.celular || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Género</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.genero || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Especialidades</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {medico.especialidades.map((esp) => esp.nombre).join(", ") || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Usuario</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.usuario.name}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Email</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.usuario.email}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Estado</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      medico.estaActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {medico.estaActivo ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Creado</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(medico.createdAt).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Actualizado</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(medico.updatedAt).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <a
            href="/dashboard/medicos"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Volver
          </a>
        </div>
      </div>
    </main>
  );
};

export default MedicoDetailsPage;