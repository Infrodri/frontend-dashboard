// app/helpers/apifichasmedicas.ts
import { auth } from "@/auth";
import {
  FichaMedica,
  PaginatedFichasResponse,
  FichaResponse,
  AntecedentesPersonales,
  AntecedentesFamiliares,
  OperacionQuirurgica,
  GinecologiaObstetrica,
  Adiccion,
  ExploracionFisica,
  ExamenNeurologico,
  OrganosSentidos,
  ConsultaMedica,
  Paciente,
} from "@/app/types/FichasMedicasTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api/v1";
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
  const data = await response.json();
  console.log("Datos crudos del backend:", JSON.stringify(data, null, 2));
  return data;
};

// 1. GET /api/v1/fichas - Listar todas las fichas médicas
export const fetchFichasMedicas = async (
  page: number = 1,
  limit: number = 2,
  estado?: string
): Promise<PaginatedFichasResponse> => {
  try {
    const token = await getAuthToken();
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(estado && { estado }),
    }).toString();
    const url = `${BACKEND_URL}/fichas?${query}`;
    console.log("URL de la solicitud (fetchFichasMedicas):", url);
    const response = await fetch(url, { headers: authHeaders(token) });
    const result = await handleResponse(response);
    return result as PaginatedFichasResponse;
  } catch (error: any) {
    console.error("Error en fetchFichasMedicas:", error);
    return { fichas: [], total: 0, page: 1, limit: 2, totalPages: 1 };
  }
};
// app/helpers/apifichasmedicas.ts
export const fetchFichaMedicaById = async (fichaId: string, token: string): Promise<FichaMedica> => {
  try {
    const url = `${BACKEND_URL}/fichas/${fichaId}`;
    console.log(`[fetchFichaMedicaById] Enviando solicitud a: ${url}`);
    console.log(`[fetchFichaMedicaById] Token: ${token ? "Presente" : "No presente"}`);

    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders(token),
    });

    console.log(`[fetchFichaMedicaById] Código de estado: ${response.status}`);
    console.log(`[fetchFichaMedicaById] Respuesta recibida:`, response);

    const result = await handleResponse(response);
    return result as FichaMedica;
  } catch (error: any) {
    console.error("[fetchFichaMedicaById] Error:", {
      message: error.message,
      fichaId,
      token: token ? "Token presente" : "Token no presente",
    });
    throw error;
  }
};
// 2. POST /api/v1/fichas - Crear una ficha médica
// app/helpers/apifichasmedicas.ts (fragmento relevante)
export const createFicha = async (pacienteId: string, token: string): Promise<FichaResponse> => {
  try {
    if (!pacienteId) {
      throw new Error("El ID del paciente es requerido.");
    }

    const url = `${BACKEND_URL}/fichas`;
    console.log("URL de la solicitud (createFicha):", url);
    console.log("Datos enviados a createFicha:", JSON.stringify({ paciente: pacienteId }, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ paciente: pacienteId }),
    });

    const result = await handleResponse(response);
    console.log("Respuesta del backend (createFicha):", JSON.stringify(result, null, 2));

    if (!result.ficha) {
      throw new Error("La respuesta del backend no contiene una ficha médica válida.");
    }

    return result as FichaResponse;
  } catch (error: any) {
    console.error("Error en createFicha:", error.message);
    throw new Error(error.message || "No se pudo crear la ficha médica.");
  }
};

// 3. GET /api/v1/fichas/:pacienteId - Obtener ficha por paciente
export const fetchFichaMedicaByPacienteId = async (pacienteId: string, token: string): Promise<FichaMedica | null> => {
  try {
    const url = `${BACKEND_URL}/fichas/${pacienteId}`;
    console.log("URL de la solicitud (fetchFichaMedicaByPacienteId):", url);
    const response = await fetch(url, { headers: authHeaders(token) });
    const result = await handleResponse(response);
    return result as FichaMedica;
  } catch (error: any) {
    console.error("Error en fetchFichaMedicaByPacienteId:", error);
    if (error.message.includes("404")) return null;
    throw new Error("No se pudo obtener la ficha médica.");
  }
};

