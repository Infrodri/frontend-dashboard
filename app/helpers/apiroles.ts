// app/helpers/apiroles.ts
import { authHeaders } from "@/app/helpers/utils";
import { Role, RoleResponse } from "../types/RolesTypes";

// Asegurarnos de que BACKEND_URL no tenga un slash adicional al final
const BACKEND_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(
    /\/+$/,
    ""
  ) + "/api/v1";

// Listar todos los roles
export const fetchRoles = async (token: string): Promise<Role[]> => {
  try {
    const url = `${BACKEND_URL}/roles`;
    console.log(`[fetchRoles] Enviando solicitud a: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders(token),
    });

    console.log(`[fetchRoles] Código de estado: ${response.status}`);
    const result = await handleResponse(response);
    return result as Role[];
  } catch (error: any) {
    console.error("[fetchRoles] Error:", error.message);
    throw new Error(error.message || "No se pudo obtener la lista de roles.");
  }
};

// Obtener un rol por ID
export const fetchRoleById = async (
  roleId: string,
  token: string
): Promise<Role> => {
  try {
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
      token: token ? "Token presente" : "Token no presente",
    });
    throw error;
  }
};

// Crear un nuevo rol
export const createRole = async (
  data: { name: string; permissions: string[] },
  token: string
): Promise<RoleResponse> => {
  try {
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
      token: token ? "Token presente" : "Token no presente",
    });
    throw new Error(error.message || "No se pudo crear el rol.");
  }
};

// Actualizar un rol
export const updateRole = async (
  roleId: string,
  data: { name?: string; permissions?: string[] },
  token: string
): Promise<Role> => {
  try {
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
      token: token ? "Token presente" : "Token no presente",
    });
    throw new Error(error.message || "No se pudo actualizar el rol.");
  }
};

// Eliminar un rol
export const deleteRole = async (
  roleId: string,
  token: string
): Promise<void> => {
  try {
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
      token: token ? "Token presente" : "Token no presente",
    });
    throw new Error(error.message || "No se pudo eliminar el rol.");
  }
};
