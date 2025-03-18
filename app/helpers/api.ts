// app/helpers/api.ts
import { auth } from "@/auth";

// Definir tipo para los datos de consultas por mes
interface ConsultaPorMes {
  month: string;
  total: number;
}

// Definir tipo para los datos de médicos
interface Especialidad {
  id: string;
  nombre: string;
}

interface Medico {
  _id: string;
  primerNombre: string;
  primerApellido: string;
  especialidades: Especialidad[];
}
interface StatsResponse {
  success: boolean;
  data: {
    totalPacientes: number;
    totalConsultas: number;
    totalMedicos: number;
    consultasHoy: number;
    consultasPendientes: number;
    consultasUrgentes: number;
    medicosActivos: number;
    consultasPorEstado: {
      Pendiente: number;
      Concluida: number;
      Derivada: number;
    };
    consultasPorEspecialidad: { id: string; nombre: string; total: number }[];
  };
  message: string;
}
// Definir tipo esperado por LatestInvoices (hipotético, ajustado a la captura)
interface Invoice {
  id: string;
  name: string;
  email: string; // Usaremos las especialidades aquí, ya que no tenemos email
  amount: number; // No tenemos monto, lo dejaremos como 0 por ahora
  image_url: string; // Añadiremos una imagen aleatoria
}
interface ConsultaPorEspecialidad {
  id: string;
  nombre: string;
  total: number;
}
// Definir tipo esperado por RevenueChart
interface Revenue {
  _id: string;
  month: string;
  revenue: number;
}
const authHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

//----------------------------------------------
// Definir el tipo de datos de paginacion
interface Especialidad {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

interface Usuario {
  _id: string;
  name: string;
  username: string;
  email: string;
  permissions: string[];
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface Medico {
  _id: string;
  cedula: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento?: string;
  lugarNacimiento?: string;
  nacionalidad?: string;
  ciudadDondeVive?: string;
  direccion?: string;
  telefono?: string;
  celular?: string;
  genero?: string;
  especialidades: Especialidad[];
  usuario: Usuario;
  estado: string;
  estaActivo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MedicosResponse {
  success?: boolean;
  medicos: Medico[];
  message: string;
}

interface MedicoResponse {
  success?: boolean;
  medico: Medico;
  message: string;
}
//----------------------------------------------
export const fetchCardData = async (): Promise<{
  totalPacientes: string;
  totalConsultas: string;
  pacientesPendientes: string;
  pacientesAtendidos: string;
  pacientesDerivados: string;
  consultasUrgentes: string;
}> => {
  const session = await auth();
  const token = session?.user?.token;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/dashboard/stats`, {
      headers: authHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchCardData:", errorData);
      throw new Error(errorData.message || "Failed to fetch stats");
    }

    const data = await response.json() as StatsResponse;
    console.log("fetchCardData response:>> ", data);

    const totalPacientes = Number(data.data.totalPacientes ?? 0) || 0;
    const totalConsultas = Number(data.data.totalConsultas ?? 0) || 0;
    const consultasPorEstado = data.data.consultasPorEstado || {};
    const consultasUrgentes = Number(data.data.consultasUrgentes ?? 0) || 0;

    const pacientesPendientes = String(consultasPorEstado["Pendiente"] ?? "0");
    const pacientesAtendidos = String(consultasPorEstado["Concluida"] ?? "0");
    const pacientesDerivados = String(consultasPorEstado["Derivada"] ?? "0");

    return {
      totalPacientes: String(totalPacientes),
      totalConsultas: String(totalConsultas),
      pacientesPendientes,
      pacientesAtendidos,
      pacientesDerivados,
      consultasUrgentes: String(consultasUrgentes),
    };
  } catch (error) {
    console.error("Error in fetchCardData:", error);
    throw new Error("No se pudieron obtener los datos del dashboard. Por favor, intenta de nuevo más tarde.");
  }
};




export const fetchConsultasPorMes = async (year?: number, month?: number): Promise<ConsultaPorEspecialidad[]> => {
  const session = await auth();
  const token = session?.user?.token;

  const now = new Date();
  const defaultYear = year || now.getFullYear();
  const defaultMonth = month || now.getMonth() + 1; // getMonth() es 0-based

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/dashboard/consultas-por-mes-especialidad?year=${defaultYear}&month=${defaultMonth}`,
      {
        headers: authHeaders(token),
      }
    );

    console.log("Response status:", response.status);

    // Leer el cuerpo de la respuesta solo una vez
    const data = await response.json();
    console.log("fetchConsultasPorMes raw response:", data);

    if (!response.ok) {
      console.error("Error response from backend:", data);
      throw new Error(data.message || "Failed to fetch consultations by specialty");
    }

    const consultas: ConsultaPorEspecialidad[] = data.data || [];
    console.log("Consultas after extracting data.data:", consultas);

    return consultas;
  } catch (error) {
    console.error("Error in fetchConsultasPorMes:", error);
    throw new Error("No se pudieron obtener las consultas por especialidad. Por favor, intenta de nuevo más tarde.");
  }
};

export const fetchMedicosList = async (): Promise<Invoice[]> => {
  const session = await auth();
  const token = session?.user?.token;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/dashboard/medicos`, {
      headers: authHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from backend:", errorData);
      throw new Error(errorData.message || "Failed to fetch medicos list");
    }

    const data = await response.json();
    console.log("fetchMedicosList response:", data);

    const medicos: Medico[] = data.data || [];

    // Transformar los datos al formato esperado por LatestInvoices
    const transformedData = medicos.map((medico: Medico) => ({
      id: medico._id,
      name: `${medico.primerNombre} ${medico.primerApellido}`,
      email: medico.especialidades.length
        ? medico.especialidades.map((esp) => esp.nombre).join(", ")
        : "Sin especialidad",
      amount: 0, // No tenemos monto, lo dejamos en 0
      image_url: `https://picsum.photos/seed/${medico._id}/32/32`, // Imagen aleatoria basada en el ID
    }));

    return transformedData;
  } catch (error) {
    console.error("Error in fetchMedicosList:", error);
    throw new Error("No se pudieron obtener los médicos. Por favor, intenta de nuevo más tarde.");
  }
};
export const fetchFilteredMedicos = async (
  query: string = "",
  currentPage: number = 1
): Promise<MedicosResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/medicos`,
      {
        headers: authHeaders(token),
      }
    );

    console.log("fetchFilteredMedicos status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchFilteredMedicos:", errorData);
      throw new Error(errorData.message || "Failed to fetch medicos data.");
    }

    const result = await response.json() as MedicosResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchFilteredMedicos:", error);
    throw new Error("No se pudieron obtener los datos de médicos. Por favor, intenta de nuevo más tarde.");
  }
};

export const fetchMedicoById = async (id: string): Promise<MedicoResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/medicos/${id}`,
      {
        headers: authHeaders(token),
      }
    );

    console.log("fetchMedicoById status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchMedicoById:", errorData);
      throw new Error(errorData.message || "Failed to fetch medico data.");
    }

    const result = await response.json() as MedicoResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchMedicoById:", error);
    throw new Error("No se pudo obtener el médico. Por favor, intenta de nuevo más tarde.");
  }
};