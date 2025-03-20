// app/dashboard/pacientes/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
  pacienteId: string;
  token: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ pacienteId, token }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este paciente?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/pacientes/delete/${pacienteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el paciente");
      }

      router.push("/dashboard/pacientes");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "No se pudo eliminar el paciente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Eliminar
    </button>
     
    </div>
  );
};

export default DeleteButton;