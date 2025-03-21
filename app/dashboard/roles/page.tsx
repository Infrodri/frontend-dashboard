// app/dashboard/roles/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { fetchRoles, createRole } from "@/app/helpers/apiroles";
import { Role } from "@/app/types/RolesTypes";

export default async function RolesPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.token) {
    redirect("/login");
  }

  let roles: Role[] = [];
  try {
    roles = await fetchRoles(session.user.token);
  } catch (error: any) {
    console.error("Error al obtener roles:", error.message);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">
          Error al cargar los roles: {error.message}. Por favor, intenta de nuevo.
        </p>
      </div>
    );
  }

  const handleCreateRole = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const permissions = (formData.get("permissions") as string).split(",").map((perm) => perm.trim());

    try {
      await createRole({ name, permissions }, session.user.token);
      redirect("/dashboard/roles");
    } catch (error: any) {
      console.error("Error al crear el rol:", error.message);
      redirect(`/dashboard/roles?error=${encodeURIComponent(error.message || "No se pudo crear el rol.")}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Roles</h1>

      {/* Mostrar mensaje de error si existe */}
      {searchParams.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p>Error: {searchParams.error}</p>
        </div>
      )}

      {/* Formulario para crear un nuevo rol */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Crear Nuevo Rol</h2>
        <form action={handleCreateRole} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre del Rol
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full p-2 border rounded"
              placeholder="Ej: admin"
              required
            />
          </div>
          <div>
            <label htmlFor="permissions" className="block text-sm font-medium">
              Permisos (separados por comas)
            </label>
            <input
              id="permissions"
              name="permissions"
              type="text"
              className="mt-1 block w-full p-2 border rounded"
              placeholder="Ej: admin_granted, posts_read"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            aria-label="Crear rol"
          >
            Crear Rol
          </button>
        </form>
      </div>

      {/* Lista de roles */}
      {roles.length === 0 ? (
        <p className="text-gray-500">No hay roles registrados.</p>
      ) : (
        <div className="grid gap-4">
          {roles.map((role) => (
            <div key={role._id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">{role.name}</h2>
              <p>
                <strong>Permisos:</strong> {role.permissions.join(", ")}
              </p>
              <p>
                <strong>Creado:</strong>{" "}
                {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "No especificado"}
              </p>
              <div className="mt-2 space-x-2">
                <Link
                  href={`/dashboard/roles/details/${role._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Ver Detalles
                </Link>
                <Link
                  href={`/dashboard/roles/edit/${role._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}