// app/dashboard/roles/edit/EditForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateRole } from "@/app/helpers/apiroles";

interface EditFormProps {
  role: { _id: string; name: string; permissions: string[] };
  token: string;
}

export default function EditForm({ role, token }: EditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(role.name);
  const [permissions, setPermissions] = useState(role.permissions.join(", "));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const permissionsArray = permissions.split(",").map((perm) => perm.trim());
      await updateRole(role._id, { name, permissions: permissionsArray }, token);
      router.push(`/dashboard/roles/details/${role._id}`);
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar el rol.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p>Error: {error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Nombre del Rol
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          type="text"
          value={permissions}
          onChange={(e) => setPermissions(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej: admin_granted, posts_read"
          required
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/roles/details/${role._id}`)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}