// 4. PUT /api/v1/fichas/:id - Actualizar una ficha médica
// app/helpers/apifichasmedicas.ts
// ... (otras funciones como fetchFichasMedicas, fetchFichaMedicaById, createFicha, addAntecedentesPersonales, etc.)

export const updateFichaMedica = async (
  fichaId: string,
  data: { paciente: string; estado: "Activo" | "Inactivo" },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/fichas/${fichaId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Ficha médica actualizada con éxito" };
  } catch (error: any) {
    console.error("Error en updateFichaMedica:", error.message);
    throw new Error(error.message || "No se pudo actualizar la ficha médica.");
  }
};
// 5. DELETE /api/v1/fichas/:id/soft - Desactivar una ficha médica
export const softDeleteFicha = async (id: string, token: string): Promise<FichaResponse> => {
  try {
    const url = `${BACKEND_URL}/fichas/${id}/soft`;
    console.log("URL de la solicitud (softDeleteFicha):", url);
    const response = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    const result = await handleResponse(response);
    return result as FichaResponse;
  } catch (error: any) {
    console.error("Error en softDeleteFicha:", error);
    throw new Error("No se pudo desactivar la ficha médica.");
  }
};

// 6. POST /api/v1/fichas/:pacienteId/antecedentes-personales - Añadir antecedentes personales
export const addAntecedentesPersonales = async (
  pacienteId: string,
  data: { enfermedades?: string[]; alergias?: string[] },
  token: string
): Promise<FichaResponse> => {
  try {
    const url = `${BACKEND_URL}/fichas/${pacienteId}/antecedentes-personales`;
    console.log("URL de la solicitud (addAntecedentesPersonales):", url);
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return result as FichaResponse;
  } catch (error: any) {
    console.error("Error en addAntecedentesPersonales:", error);
    throw new Error("No se pudo añadir los antecedentes personales.");
  }
};

// 7. POST /api/v1/fichas/:pacienteId/antecedentes-familiares - Añadir antecedentes familiares
export const addAntecedentesFamiliares = async (
  pacienteId: string,
  data: { enfermedades: string[]; parentesco?: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/pacientes/${pacienteId}/antecedentes-familiares`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Antecedentes familiares añadidos con éxito" };
  } catch (error: any) {
    console.error("Error en addAntecedentesFamiliares:", error.message);
    throw new Error(error.message || "No se pudo añadir los antecedentes familiares.");
  }
};

// 8. POST /api/v1/fichas/:pacienteId/operaciones-quirurgicas - Añadir operación quirúrgica
export const addOperacionQuirurgica = async (
  pacienteId: string,
  data: { tipoOperacionQuirurgica: string; fecha: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/pacientes/${pacienteId}/operaciones-quirurgicas`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Operación quirúrgica añadida con éxito" };
  } catch (error: any) {
    console.error("Error en addOperacionQuirurgica:", error.message);
    throw new Error(error.message || "No se pudo añadir la operación quirúrgica.");
  }
};

