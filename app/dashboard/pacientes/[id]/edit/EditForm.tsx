// app/dashboard/pacientes/[id]/edit/EditForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Paciente } from "@/app/types/PacientesTypes";

interface EditFormProps {
  paciente: Paciente;
  token: string;
}

const EditForm: React.FC<EditFormProps> = ({ paciente, token }) => {
  const router = useRouter();

  // Depuración: Mostrar los datos del paciente recibidos
  useEffect(() => {
    console.log("Datos del paciente recibidos:", paciente);
  }, [paciente]);

  // Inicializar el estado con los datos del paciente
  const [formData, setFormData] = useState({
    cedula: paciente.cedula || "",
    primerNombre: paciente.primerNombre || "",
    segundoNombre: paciente.segundoNombre || "",
    primerApellido: paciente.primerApellido || "",
    segundoApellido: paciente.segundoApellido || "",
    fechaNacimiento: paciente.fechaNacimiento
      ? new Date(paciente.fechaNacimiento).toISOString().split("T")[0]
      : "",
    direccion: paciente.direccion || "",
    telefono: paciente.telefono || "",
    celular: paciente.celular || "",
    genero: paciente.genero || "Masculino",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    // Validar que los campos requeridos no estén vacíos
    if (
      !formData.primerNombre ||
      !formData.primerApellido ||
      !formData.fechaNacimiento ||
      !formData.direccion ||
      !formData.telefono ||
      !formData.celular ||
      !formData.genero
    ) {
      setError("Por favor, completa todos los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Datos enviados al backend:", formData); // Depuración
      const response = await fetch(`/api/pacientes/update/${paciente._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Respuesta del backend:", result); // Depuración

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el paciente.");
      }

      setSuccessMessage(result.message || "Paciente actualizado con éxito");
      setTimeout(() => {
        router.push(`/dashboard/pacientes`);
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Error al actualizar el paciente:", error);
      setError(error.message || "No se pudo actualizar el paciente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
          Cédula
        </label>
        <input
          type="text"
          id="cedula"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="primerNombre" className="block text-sm font-medium text-gray-700">
          Primer Nombre *
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
        <label htmlFor="segundoNombre" className="block text-sm font-medium text-gray-700">
          Segundo Nombre
        </label>
        <input
          type="text"
          id="segundoNombre"
          name="segundoNombre"
          value={formData.segundoNombre}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="primerApellido" className="block text-sm font-medium text-gray-700">
          Primer Apellido *
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
        <label htmlFor="segundoApellido" className="block text-sm font-medium text-gray-700">
          Segundo Apellido
        </label>
        <input
          type="text"
          id="segundoApellido"
          name="segundoApellido"
          value={formData.segundoApellido}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
          Fecha de Nacimiento *
        </label>
        <input
          type="date"
          id="fechaNacimiento"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
          Dirección *
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
          Teléfono *
        </label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
          Celular *
        </label>
        <input
          type="text"
          id="celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
          Género *
        </label>
        <select
          id="genero"
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
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

export default EditForm;