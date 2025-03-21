// app/dashboard/roles/create/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createRole } from "@/app/helpers/apiroles";

export default async function CreateRolePage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const handleCreateRole = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const permissions = (formData.get("permissions") as string).split(",").map((perm) => perm.trim());

    try {
      await createRole({ name, permissions });
      redirect("/dashboard/roles");
    } catch (error: any) {
      console.error("Error al crear el rol:", error.message);
      redirect(`/dashboard/roles/create?error=${encodeURIComponent(error.message || "No se pudo crear el rol.")}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Rol</h1>

      {/* Mostrar mensaje de error si existe */}
      {searchParams.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p>Error: {searchParams.error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
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
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              aria-label="Crear rol"
            >
              Crear Rol
            </button>
            <a
              href="/dashboard/roles"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}