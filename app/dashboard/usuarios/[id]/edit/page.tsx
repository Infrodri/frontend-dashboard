import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchUserById, fetchRoles, updateUser } from "@/app/helpers/apiusers";
import { bebas } from "@/app/ui/fonts";
import Link from "next/link";

interface EditUserPageProps {
  params: { id: string };
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    console.log("No autenticado, redirigiendo a /login");
    redirect("/login");
  }

  const user = await fetchUserById(params.id);
  if (!user) {
    redirect("/dashboard/usuarios");
  }

  const roles = await fetchRoles();

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const selectedRoles = formData.getAll("roles") as string[];

    try {
      const updatedUser = {
        name,
        username,
        email,
        ...(password && { password }), // Solo incluir password si se proporciona
        roles: selectedRoles,
      };
      await updateUser(params.id, updatedUser);
      redirect("/dashboard/usuarios");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw new Error("No se pudo actualizar el usuario");
    }
  };

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900`}>
          Editar Usuario
        </h1>
        <Link
          href="/dashboard/usuarios"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={user.username}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user.email}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña (dejar en blanco para no cambiar)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
              Roles
            </label>
            <select
              id="roles"
              name="roles"
              multiple
              defaultValue={user.roles?.map((role) => role._id) || []}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Link
              href="/dashboard/usuarios"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditUserPage;