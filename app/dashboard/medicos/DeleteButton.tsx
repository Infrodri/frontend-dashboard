// app/dashboard/medicos/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { auth } from "@/auth";

const DeleteButton: React.FC<{ medicoId: string }> = ({ medicoId }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este médico?")) return;

    setIsDeleting(true);
    try {
      const session = await auth();
      const token = session?.user?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicos/${medicoId}/soft`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el médico.");
      }

      // Refrescar la página después de eliminar
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar el médico:", error);
      alert("No se pudo eliminar el médico. Por favor, intenta de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-red-600 hover:text-red-800 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <FaTrash size={16} />
    </button>
  );
};

export default DeleteButton;