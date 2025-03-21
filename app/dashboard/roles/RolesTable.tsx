// app/dashboard/roles/RolesTable.tsx (Opción con "Ver Más")
"use client"; // Este componente necesita ser cliente para manejar el estado de "Ver más"

import Link from "next/link";
import { Role } from "@/app/types/RolesTypes";
import { useState } from "react";

interface RolesTableProps {
  roles: Role[];
}

export default function RolesTable({ roles }: RolesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Permisos
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.map((role) => (
            <RoleRow key={role._id} role={role} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleRow({ role }: { role: Role }) {
  const [showAllPermissions, setShowAllPermissions] = useState(false);
  const maxPermissionsToShow = 3;
  const permissionsToShow = showAllPermissions
    ? role.permissions
    : role.permissions.slice(0, maxPermissionsToShow);
  const hasMorePermissions = role.permissions.length > maxPermissionsToShow;

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {role.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="max-w-xs">
          {permissionsToShow.join(", ")}
          {hasMorePermissions && !showAllPermissions && (
            <button
              onClick={() => setShowAllPermissions(true)}
              className="text-blue-600 hover:text-blue-800 ml-2"
            >
              Ver más
            </button>
          )}
          {hasMorePermissions && showAllPermissions && (
            <button
              onClick={() => setShowAllPermissions(false)}
              className="text-blue-600 hover:text-blue-800 ml-2"
            >
              Ver menos
            </button>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Link
          href={`/dashboard/roles/details/${role._id}`}
          className="text-blue-600 hover:text-blue-800 mr-4"
        >
          Ver Detalles
        </Link>
        <Link
          href={`/dashboard/roles/edit/${role._id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          Editar
        </Link>
      </td>
    </tr>
  );
}