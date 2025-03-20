import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchMedicoById, fetchEspecialidades, fetchUsersList, fetchMedicos } from "@/app/helpers/apimedicos";
import EditActiveStatusForm from "./EditActiveStatusForm";
import { bebas } from "@/app/ui/fonts";
import EditForm from "@/app/dashboard/medicos/[id]/edit/EditForm";

interface EditMedicoPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

const EditMedicoPage = async ({ params, searchParams }: EditMedicoPageProps) => {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) redirect("/login");

  // Esperar la resolución de params y searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Obtener el médico que se está editando
  const medico = await fetchMedicoById(resolvedParams.id);
  if (!medico) {
    console.error("No se encontró el médico con ID:", resolvedParams.id);
    redirect("/dashboard/medicos");
  }

  // Obtener especialidades y usuarios
  const especialidades = await fetchEspecialidades();
  let users = await fetchUsersList();

  // Obtener la lista de médicos para excluir usuarios ya registrados
  const { medicos } = await fetchMedicos(1, 1000); // Obtener todos los médicos (ajusta el límite según sea necesario)
  const medicoUserIds = medicos
    .filter((m) => m._id !== resolvedParams.id) // Excluir el médico actual para permitir que su usuario siga siendo seleccionable
    .map((medico) => {
      // El campo usuario puede ser un string (ID) o un objeto poblado
      return typeof medico.usuario === "string" ? medico.usuario : medico.usuario?._id;
    })
    .filter(Boolean); // Filtrar valores undefined o null

  // Obtener el ID del usuario actual del médico
  const currentUserId = typeof medico.usuario === "string" ? medico.usuario : medico.usuario?._id;

  // Filtrar usuarios que no estén en la lista de médicos (excepto el usuario del médico actual)
  let availableUsers = users.filter((user) => !medicoUserIds.includes(user._id));

  // Asegurarnos de que el usuario actual del médico esté en la lista de usuarios disponibles
  if (currentUserId && !availableUsers.some((user) => user._id === currentUserId)) {
    const currentUser = users.find((user) => user._id === currentUserId);
    if (currentUser) {
      availableUsers = [currentUser, ...availableUsers];
    } else {
      console.warn("Usuario actual del médico no encontrado en la lista de usuarios:", currentUserId);
    }
  }

  console.log("Médico cargado en EditMedicoPage:", JSON.stringify(medico, null, 2));
  console.log("Especialidades obtenidas en EditMedicoPage:", JSON.stringify(especialidades, null, 2));
  console.log("Usuarios disponibles en EditMedicoPage:", JSON.stringify(availableUsers, null, 2));

  const type = resolvedSearchParams.type || "info";

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        {type === "info" ? "Editar Médico" : "Editar Estado del Médico"}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {type === "info" ? (
          <>
            {availableUsers.length === 0 && (
              <p className="text-yellow-500 text-center mb-4">
                No hay usuarios disponibles para asociar. Por favor, crea un usuario primero o verifica que no todos estén asociados a médicos.
              </p>
            )}
            <EditForm medico={medico} token={token} especialidades={especialidades} users={availableUsers} session={session} />
          </>
        ) : (
          <EditActiveStatusForm medico={medico} token={token} />
        )}
      </div>
    </main>
  );
};

export default EditMedicoPage;