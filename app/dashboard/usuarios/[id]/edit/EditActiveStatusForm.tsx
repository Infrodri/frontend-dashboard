// app/dashboard/medicos/[id]/edit/EditActiveStatusForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateMedico } from "@/app/helpers/apimedicos";
import { Medico } from "@/app/types/medico"; // Importamos la interfaz correcta

interface EditActiveStatusFormProps {
  medico: Medico;
  token: string;
}

const EditActiveStatusForm: React.FC<EditActiveStatusFormProps> = ({ medico, token }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    estaActivo: medico.estaActivo,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedMedicoData = {
        _id: medico._id,
        estaActivo: formData.estaActivo,
      };

      const response = await updateMedico(updatedMedicoData, token);
      setSuccessMessage(response.message || "Estado del médico actualizado con éxito");
      setTimeout(() => {
        router.push(`/dashboard/medicos/${medico._id}`);
        router.refresh();
      }, 1000);
    } catch (error: any) {
      setError(error.message || "No se pudo actualizar el estado del médico.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="estaActivo" className="block text-sm font-medium text-gray-700">
          Estado Activo
        </label>
        <input
          type="checkbox"
          id="estaActivo"
          name="estaActivo"
          checked={formData.estaActivo}
          onChange={handleChange}
          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Estado"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/medicos`)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditActiveStatusForm;