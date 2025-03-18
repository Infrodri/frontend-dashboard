// app/dashboard/medicos/[id]/edit/EditMedicoForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/auth";

interface Especialidad {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

interface Usuario {
  _id: string;
  name: string;
  username: string;
  email: string;
  permissions: string[];
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface Medico {
  _id: string;
  cedula: string;
  primerNombre: string;
  primerApellido: string;
  estado: string;
  estaActivo: boolean;
  especialidades: Especialidad[];
  usuario: Usuario;
}

interface EditMedicoFormProps {
  medico: Medico;
}

const EditMedicoForm: React.FC<EditMedicoFormProps> = ({ medico }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    primerNombre: medico.primerNombre,
    primerApellido: medico.primerApellido,
    estaActivo: medico.estaActivo,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const session = await auth();
      const token = session?.user?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicos/${medico._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el médico.");
      }

      // Redirigir a la lista de médicos después de actualizar
      router.push("/dashboard/medicos");
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar el médico:", error);
      alert("No se pudo actualizar el médico. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="primerNombre" className="block text-sm font-medium text-gray-700">
          Primer Nombre
        </label>
        <input
          type="text"
          id="primerNombre"
          name="primerNombre"
          value={formData.primerNombre}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="primerApellido" className="block text-sm font-medium text-gray-700">
          Primer Apellido
        </label>
        <input
          type="text"
          id="primerApellido"
          name="primerApellido"
          value={formData.primerApellido}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="estaActivo" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="estaActivo"
          name="estaActivo"
          value={formData.estaActivo ? "true" : "false"}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
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
          onClick={() => router.push("/dashboard/medicos")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditMedicoForm;