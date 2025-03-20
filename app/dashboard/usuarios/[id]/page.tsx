"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "@/app/helpers/apiusers";
import { User } from "@/app/types/UsersTypes";

interface CreateFormProps {
  token: string;
}

const CreateForm: React.FC<CreateFormProps> = ({ token }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    username: "",
    email: "",
    password: "",
    permissions: [],
    roles: [],
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

    try {
      const userData: Partial<User> = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        permissions: formData.permissions,
        roles: formData.roles, // Ajustar según backend (IDs o nombres)
      };
      const newUser = await createUser(userData);
      setSuccessMessage("Usuario creado con éxito");
      setTimeout(() => {
        router.push("/dashboard/usuarios");
        router.refresh();
      }, 1000);
    } catch (error: any) {
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
          Username
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
          Email
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
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="permissions" className="block text-sm font-medium text-gray-700">
          Permisos
        </label>
        <input
          type="text"
          id="permissions"
          name="permissions"
          value={formData.permissions.join(", ")}
          onChange={(e) => setFormData({ ...formData, permissions: e.target.value.split(", ") })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
          Roles (IDs)
        </label>
        <input
          type="text"
          id="roles"
          name="roles"
          value={formData.roles.join(", ")}
          onChange={(e) => setFormData({ ...formData, roles: e.target.value.split(", ") })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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