// app/dashboard/medicos/create/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { bebas } from "@/app/ui/fonts";
import CreateForm from "./CreateForm";
import { fetchEspecialidades, fetchUsersList, fetchMedicos } from "@/app/helpers/apimedicos";
import { Session } from "next-auth";

export default async function CreateMedicoPage() {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) redirect("/login");

  const especialidades = await fetchEspecialidades();
  const users = await fetchUsersList();

  const { medicos } = await fetchMedicos(1, 1000);
  const medicoUserIds = medicos.map((medico) => {
    return typeof medico.usuario === "string" ? medico.usuario : medico.usuario?._id;
  }).filter(Boolean);

  const availableUsers = users.filter((user) => !medicoUserIds.includes(user._id));

  console.log("Especialidades obtenidas en CreateMedicoPage:", JSON.stringify(especialidades, null, 2));
  console.log("Usuarios disponibles en CreateMedicoPage:", JSON.stringify(availableUsers, null, 2));

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Crear Médico
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {availableUsers.length === 0 && (
          <p className="text-yellow-500 text-center mb-4">
            No hay usuarios disponibles para asociar. Por favor, crea un usuario primero o verifica que no todos estén asociados a médicos.
          </p>
        )}
        <CreateForm session={session} especialidades={especialidades} users={availableUsers} />
      </div>
    </main>
  );
}