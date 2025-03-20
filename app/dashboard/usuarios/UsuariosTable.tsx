import Link from "next/link";
import { User } from "@/app/types/UsersTypes";
import DeleteButton from "./DeleteButton";
import { auth } from "@/auth";

interface UsuariosTableProps {
  users: User[];
}

const UsuariosTable: React.FC<UsuariosTableProps> = async ({ users }) => {
  const session = await auth();
  const token = session?.user?.token || "";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-6 border-b text-left text-gray-700 font-semibold">Nombre</th>
            <th className="py-3 px-6 border-b text-left text-gray-700 font-semibold">Username</th>
            <th className="py-3 px-6 border-b text-left text-gray-700 font-semibold">Email</th>
            <th className="py-3 px-6 border-b text-left text-gray-700 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-6 border-b text-gray-900">{user.name || "Sin nombre"}</td>
              <td className="py-3 px-6 border-b text-gray-900">{user.username || "Sin username"}</td>
              <td className="py-3 px-6 border-b text-gray-900">{user.email || "Sin email"}</td>
              <td className="py-3 px-6 border-b flex space-x-2">
                <Link
                  href={`/dashboard/usuarios/${user._id}/edit`}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar
                </Link>
                <DeleteButton userId={user._id} token={token} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosTable;