"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Medico, Especialidad, User } from "@/app/types/MedicosTypes";
import { Session } from "next-auth";

interface EditFormProps {
  medico: Medico;
  token: string;
  especialidades: Especialidad[];
  users: User[];
  session: Session | null;
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
  especialidades: string;
  usuario: string;
  estaActivo: boolean;
}

const EditForm: React.FC<EditFormProps> = ({ medico, token, especialidades, users, session }) => {
  const router = useRouter();

  const initialEspecialidad =
    Array.isArray(medico.especialidades) && medico.especialidades.length > 0
      ? typeof medico.especialidades[0] === "string"
        ? medico.especialidades[0]
        : (medico.especialidades[0] as any)._id || ""
      : "";
  const initialUsuario = String(typeof medico.usuario === "string" ? medico.usuario : medico.usuario?._id || "");
  console.log("Valor de initialUsuario:", initialUsuario);
  console.log("Usuarios recibidos en EditForm:", JSON.stringify(users, null, 2));
  console.log("Opciones de usuario generadas:", JSON.stringify(users.map(user => ({ id: user._id, name: user.name })), null, 2));
  console.log("Especialidades recibidas en EditForm:", JSON.stringify(especialidades, null, 2));

  const [formData, setFormData] = useState<FormData>({
    cedula: medico.cedula || "",
    primerNombre: medico.primerNombre || "",
    segundoNombre: medico.segundoNombre || "",
    primerApellido: medico.primerApellido || "",
    segundoApellido: medico.segundoApellido || "",
    fechaNacimiento: medico.fechaNacimiento ? new Date(medico.fechaNacimiento).toISOString().split("T")[0] : "",
    lugarNacimiento: medico.lugarNacimiento || "",
    nacionalidad: medico.nacionalidad || "",
    ciudadDondeVive: medico.ciudadDondeVive || "",
    direccion: medico.direccion || "",
    telefono: medico.telefono || "",
    celular: medico.celular || "",
    genero: medico.genero || "Otro",
    especialidades: initialEspecialidad,
    usuario: initialUsuario,
    estaActivo: medico.estaActivo || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialUsuario && users.some(user => user._id === initialUsuario)) {
      setFormData((prev) => ({
        ...prev,
        usuario: initialUsuario,
      }));
    } else {
      console.warn("Usuario no encontrado en la lista de usuarios disponibles:", initialUsuario);
      setFormData((prev) => ({
        ...prev,
        usuario: "",
      }));
    }
  }, [initialUsuario, users]);

  console.log("FormData inicial en EditForm:", JSON.stringify(formData, null, 2));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`Campo ${name} actualizado a:`, value);
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      estaActivo: !prev.estaActivo,
    }));
    console.log("Estado activo actualizado a:", !formData.estaActivo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validar la sesión y el token
    const sessionToken = session?.user?.token || session?.token || session?.accessToken;
    if (!session || !sessionToken) {
      setError("No autenticado");
      setIsSubmitting(false);
      return;
    }

    if (!formData.especialidades) {
      setError("Debe seleccionar una especialidad.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.usuario) {
      setError("Debe seleccionar un usuario.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedData = {
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
        especialidades: [formData.especialidades],
        usuario: formData.usuario,
        estaActivo: formData.estaActivo,
        estado: medico.estado,
      };

      console.log("Datos enviados a la API Route:", JSON.stringify(updatedData, null, 2));

      // Enviar la solicitud a la API Route
      const response = await fetch(`/api/medicos/update/${medico._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo actualizar el médico");
      }

      setSuccessMessage(result.message || "Médico actualizado con éxito");
      setTimeout(() => {
        router.push(`/dashboard/medicos`);
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Error al actualizar médico:", error);
      setError(error.message || "No se pudo actualizar el médico.");
      setIsSubmitting(false);
    }
  };

  console.log("Valor de formData.usuario antes de renderizar el select:", formData.usuario);

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
        <div>
          <label htmlFor="estaActivo" className="block text-sm font-medium text-gray-700">
            Estado Activo
          </label>
          <button
            type="button"
            onClick={handleToggleActive}
            className={`mt-1 px-4 py-2 rounded-lg ${
              formData.estaActivo ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {formData.estaActivo ? "Activo" : "Inactivo"}
          </button>
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

export default EditForm;