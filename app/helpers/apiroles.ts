// app/helpers/apiroles.ts
import { auth } from "@/auth";
import { Role, RoleResponse } from "../types/RolesTypes";

// Definir el tipo de paginación
interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface FetchRolesResponse {
  roles: Role[];
  pagination: Pagination;
}

// Definir la URL base del backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("La variable NEXT_PUBLIC_BACKEND_URL no está configurada. Revisa tu archivo .env.");
}

// Obtener el token de autenticación
const getAuthToken = async () => {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) throw new Error("No autenticado");
  return token;
};

// Definir los encabezados de autenticación
const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Manejar las respuestas del backend
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Error HTTP: ${response.status} ${response.statusText}`,
    }));
    throw new Error(errorData.message || `Error HTTP: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Listar todos los roles con paginación y búsqueda
export const fetchRoles = async (page = 1, limit = 5, query = ""): Promise<FetchRolesResponse> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/roles?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    console.log(`[fetchRoles] Enviando solicitud a: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders(token),
    });

    console.log(`[fetchRoles] Código de estado: ${response.status}`);
    const result = await handleResponse(response);

    // Si el backend no proporciona paginación, la calculamos manualmente
    const roles: Role[] = Array.isArray(result) ? result : result.roles || [];
    const totalItems = roles.length; // Esto debería ser el total real de roles (necesita backend)
    const totalPages = Math.ceil(totalItems / limit); // Ajustar según el total real

    return {
      roles: roles.slice((page - 1) * limit, page * limit), // Paginación manual en el frontend
      pagination: result.pagination || {
        totalPages: totalPages > 0 ? totalPages : 1,
        currentPage: page,
        totalItems: totalItems,
      },
    };
  } catch (error: any) {
    console.error("[fetchRoles] Error:", error.message);
    return { roles: [], pagination: { totalPages: 1, currentPage: 1, totalItems: 0 } };
  }
};

// Obtener un rol por ID
export const fetchRoleById = async (roleId: string): Promise<Role> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/roles/${roleId}`;
    console.log(`[fetchRoleById] Enviando solicitud a: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders(token),
    });

    console.log(`[fetchRoleById] Código de estado: ${response.status}`);
    const result = await handleResponse(response);
    return result as Role;
  } catch (error: any) {
    console.error("[fetchRoleById] Error:", {
      message: error.message,
      roleId,
      token: "Token presente",
    });
    throw new Error(error.message || "No se pudo obtener el rol.");
  }
};

// Crear un nuevo rol
export const createRole = async (data: { name: string; permissions: string[] }): Promise<RoleResponse> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/roles`;
    console.log(`[createRole] Enviando solicitud a: ${url}`);
    console.log(`[createRole] Datos enviados:`, data);
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    console.log(`[createRole] Código de estado: ${response.status}`);
    const result = await handleResponse(response);
    return result as RoleResponse;
  } catch (error: any) {
    console.error("[createRole] Error:", {
      message: error.message,
      data,
      token: "Token presente",
    });
    throw new Error(error.message || "No se pudo crear el rol.");
  }
};

// Actualizar un rol
export const updateRole = async (
  roleId: string,
  data: { name?: string; permissions?: string[] }
): Promise<Role> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/roles/${roleId}`;
    console.log(`[updateRole] Enviando solicitud a: ${url}`);
    console.log(`[updateRole] Datos enviados:`, data);
    const response = await fetch(url, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    console.log(`[updateRole] Código de estado: ${response.status}`);
    const result = await handleResponse(response);
    return result as Role;
  } catch (error: any) {
    console.error("[updateRole] Error:", {
      message: error.message,
      roleId,
      data,
      token: "Token presente",
    });
    throw new Error(error.message || "No se pudo actualizar el rol.");
  }
};

// Eliminar un rol
export const deleteRole = async (roleId: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/roles/${roleId}`;
    console.log(`[deleteRole] Enviando solicitud a: ${url}`);
    const response = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(token),
    });

    console.log(`[deleteRole] Código de estado: ${response.status}`);
    await handleResponse(response);
  } catch (error: any) {
    console.error("[deleteRole] Error:", {
      message: error.message,
      roleId,
      token: "Token presente",
    });
    throw new Error(error.message || "No se pudo eliminar el rol.");
  }
};