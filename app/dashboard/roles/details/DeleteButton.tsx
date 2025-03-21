// app/dashboard/roles/details/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { deleteRole } from "@/app/helpers/apiroles";

interface DeleteButtonProps {
  roleId: string;
}

export default function DeleteButton({ roleId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) {
      return;
    }

    try {
      await deleteRole(roleId);
      router.push("/dashboard/roles");
    } catch (error: any) {
      console.error("Error al eliminar el rol:", error.message);
      router.push(`/dashboard/roles?error=${encodeURIComponent(error.message || "No se pudo eliminar el rol.")}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Eliminar Rol
    </button>
  );
}