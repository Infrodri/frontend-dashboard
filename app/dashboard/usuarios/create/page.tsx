// app/dashboard/medicos/create/page.tsx
import { bebas } from "@/app/ui/fonts";
import { Breadcrumbs } from "anjrot-components";
import CreateMedicoForm from "./CreateForm";
import { auth } from "@/auth";
import { fetchEspecialidades, fetchUsers } from "@/app/helpers/apimedicos";
import { Especialidad, Usuario } from "@/app/types/medico";

const breadCrumbs = [
  { label: "Médicos", href: "/dashboard/medicos" },
  { label: "Crear Médico", href: "/dashboard/medicos/create", active: true },
];

const CreateMedicoPage = async () => {
  const session = await auth();
  let users: Usuario[] = [];
  let especialidades: Especialidad[] = [];

  try {
    users = await fetchUsers();
    especialidades = await fetchEspecialidades();
  } catch (error) {
    console.error("Error loading data for CreateMedicoPage:", error);
  }

  console.log("CreateMedicoPage users:>> ", users);
  console.log("CreateMedicoPage especialidades:>> ", especialidades);

  return (
    <main>
      <Breadcrumbs breadcrumb={breadCrumbs} className={bebas.className} />
      <div className="p-4">
        {(!users || users.length === 0) && (
          <p className="text-red-500 mb-4">No se encontraron usuarios disponibles. Por favor, crea un usuario primero.</p>
        )}
        {(!especialidades || especialidades.length === 0) && (
          <p className="text-red-500 mb-4">No se encontraron especialidades disponibles. Por favor, crea una especialidad primero.</p>
        )}
        <CreateMedicoForm session={session} users={users} especialidades={especialidades} />
      </div>
    </main>
  );
};

export default CreateMedicoPage;