import { fetchRoles } from "@/app/helpers/apiusers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { bebas } from "@/app/ui/fonts";
import Link from "next/link";
import CreateForm from "@/app/dashboard/usuarios/create/CreateForm";

const CreateUserPage = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.token) {
    console.log("No autenticado, redirigiendo a /login");
    redirect("/login");
  }

  const token = session.user.token; // Extraer el token
  let roles = [];
  let errorMessage: string | null = null;

  try {
    roles = await fetchRoles(token); // Pasar el token
    console.log("Roles cargados en CreateUserPage:", JSON.stringify(roles, null, 2));
  } catch (error: any) {
    console.error("Error al cargar roles:", error);
    errorMessage = error.message || "No se pudieron cargar los roles. Por favor, intenta de nuevo.";
  }

  if (errorMessage || !roles.length) {
    return (
      <main className="p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900`}>
            Crear Usuario
          </h1>
          <Link
            href="/dashboard/usuarios"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-red-500 text-center">
            {errorMessage || "No hay roles disponibles. Por favor, crea un rol primero."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900`}>
          Crear Usuario
        </h1>
        <Link
          href="/dashboard/usuarios"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <CreateForm session={session} roles={roles} />
      </div>
    </main>
  );
};

export default CreateUserPage;