"use client";

import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/helpers/apiusers";

interface DeleteButtonProps {
  userId: string;
  token: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ userId, token }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el usuario con ID ${userId}?`)) {
      return;
    }

    try {
      // Usamos fetch directamente en el cliente, pasando el token
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el usuario");
      }

      router.refresh(); // Refresca la página para actualizar la lista
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario. Por favor, intenta de nuevo.");
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