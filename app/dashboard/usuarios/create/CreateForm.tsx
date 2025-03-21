"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Role, User } from "@/app/types/UsersTypes";
import { Session } from "next-auth";

interface CreateFormProps {
  session: Session | null;
  roles: Role[];
}

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  permissions: string[];
  roles: string[];
}

const CreateForm: React.FC<CreateFormProps> = ({ session, roles }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    permissions: [],
    roles: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");

  console.log("Roles recibidos en CreateForm:", JSON.stringify(roles, null, 2));
  console.log("Sesión en CreateForm:", JSON.stringify(session, null, 2));

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleName = e.target.value;
    console.log("Selected Role Name:", roleName);
    setSelectedRoleName(roleName);

    const selectedRole = roles.find((role) => role.name === roleName);
    if (!selectedRole && roleName) {
      console.warn("Rol no encontrado en la lista de roles:", roleName);
      setError("El rol seleccionado no es válido.");
      return;
    }

    console.log("Selected Role:", JSON.stringify(selectedRole, null, 2));
    setFormData((prev) => ({
      ...prev,
      roles: roleName ? [roleName] : [], // Asegurarse de enviar el nombre del rol
      permissions: selectedRole ? selectedRole.permissions : [],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = session?.user?.token || session?.token || session?.accessToken;
    if (!session || !token) {
      setError("No autenticado. Por favor, inicia sesión nuevamente.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    if (!formData.roles || formData.roles.length === 0) {
      setError("Debe seleccionar al menos un rol.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const userData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      permissions: formData.permissions,
      roles: formData.roles, // Enviar nombres de roles
    };

    try {
      console.log("Datos enviados desde formulario:", JSON.stringify(userData, null, 2));
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error.includes("Sesión inválida")) {
          setError(errorData.error);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }
        throw new Error(errorData.error || "Error al crear el usuario");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Usuario creado con éxito");
      setTimeout(() => {
        router.push("/dashboard/usuarios");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      console.error("Error en handleSubmit:", error);
      console.error("Mensaje de error:", error.message);
      setError(error.message || "No se pudo crear el usuario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Nombre de usuario
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
          Roles
        </label>
        <select
          id="roles"
          name="roles"
          value={selectedRoleName}
          onChange={handleRoleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map((role) => (
            <option key={role.name} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Permisos asociados al rol
        </label>
        {formData.permissions.length > 0 ? (
          <ul className="mt-1 list-disc pl-5 text-gray-600">
            {formData.permissions.map((permission, index) => (
              <li key={index}>{permission}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-gray-600">No hay permisos asociados a este rol.</p>
        )}
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
          onClick={() => router.push("/dashboard/usuarios")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CreateForm;