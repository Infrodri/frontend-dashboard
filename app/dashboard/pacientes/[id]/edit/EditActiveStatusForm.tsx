// app/dashboard/pacientes/[id]/edit/EditActiveStatusForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Paciente } from "@/app/types/PacientesTypes";

interface EditActiveStatusFormProps {
  paciente: Paciente;
  token: string;
}

const EditActiveStatusForm: React.FC<EditActiveStatusFormProps> = ({ paciente, token }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    estado: paciente.estado || "Activo",
    estadoAtencion: paciente.estadoAtencion || "Pendiente",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validar que los campos no estén vacíos
    if (!formData.estado || !formData.estadoAtencion) {
      setError("Por favor, selecciona un valor para ambos campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/pacientes/update/${paciente._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          estado: formData.estado,
          estadoAtencion: formData.estadoAtencion,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el estado del paciente.");
      }

      setSuccessMessage(result.message || "Estado actualizado con éxito");
      setTimeout(() => {
        router.push(`/dashboard/pacientes`);
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Error al actualizar el estado:", error);
      setError(error.message || "No se pudo actualizar el estado del paciente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label htmlFor="estadoAtencion" className="block text-sm font-medium text-gray-700">
          Estado de Atención *
        </label>
        <select
          id="estadoAtencion"
          name="estadoAtencion"
          value={formData.estadoAtencion}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Atendido">Atendido</option>
          <option value="Derivado">Derivado</option>
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
          onClick={() => router.push(`/dashboard/pacientes`)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditActiveStatusForm;