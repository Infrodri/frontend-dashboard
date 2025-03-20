"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Role } from "@/app/types/UsersTypes";
import { auth } from "@/auth";
import { useParams } from "next/navigation";

interface EditFormProps {
  roles: Role[];
}

const EditForm: React.FC<EditFormProps> = ({ roles }) => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [formData, setFormData] = useState<User>({
    _id: userId,
    name: "",
    username: "",
    email: "",
    password: "", // Opcional para no cambiar si está vacío
    permissions: [],
    roles: [],
    createdAt: "",
    updatedAt: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await auth();
        if (!session?.user?.token) {
          setError("No autenticado");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:4000/api/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Usuario no encontrado");
        }

        const data = await response.json();
        setFormData(data); // Prefill con datos existentes
      } catch (err: any) {
        setError(err.message || "Error al cargar el usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoleId = e.target.value;
    const selectedRole = roles.find((role) => role._id === selectedRoleId);
    setFormData((prev) => ({
      ...prev,
      roles: selectedRole ? [selectedRole.name] : [],
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

    if (!formData.roles || formData.roles.length === 0) {
      setError("Debe seleccionar un rol.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const session = await auth();
      if (!session?.user?.token) {
        setError("No autenticado");
        return;
      }

      const response = await fetch(`/api/users/${userId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password || undefined, // Solo enviar si se modifica
          permissions: formData.permissions,
          roles: formData.roles,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el usuario");
      }

      setSuccessMessage("Usuario actualizado con éxito");
      setTimeout(() => {
        router.push(`/dashboard/usuarios/${userId}/detail`);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
          Contraseña (dejar en blanco para no cambiar)
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
          Roles
        </label>
        <select
          id="roles"
          name="roles"
          value={formData.roles[0] || ""}
          onChange={handleRoleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
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
          {isSubmitting ? "Actualizando..." : "Actualizar"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/usuarios/${userId}/detail`)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditForm;