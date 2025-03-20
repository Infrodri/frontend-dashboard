// app/dashboard/medicos/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMedico } from "@/app/helpers/apimedicos";
import { auth } from "@/auth";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este médico?")) return;

    setIsDeleting(true);
    try {
      const session = await auth();
      const token = session?.user?.token;
      if (!token) throw new Error("No autenticado");

      await deleteMedico(id, token);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar médico:", error);
      alert("No se pudo eliminar el médico.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Eliminar
    </button>
  );
};

export default DeleteButton;