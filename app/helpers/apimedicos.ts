// app/helpers/apimedicos.ts
import { auth } from "@/auth";
import { Medico, Pagination, Especialidad, User } from "@/app/types/MedicosTypes";

interface FetchMedicosResponse {
  medicos: Medico[];
  pagination: Pagination;
}

interface MedicoResponse {
  success?: boolean;
  medico: Medico;
  message?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("La variable NEXT_PUBLIC_BACKEND_URL no está configurada. Revisa tu archivo .env.");
}

const getAuthToken = async () => {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    console.error("No se encontró un token en la sesión. Asegúrate de estar autenticado.");
    throw new Error("No autenticado");
  }
  console.log("Token de autenticación:", token);
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
    console.error("Error en la respuesta del backend:", errorData);
    throw new Error(errorData.message || `Error HTTP: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Ajustar fetchEspecialidades para manejar la respuesta del backend
export const fetchEspecialidades = async (): Promise<Especialidad[]> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/especialidades`;
    console.log("URL de la solicitud (fetchEspecialidades):", url);
    console.log("Encabezados de la solicitud:", authHeaders(token));
    const response = await fetch(url, { headers: authHeaders(token) });
    const result = await handleResponse(response);
    console.log("Respuesta del backend (fetchEspecialidades):", JSON.stringify(result, null, 2));

    // El backend devuelve { especialidades: basicInfoList, message: "..." }
    const especialidades = result.especialidades || [];
    return especialidades.map((esp: any) => ({
      _id: esp._id,
      nombre: esp.nombre,
      descripcion: esp.descripcion || "",
      estado: esp.estado || "Activo",
    }));
  } catch (error) {
    console.error("Error en fetchEspecialidades:", error);
    return [];
  }
};

// Ajustar fetchUsersList para manejar la respuesta del backend
export const fetchUsersList = async (): Promise<User[]> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/users?page=1&limit=100`;
    console.log("URL de la solicitud (fetchUsersList):", url);
    console.log("Encabezados de la solicitud:", authHeaders(token));
    const response = await fetch(url, { headers: authHeaders(token) });
    const result = await handleResponse(response);
    console.log("Respuesta del backend (fetchUsersList):", JSON.stringify(result, null, 2));

    // Asegurarnos de que el resultado sea un array
    const users = Array.isArray(result) ? result : result.users || [];
    // Usar users.map en lugar de result.map
    return users.map((user: any) => ({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      permissions: user.permissions || [],
      roles: user.roles || [],
    }));
  } catch (error) {
    console.error("Error en fetchUsersList:", error);
    return [];
  }
};

// Resto de las funciones (sin cambios)
export const fetchMedicos = async (page = 1, limit = 5, query = ""): Promise<FetchMedicosResponse> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/medicos/paginated?page=${page}&limit=${limit}&query=${encodeURIComponent(query)}`;
    console.log("URL de la solicitud (fetchMedicos):", url);
    const response = await fetch(url, { headers: authHeaders(token) });
    const result = await handleResponse(response);
    console.log("Respuesta del backend (fetchMedicos):", result);

    return {
      medicos: result.medicos || [],
      pagination: result.pagination || { totalPages: 1, currentPage: 1, totalItems: 0 },
    };
  } catch (error) {
    console.error("Error en fetchMedicos:", error);
    return { medicos: [], pagination: { totalPages: 1, currentPage: 1, totalItems: 0 } };
  }
};

export const fetchMedicoById = async (id: string): Promise<Medico> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/medicos/${id}`, { headers: authHeaders(token) });
    const result = await handleResponse(response);
    console.log("Respuesta del backend (fetchMedicoById):", result);
    return result.medico || result;
  } catch (error) {
    console.error("Error en fetchMedicoById:", error);
    throw new Error("No se pudo obtener el médico.");
  }
};

export const createMedico = async (medicoData: Omit<Medico, "_id" | "createdAt" | "updatedAt">, token: string): Promise<MedicoResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/medicos`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(medicoData),
    });
    const result = await handleResponse(response);
    console.log("Respuesta del backend (createMedico):", result);
    return result;
  } catch (error) {
    console.error("Error en createMedico:", error);
    throw new Error("No se pudo crear el médico.");
  }
};

export const updateMedico = async (id: string, medicoData: Partial<Medico>, token: string): Promise<MedicoResponse> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/medicos/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(medicoData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error en update medicos:", error);
    throw new Error("No se pudo actualizar el medicos.");
  }
};

export const toggleMedicoActiveStatus = async (id: string, estaActivo: boolean, token: string): Promise<MedicoResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/medicos/${id}/active-status`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ estaActivo }),
    });
    const result = await handleResponse(response);
    console.log("Respuesta del backend (toggleMedicoActiveStatus):", result);
    return result;
  } catch (error) {
    console.error("Error en toggleMedicoActiveStatus:", error);
    throw new Error("No se pudo actualizar el estado activo del médico.");
  }
};

export const deleteMedico = async (id: string, token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/medicos/${id}/soft`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    const result = await handleResponse(response);
    console.log("Respuesta del backend (deleteMedico):", result);
    return result;
  } catch (error) {
    console.error("Error en deleteMedico:", error);
    throw new Error("No se pudo eliminar el médico.");
  }
};