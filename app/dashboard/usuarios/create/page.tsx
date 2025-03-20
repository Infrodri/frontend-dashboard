// app/dashboard/usuarios/create/page.tsx
import { bebas } from "@/app/ui/fonts";
import CreateForm from "./CreateForm";
import { auth } from "@/auth";
import { fetchRoles } from "@/app/helpers/apiusers";
import { Role } from "@/app/types/UsersTypes";
import { Session } from "next-auth";

export default async function CreatePage() {
  const session = await auth();
  if (!session?.user?.token) {
    throw new Error("No autenticado");
  }

  const roles = await fetchRoles();
  console.log("Roles obtenidos en CreatePage:", JSON.stringify(roles, null, 2)); // Depuración detallada

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Crear Usuario
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <CreateForm session={session} roles={roles} />
      </div>
    </main>
  );
}