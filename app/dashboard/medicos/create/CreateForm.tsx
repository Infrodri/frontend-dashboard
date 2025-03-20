// app/dashboard/medicos/create/CreateForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Especialidad, User } from "@/app/types/MedicosTypes";
import { Session } from "next-auth";

interface CreateFormProps {
  session: Session | null;
  especialidades: Especialidad[];
  users: User[];
}

interface FormData {
  cedula: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  nacionalidad: string;
  ciudadDondeVive: string;
  direccion: string;
  telefono: string;
  celular: string;
  genero: "Masculino" | "Femenino" | "Otro";
  especialidades: string; // Cambiado de string[] a string
  usuario: string;
}

const CreateForm: React.FC<CreateFormProps> = ({ session, especialidades, users }) => {
  const router = useRouter();

  console.log("Especialidades recibidas en CreateForm:", JSON.stringify(especialidades, null, 2));
  console.log("Usuarios recibidos en CreateForm:", JSON.stringify(users, null, 2));

  const [formData, setFormData] = useState<FormData>({
    cedula: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    nacionalidad: "",
    ciudadDondeVive: "",
    direccion: "",
    telefono: "",
    celular: "",
    genero: "Otro",
    especialidades: "", // Cambiado de [] a ""
    usuario: "",
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
    if (!session || !session.user || !session.user.token) {
      setError("No autenticado");
      return;
    }

    if (!formData.especialidades) {
      setError("Debe seleccionar una especialidad.");
      return;
    }

    if (!formData.usuario) {
      setError("Debe seleccionar un usuario.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const medicoData = {
      cedula: formData.cedula,
      primerNombre: formData.primerNombre,
      segundoNombre: formData.segundoNombre,
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido,
      fechaNacimiento: formData.fechaNacimiento,
      lugarNacimiento: formData.lugarNacimiento,
      nacionalidad: formData.nacionalidad,
      ciudadDondeVive: formData.ciudadDondeVive,
      direccion: formData.direccion,
      telefono: formData.telefono,
      celular: formData.celular,
      genero: formData.genero,
      especialidades: [formData.especialidades], // Enviar como array con un solo elemento
      usuario: formData.usuario,
      estado: "Activo",
      estaActivo: false,
    };

    try {
      console.log("Datos enviados desde formulario:", JSON.stringify(medicoData, null, 2));
      const response = await fetch("/api/medicos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el médico");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Médico creado con éxito");
      setTimeout(() => {
        router.push("/dashboard/medicos");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      console.error("Error en handleSubmit:", error.message);
      setError(error.message || "No se pudo crear el médico.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
            Cédula *
          </label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="lugarNacimiento" className="block text-sm font-medium text-gray-700">
            Lugar de Nacimiento *
          </label>
          <input
            type="text"
            id="lugarNacimiento"
            name="lugarNacimiento"
            value={formData.lugarNacimiento}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="nacionalidad" className="block text-sm font-medium text-gray-700">
            Nacionalidad *
          </label>
          <input
            type="text"
            id="nacionalidad"
            name="nacionalidad"
            value={formData.nacionalidad}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="ciudadDondeVive" className="block text-sm font-medium text-gray-700">
            Ciudad de Residencia *
          </label>
          <input
            type="text"
            id="ciudadDondeVive"
            name="ciudadDondeVive"
            value={formData.ciudadDondeVive}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label htmlFor="especialidades" className="block text-sm font-medium text-gray-700">
            Especialidad *
          </label>
          <select
            id="especialidades"
            name="especialidades"
            value={formData.especialidades}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione una especialidad</option>
            {especialidades.length > 0 ? (
              especialidades.map((especialidad) => (
                <option key={especialidad._id} value={especialidad._id}>
                  {especialidad.nombre}
                </option>
              ))
            ) : (
              <option value="">No hay especialidades disponibles</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
            Usuario *
          </label>
          <select
            id="usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un usuario</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option value="">No hay usuarios disponibles</option>
            )}
          </select>
        </div>
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
          {isSubmitting ? "Creando..." : "Crear"}
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

export default CreateForm;