// app/helpers/apipacientes.ts
import { auth } from "@/auth";
import { Paciente, Pagination } from "@/app/types/PacientesTypes";

interface FetchPacientesResponse {
  pacientes: Paciente[];
  pagination: Pagination;
}

interface PacienteResponse {
  success?: boolean;
  paciente: Paciente;
  message?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("La variable NEXT_PUBLIC_BACKEND_URL no está configurada. Revisa tu archivo .env.");
}

const getAuthToken = async () => {
  const session = await auth();
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
    throw new Error(errorData.message || `Error HTTP: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const fetchPacientes = async (page = 1, limit = 5, query = ""): Promise<FetchPacientesResponse> => {
  try {
    const token = await getAuthToken();
    const url = `${BACKEND_URL}/pacientes?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    console.log("URL de la solicitud:", url);
    const response = await fetch(url, {
      headers: authHeaders(token),
    });
    const result = await handleResponse(response);
    console.log("Respuesta del backend:", result);

    // Si el backend no proporciona paginación, la calculamos manualmente
    const pacientes = Array.isArray(result) ? result : result.pacientes || [];
    const totalItems = pacientes.length; // Esto debería ser el total real de pacientes (necesita backend)
    const totalPages = Math.ceil(totalItems / limit); // Ajustar según el total real

    return {
      pacientes: pacientes.slice((page - 1) * limit, page * limit), // Paginación manual en el frontend
      pagination: result.pagination || {
        totalPages: totalPages > 0 ? totalPages : 1,
        currentPage: page,
        totalItems: totalItems,
      },
    };
  } catch (error) {
    console.error("Error en fetchPacientes:", error);
    return { pacientes: [], pagination: { totalPages: 1, currentPage: 1, totalItems: 0 } };
  }
};

export const fetchPacienteById = async (id: string): Promise<Paciente> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/pacientes/${id}`, { headers: authHeaders(token) });
    const result = await handleResponse(response);
    return result.paciente || result;
  } catch (error) {
    console.error("Error en fetchPacienteById:", error);
    throw new Error("No se pudo obtener el paciente.");
  }
};



export const createPaciente = async (pacienteData: Partial<Paciente>): Promise<PacienteResponse> => {
  try {
    const token = await getAuthToken();
    console.log("Enviando datos a createPaciente:", JSON.stringify(pacienteData, null, 2));
    const response = await fetch(`${BACKEND_URL}/pacientes`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(pacienteData),
    });
    return handleResponse(response);
  } catch (error: any) {
    console.error("Error en createPaciente:", error.message);
    throw new Error(error.message || "No se pudo crear el paciente.");
  }
};

export const updatePaciente = async (id: string, pacienteData: Partial<Paciente>): Promise<Paciente> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/pacientes/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(pacienteData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error en updatePaciente:", error);
    throw new Error("No se pudo actualizar el paciente.");
  }
};

export const deletePaciente = async (id: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/pacientes/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(response);
  } catch (error) {
    console.error("Error en deletePaciente:", error);
    throw new Error("No se pudo eliminar el paciente.");
  }
};