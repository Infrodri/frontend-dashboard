"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Medico } from "@/app/types/MedicosTypes";

interface EditActiveStatusFormProps {
  medico: Medico;
  token: string;
}

const EditActiveStatusForm: React.FC<EditActiveStatusFormProps> = ({ medico, token }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    estaActivo: medico.estaActivo || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  console.log("Valor inicial de formData.estaActivo:", formData.estaActivo);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
    console.log(`Campo ${name} actualizado a:`, value === "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    console.log("Valor de formData.estaActivo antes de enviar:", formData.estaActivo);

    try {
      // Enviar la solicitud a la API Route
      const response = await fetch(`/api/medicos/toggle/${medico._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estaActivo: formData.estaActivo }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo actualizar el estado del médico");
      }

      setSuccessMessage(result.message || "Estado actualizado con éxito");
      setTimeout(() => {
        router.push(`/dashboard/medicos`);
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Error al actualizar el estado:", error);
      setError(error.message || "No se pudo actualizar el estado del médico.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="estaActivo" className="block text-sm font-medium text-gray-700">
          Activo *
        </label>
        <select
          id="estaActivo"
          name="estaActivo"
          value={formData.estaActivo.toString()}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
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
          {isSubmitting ? "Guardando..." : "Guardar"}
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