// 9. POST /api/v1/fichas/:pacienteId/ginecologia-obstetrica - Añadir ginecología y obstetricia
// app/helpers/apifichasmedicas.ts
export const addGinecologiaObstetrica = async (
  pacienteId: string,
  data: { tipoObstetricoGinecologico: string; fecha: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/pacientes/${pacienteId}/ginecologia-obstetrica`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Registro de ginecología/obstetricia añadido con éxito" };
  } catch (error: any) {
    console.error("Error en addGinecologiaObstetrica:", error.message);
    throw new Error(error.message || "No se pudo añadir el registro de ginecología/obstetricia.");
  }
};

// 10. POST /api/v1/fichas/:pacienteId/adicciones - Añadir adicción
// app/helpers/apifichasmedicas.ts
export const addAdiccion = async (
  pacienteId: string,
  data: { tipoAdiccion: string; frecuencia?: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/pacientes/${pacienteId}/adicciones`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Adicción añadida con éxito" };
  } catch (error: any) {
    console.error("Error en addAdiccion:", error.message);
    throw new Error(error.message || "No se pudo añadir la adicción.");
  }
};
// 11. POST /api/v1/fichas/:pacienteId/exploracion-fisica - Añadir exploración física
// app/helpers/apifichasmedicas.ts
export const addExploracionFisica = async (
  pacienteId: string,
  data: { peso?: number; altura?: number; presionArterial?: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/pacientes/${pacienteId}/exploracion-fisica`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Exploración física añadida con éxito" };
  } catch (error: any) {
    console.error("Error en addExploracionFisica:", error.message);
    throw new Error(error.message || "No se pudo añadir la exploración física.");
  }
};

// 12. POST /api/v1/fichas/:pacienteId/examen-neurologico - Añadir examen neurológico
// app/helpers/apifichasmedicas.ts
export const addExamenNeurologico = async (
  pacienteId: string,
  data: { reflejos?: string; coordinacion?: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/pacientes/${pacienteId}/examen-neurologico`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Examen neurológico añadido con éxito" };
  } catch (error: any) {
    console.error("Error en addExamenNeurologico:", error.message);
    throw new Error(error.message || "No se pudo añadir el examen neurológico.");
  }
};

// 13. POST /api/v1/fichas/:pacienteId/organos-sentidos - Añadir órganos de los sentidos
// app/helpers/apifichasmedicas.ts
// ... (otras funciones como fetchFichasMedicas, fetchFichaMedicaById, createFicha, addAntecedentesPersonales, etc.)

export const addOrganosSentidos = async (
  pacienteId: string,
  data: { vision?: string; audicion?: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/pacientes/${pacienteId}/organos-sentidos`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Órganos de los sentidos añadidos con éxito" };
  } catch (error: any) {
    console.error("Error en addOrganosSentidos:", error.message);
    throw new Error(error.message || "No se pudo añadir los órganos de los sentidos.");
  }
};

// 14. POST /api/v1/fichas/:id/consulta-medica - Añadir consulta médica
// app/helpers/apifichasmedicas.ts
export const addConsultaMedica = async (
  fichaId: string,
  data: { motivo: string; diagnostico: string; fecha: string },
  token: string
): Promise<{ message: string }> => {
  try {
    const url = `${BACKEND_URL}/fichas/${fichaId}/consultas-medicas`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await handleResponse(response);
    return { message: result.message || "Consulta médica añadida con éxito" };
  } catch (error: any) {
    console.error("Error en addConsultaMedica:", error.message);
    throw new Error(error.message || "No se pudo añadir la consulta médica.");
  }
};

// 15. GET /api/v1/fichas/:id/reporte - Generar reporte de ficha médica
export const generateReporte = async (fichaId: string, token: string): Promise<FichaMedica> => {
  try {
    const url = `${BACKEND_URL}/fichas/${fichaId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders(token),
    });

    const result = await handleResponse(response);
    return result as FichaMedica;
  } catch (error: any) {
    console.error("Error en generateReporte:", error.message);
    throw new Error(error.message || "No se pudo generar el reporte de la ficha médica.");
  }
};

export const fetchPacientes = async (token: string): Promise<Paciente[]> => {
  try {
    const url = `${BACKEND_URL}/pacientes`;
    const response = await fetch(url, {
      method: "GET",
      headers: authHeaders(token),
    });

    const result = await handleResponse(response);
    return result as Paciente[];
  } catch (error: any) {
    console.error("Error en fetchPacientes:", error.message);
    throw new Error(error.message || "No se pudo obtener la lista de pacientes.");
  }
};
