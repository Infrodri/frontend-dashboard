// app/dashboard/medicos/[id]/EditMedicoForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Medico } from "@/app/types/medico";

interface Usuario {
  _id: string;
  name: string;
  email: string;
  username?: string;
  permissions?: string[];
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface EditMedicoFormProps {
  medico: Medico;
  token: string;
}

const EditMedicoForm: React.FC<EditMedicoFormProps> = ({ medico, token }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    _id: medico._id,
    cedula: medico.cedula,
    primerNombre: medico.primerNombre,
    segundoNombre: medico.segundoNombre || "",
    primerApellido: medico.primerApellido,
    segundoApellido: medico.segundoApellido || "",
    fechaNacimiento: medico.fechaNacimiento || "",
    lugarNacimiento: medico.lugarNacimiento || "",
    nacionalidad: medico.nacionalidad || "",
    ciudadDondeVive: medico.ciudadDondeVive || "",
    direccion: medico.direccion || "",
    telefono: medico.telefono || "",
    celular: medico.celular || "",
    genero: medico.genero || "",
    especialidades: medico.especialidades.map((esp) => esp._id), // Solo necesitamos los _id
    usuario: medico.usuario._id, // Inicializamos con el _id del usuario actual
    estaActivo: medico.estaActivo,
  });
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch para obtener la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar la lista de usuarios.");
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err.message || "Error al cargar los usuarios.");
      }
    };

    fetchUsers();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estaActivo" ? value === "true" : value, // Convertimos el valor de estaActivo a booleano
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicos/${medico._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
          especialidades: formData.especialidades, // Ya es un array de _id
          usuario: formData.usuario, // Enviamos el _id del usuario
          estaActivo: formData.estaActivo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el médico.");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Médico actualizado con éxito");
      setTimeout(() => {
        router.push("/dashboard/medicos");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      setError(error.message || "No se pudo actualizar el médico.");
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
          required
        />
      </div>
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
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          id="fechaNacimiento"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="lugarNacimiento" className="block text-sm font-medium text-gray-700">
          Lugar de Nacimiento
        </label>
        <input
          type="text"
          id="lugarNacimiento"
          name="lugarNacimiento"
          value={formData.lugarNacimiento}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="nacionalidad" className="block text-sm font-medium text-gray-700">
          Nacionalidad
        </label>
        <input
          type="text"
          id="nacionalidad"
          name="nacionalidad"
          value={formData.nacionalidad}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="ciudadDondeVive" className="block text-sm font-medium text-gray-700">
          Ciudad donde vive
        </label>
        <input
          type="text"
          id="ciudadDondeVive"
          name="ciudadDondeVive"
          value={formData.ciudadDondeVive}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
          Celular
        </label>
        <input
          type="text"
          id="celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
          Género
        </label>
        <select
          id="genero"
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccione género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
          Usuario
        </label>
        <select
          id="usuario"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione un usuario</option>
          {users && users.length > 0 ? (
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No hay usuarios disponibles
            </option>
          )}
        </select>
      </div>
      <div>
        <label htmlFor="estaActivo" className="block text-sm font-medium text-gray-700">
          Estado Activo
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
      <div>
        <label htmlFor="especialidades" className="block text-sm font-medium text-gray-700">
          Especialidades
        </label>
        <select
          id="especialidades"
          name="especialidades"
          value={formData.especialidades[0] || ""}
          onChange={(e) => {
            const value = e.target.value;
            setFormData((prev) => ({
              ...prev,
              especialidades: value ? [value] : [], // Solo permitimos una especialidad por ahora
            }));
          }}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccione una especialidad</option>
          {medico.especialidades.map((esp) => (
            <option key={esp._id} value={esp._id}>
              {esp.nombre}
            </option>
          ))}
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