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
// export const fetchFilteredInvoices = async (query?: string, currentPage?: number) => {
//   const session = await auth();
//   try {
//     const fetchFilteredInvoices = await fetch(`${process.env.BACKEND_URL}/invoices/paginate?q=${query}&page=${currentPage}`, {
//       headers: authHeaders(session?.user?.token)
//     });
//     console.log("fetchFilteredInvoices :>> ", fetchFilteredInvoices.status);
//     const resultfetchFilteredInvoices = await fetchFilteredInvoices.json();

//     return resultfetchFilteredInvoices;
//   } catch (error) {
//     console.log("error :>> ", error);
//     throw new Error("Failed to fetch resultfetchFilteredInvoices data.");
//   }
// };

// export const fetchInvoicesPages = async (query: string) => {
//   const session = await auth();
//   try {
//     const getInvoicesPages = await fetch(`${process.env.BACKEND_URL}/invoices/page-count?q=${query}`, {
//       headers: authHeaders(session?.user?.token)
//     });
//     const resultGetInvoicesPages = await getInvoicesPages.json();

//     return resultGetInvoicesPages;
//   } catch (error) {
//     console.log("error :>> ", error);
//     throw new Error("Failed to fetch resultGetInvoicesPages data.");
//   }
// };

// export const fetchCustomers = async () => {
//   const session = await auth();
//   try {
//     const getCustomers = await fetch(`${process.env.BACKEND_URL}/customer`, {
//       headers: authHeaders(session?.user?.token)
//     });
//     const resultGetCustomers = await getCustomers.json();

//     return resultGetCustomers;
//   } catch (error) {
//     console.log("error :>> ", error);
//     throw new Error("Failed to fetch customers data.");
//   }
// };

// export const fetchInvoiceById = async (id: string) => {
//   const session = await auth();
//   try {
//     const getInvoiceById = await fetch(`${process.env.BACKEND_URL}/invoice/${id}`, {
//       headers: authHeaders(session?.user?.token)
//     });
//     console.log("getInvoiceById :>> ", getInvoiceById.status);
//     if (getInvoiceById.status === 404) return null;
//     if (getInvoiceById.status !== 200) throw new Error("Error fetching invoice!!!");
//     const resultInvoiceById = await getInvoiceById.json();

//     return resultInvoiceById;
//   } catch (error) {
//     console.log("error :>> ", error);
//     throw new Error("Failed to fetch resultInvoiceById data.");
//   }
// };