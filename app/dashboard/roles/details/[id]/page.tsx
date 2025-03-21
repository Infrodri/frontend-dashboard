// app/dashboard/roles/details/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { fetchRoleById, deleteRole } from "@/app/helpers/apiroles";
import { Role } from "@/app/types/RolesTypes";

interface RoleDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoleDetailsPage({ params }: RoleDetailsPageProps) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.token) {
    redirect("/login");
  }

  let role: Role | null = null;
  try {
    role = await fetchRoleById(resolvedParams.id, session.user.token);
  } catch (error: any) {
    console.error("Error al obtener el rol:", error.message);
    let errorMessage = "Error al cargar el rol. Por favor, intenta de nuevo.";

    if (error.message.includes("404")) {
      errorMessage = "Rol no encontrado para el ID proporcionado.";
    } else if (error.message.includes("401")) {
      errorMessage = "No autorizado. Por favor, inicia sesión nuevamente.";
      redirect("/login");
    }

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{errorMessage}</p>
        <Link href="/dashboard/roles" className="text-blue-500 hover:underline">
          Volver a la lista de roles
        </Link>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Rol No Encontrado</h1>
        <p className="text-gray-500">Rol no encontrado para el ID: {resolvedParams.id}.</p>
        <Link href="/dashboard/roles" className="text-blue-500 hover:underline">
          Volver a la lista de roles
        </Link>
      </div>
    );
  }

  const handleDeleteRole = async () => {
    "use server";
    try {
      await deleteRole(resolvedParams.id, session.user.token);
      redirect("/dashboard/roles");
    } catch (error: any) {
      console.error("Error al eliminar el rol:", error.message);
      redirect(`/dashboard/roles?error=${encodeURIComponent(error.message || "No se pudo eliminar el rol.")}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalles del Rol</h1>
        <Link href="/dashboard/roles" className="text-blue-500 hover:underline">
          Volver a la lista de roles
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Información del Rol</h2>
        <p>
          <strong>Nombre:</strong> {role.name}
        </p>
        <p>
          <strong>Permisos:</strong> {role.permissions.join(", ")}
        </p>
        <p>
          <strong>Creado:</strong>{" "}
          {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "No especificado"}
        </p>
        <p>
          <strong>Actualizado:</strong>{" "}
          {role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : "No especificado"}
        </p>
      </div>

      <div className="flex space-x-4">
        <Link
          href={`/dashboard/roles/edit/${role._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Editar Rol
        </Link>
        <form action={handleDeleteRole}>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={(e) => {
              if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) {
                e.preventDefault();
              }
            }}
          >
            Eliminar Rol
          </button>
        </form>
      </div>
    </div>
  );
}