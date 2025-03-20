// app/helpers/apiusers.ts
import { auth } from "@/auth";
import { User, Role } from "@/app/types/UsersTypes";

interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface FetchUsersResponse {
  users: User[];
  pagination?: Pagination;
}

interface UserResponse {
  success?: boolean;
  user: User;
  message?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("La variable NEXT_PUBLIC_BACKEND_URL no está configurada. Revisa tu archivo .env.");
}

const getAuthToken = async () => {
  const session = await auth();
  console.log("Sesión en getAuthToken:", session);
  const token = session?.user?.token;
  if (!token) throw new Error("No autenticado");
  return token;
};

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Error HTTP: ${response.status} ${response.statusText}`,
    }));
    throw new Error(errorData.message || "Error en la solicitud.");
  }
  return response.json();
};

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const token = await getAuthToken();
    console.log("Token para fetchRoles:", token);
    const url = `${BACKEND_URL}/roles`;
    console.log("URL de fetchRoles:", url);
    const response = await fetch(url, { headers: authHeaders(token) });
    console.log("Respuesta de fetchRoles (estado):", response.status, response.statusText);
    console.log("Encabezados de la respuesta:", JSON.stringify([...response.headers], null, 2));

    if (!response.ok) {
      const responseText = await response.text();
      console.log("Cuerpo de la respuesta (texto):", responseText);
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("No se pudo parsear la respuesta como JSON:", parseError);
        throw new Error(`Error ${response.status}: ${response.statusText} - Respuesta no es JSON: ${responseText.slice(0, 200)}`);
      }
      console.error("Error del backend (fetchRoles):", JSON.stringify(errorData, null, 2));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Datos de fetchRoles:", JSON.stringify(data, null, 2));
    const roles = Array.isArray(data) ? data : data.roles || [];
    if (!roles.length) {
      throw new Error("No se encontraron roles disponibles en el backend.");
    }
    return roles;
  } catch (error: any) {
    console.error("Error en fetchRoles:", error);
    console.error("Mensaje de error:", error.message);
    throw error;
  }
};

export const fetchUsers = async (page = 1, limit = 10, query = ""): Promise<FetchUsersResponse> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/users?query=${query}&page=${page}&limit=${limit}`, {
      headers: authHeaders(token),
    });
    const result = await handleResponse(response);
    return {
      users: Array.isArray(result) ? result : result.users || [],
      pagination: result.pagination || { totalPages: 1, currentPage: 1, totalItems: 0 },
    };
  } catch (error) {
    console.error("Error en fetchUsers:", error);
    return { users: [], pagination: { totalPages: 1, currentPage: 1, totalItems: 0 } };
  }
};

export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/users/${id}`, { headers: authHeaders(token) });
    return handleResponse(response);
  } catch (error) {
    console.error("Error en fetchUserById:", error);
    throw new Error("No se pudo obtener el usuario.");
  }
};

export const createUser = async (userData: Partial<User>, token: string): Promise<UserResponse> => {
  try {
    const url = `${BACKEND_URL}/users`;
    console.log("URL de la solicitud (createUser):", url);
    console.log("Encabezados de la solicitud:", authHeaders(token));
    console.log("Datos enviados (createUser):", JSON.stringify(userData, null, 2));
    console.log("Método de la solicitud:", "POST");

    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log("Cuerpo de la respuesta (texto):", responseText);
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("No se pudo parsear la respuesta como JSON:", parseError);
        throw new Error(`Error ${response.status}: ${response.statusText} - Respuesta no es JSON: ${responseText.slice(0, 200)}`);
      }
      console.error("Error del backend (createUser):", JSON.stringify(errorData, null, 2));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Respuesta del backend (createUser):", JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error("Error completo en createUser:", error);
    console.error("Error en createUser (mensaje):", error.message);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw new Error("No se pudo actualizar el usuario.");
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(response);
  } catch (error) {
    console.error("Error en deleteUser:", error);
    throw new Error("No se pudo eliminar el usuario.");
  }
};