// app/helpers/apimedicos.ts

import { auth } from "@/auth";

// Interfaces ajustadas según la respuesta del backend
interface Especialidad {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}
  
interface ApiResponse {
    success?: boolean;
    users?: Usuario[];
    especialidades?: Especialidad[];
    data?: Usuario[] | Especialidad[];
    message?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

interface PaginatedMedicosResponse {
  success?: boolean;
  medicos: Medico[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

interface GenericResponse {
  success?: boolean;
  message: string;
  medico?: Medico;
}

interface SessionHistoryResponse {
  success?: boolean;
  sessions: any[];
  message: string;
}

interface StatsResponse {
  success?: boolean;
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
    consultasPorEspecialidad: { _id: string; nombre: string; total: number }[];
  };
  message: string;
}

// Nuevas interfaces para usuarios y especialidades
interface MedicoResponse {
  success?: boolean;
  medico: Medico;
  message: string;
}

interface UsersResponse {
  success?: boolean;
  users?: Usuario[]; // Hacemos users opcional para manejar diferentes formatos
  data?: Usuario[];  // Añadimos data como alternativa
  message?: string;
}
interface Pagination {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }
interface EspecialidadesResponse {
  success?: boolean;
  especialidades?: Especialidad[];
  data?: Especialidad[];
  message?: string;
}

interface FetchMedicosResponse {
    medicos: Medico[];
    pagination: Pagination;
  }


// Helper para headers de autenticación
const authHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// Función para obtener usuarios
export const fetchUsers = async (): Promise<Usuario[]> => {
    const session = await auth();
    const token = session?.user?.token;
  
    if (!token) {
      throw new Error("No autenticado");
    }
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("fetchUsers status:>> ", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from fetchUsers:", errorData);
        throw new Error(errorData.message || "Failed to fetch users.");
      }
  
      const result = await response.json() as UsersResponse;
      console.log("fetchUsers result:>> ", result); // Depuración
  
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(result)) {
        return result; // La API devuelve un array directamente
      } else if (result.users) {
        return result.users; // La API devuelve { users: [...] }
      } else if (result.data) {
        return result.data; // La API devuelve { data: [...] }
      } else {
        console.warn("Unexpected users response format:", result);
        return []; // Devolver array vacío si el formato no es reconocido
      }
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      return []; // Devolver array vacío en caso de error
    }
  };
  
  // Similarmente para fetchEspecialidades
  export const fetchEspecialidades = async (): Promise<Especialidad[]> => {
    const session = await auth();
    const token = session?.user?.token;
  
    if (!token) {
      throw new Error("No autenticado");
    }
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/especialidades`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("fetchEspecialidades status:>> ", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from fetchEspecialidades:", errorData);
        throw new Error(errorData.message || "Failed to fetch especialidades.");
      }
  
      const result = await response.json() as EspecialidadesResponse;
      console.log("fetchEspecialidades result:>> ", result); // Depuración
  
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(result)) {
        return result; // La API devuelve un array directamente
      } else if (result.especialidades) {
        return result.especialidades; // La API devuelve { especialidades: [...] }
      } else if (result.data) {
        return result.data as Especialidad[]; // La API devuelve { data: [...] }
      } else {
        console.warn("Unexpected especialidades response format:", result);
        return []; // Devolver array vacío si el formato no es reconocido
      }
    } catch (error) {
      console.error("Error in fetchEspecialidades:", error);
      return []; // Devolver array vacío en caso de error
    }
  };



// Función para obtener médicos paginados y filtrados
export const fetchFilteredMedicos = async (
    page: number,
    limit: number,
    query: string
  ): Promise<FetchMedicosResponse> => {
    const session = await auth();
    const token = session?.user?.token;
  
    if (!token) {
      throw new Error("No autenticado");
    }
  
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/medicos?query=${query}&page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("fetchFilteredMedicos status:>> ", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from fetchFilteredMedicos:", errorData);
        throw new Error(errorData.message || "Failed to fetch medicos.");
      }
  
      const result = await response.json();
      console.log("fetchFilteredMedicos result:>> ", result);
  
      return {
        medicos: Array.isArray(result.medicos) ? result.medicos : [],
        pagination: result.pagination || { totalPages: 1, currentPage: 1, totalItems: 0 },
      };
    } catch (error) {
      console.error("Error in fetchFilteredMedicos:", error);
      return { medicos: [], pagination: { totalPages: 1, currentPage: 1, totalItems: 0 } };
    }
  };

// Obtener médico por ID
export const fetchMedicoById = async (id: string): Promise<Medico> => {
    const session = await auth();
    const token = session?.user?.token;
  
    if (!token) {
      throw new Error("No autenticado");
    }
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/medicos/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("fetchMedicoById status:>> ", response.status);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("Error response from fetchMedicoById:", errorData);
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", await response.text());
          throw new Error("El servidor devolvió una respuesta no válida.");
        }
        throw new Error(errorData.message || "Failed to fetch medico data.");
      }
  
      const result = await response.json();
      console.log("fetchMedicoById result:>> ", result);
  
      if (result.medico) {
        return result.medico as Medico;
      } else {
        return result as Medico;
      }
    } catch (error) {
      console.error("Error in fetchMedicoById:", error);
      throw new Error("No se pudo obtener el médico. Por favor, intenta de nuevo más tarde.");
    }
  };

  
// Crear médico
interface MedicoInput {
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
    especialidades: string[]; // Array de _ids
    usuario: string; // Un solo _id
    estaActivo: boolean;
  }
  
  export const createMedico = async (medicoData: MedicoInput): Promise<MedicoResponse> => {
    const session = await auth();
    const token = session?.user?.token;
  
    if (!token) {
      throw new Error("No autenticado");
    }
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/medicos`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(medicoData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create medico.");
      }
  
      const result = (await response.json()) as MedicoResponse;
      return result;
    } catch (error) {
      throw new Error("No se pudo crear el médico. Por favor, intenta de nuevo más tarde.");
    }
  };

// Actualizar médico
export const updateMedico = async (id: string, medicoData: Partial<Medico>): Promise<MedicoResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(medicoData),
    });

    console.log("updateMedico status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from updateMedico:", errorData);
      throw new Error(errorData.message || "Failed to update medico.");
    }

    const result = (await response.json()) as MedicoResponse;
    return result;
  } catch (error) {
    console.error("Error in updateMedico:", error);
    throw new Error("No se pudo actualizar el médico. Por favor, intenta de nuevo más tarde.");
  }
};

// Cambiar estado activo
export const toggleMedicoActiveStatus = async (id: string, estaActivo: boolean): Promise<MedicoResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/${id}/active-status`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ estaActivo }),
    });

    console.log("toggleMedicoActiveStatus status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from toggleMedicoActiveStatus:", errorData);
      throw new Error(errorData.message || "Failed to toggle active status.");
    }

    const result = (await response.json()) as MedicoResponse;
    return result;
  } catch (error) {
    console.error("Error in toggleMedicoActiveStatus:", error);
    throw new Error("No se pudo actualizar el estado activo. Por favor, intenta de nuevo más tarde.");
  }
};

// Eliminación lógica
export const softDeleteMedico = async (id: string): Promise<GenericResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/${id}/soft`, {
      method: "DELETE",
      headers: authHeaders(token),
    });

    console.log("softDeleteMedico status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from softDeleteMedico:", errorData);
      throw new Error(errorData.message || "Failed to soft delete medico.");
    }

    const result = (await response.json()) as GenericResponse;
    return result;
  } catch (error) {
    console.error("Error in softDeleteMedico:", error);
    throw new Error("No se pudo eliminar el médico. Por favor, intenta de nuevo más tarde.");
  }
};

// Eliminación permanente
export const deleteMedico = async (id: string): Promise<GenericResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });

    console.log("deleteMedico status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from deleteMedico:", errorData);
      throw new Error(errorData.message || "Failed to delete medico.");
    }

    const result = (await response.json()) as GenericResponse;
    return result;
  } catch (error) {
    console.error("Error in deleteMedico:", error);
    throw new Error("No se pudo eliminar el médico. Por favor, intenta de nuevo más tarde.");
  }
};

// Obtener historial de sesiones
export const fetchSessionHistory = async (medicoId: string): Promise<SessionHistoryResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/${medicoId}/session-history`, {
      headers: authHeaders(token),
    });

    console.log("fetchSessionHistory status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchSessionHistory:", errorData);
      throw new Error(errorData.message || "Failed to fetch session history.");
    }

    const result = (await response.json()) as SessionHistoryResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchSessionHistory:", error);
    throw new Error("No se pudo obtener el historial de sesiones. Por favor, intenta de nuevo más tarde.");
  }
};

// Obtener estadísticas por especialidad
export const fetchDoctorsBySpecialty = async (): Promise<StatsResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/stats/specialty`, {
      headers: authHeaders(token),
    });

    console.log("fetchDoctorsBySpecialty status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchDoctorsBySpecialty:", errorData);
      throw new Error(errorData.message || "Failed to fetch doctors by specialty.");
    }

    const result = (await response.json()) as StatsResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchDoctorsBySpecialty:", error);
    throw new Error("No se pudieron obtener las estadísticas por especialidad. Por favor, intenta de nuevo más tarde.");
  }
};

// Obtener médicos activos hoy
export const fetchActiveDoctorsToday = async (): Promise<StatsResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/stats/active-today`, {
      headers: authHeaders(token),
    });

    console.log("fetchActiveDoctorsToday status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchActiveDoctorsToday:", errorData);
      throw new Error(errorData.message || "Failed to fetch active doctors today.");
    }

    const result = (await response.json()) as StatsResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchActiveDoctorsToday:", error);
    throw new Error("No se pudieron obtener los médicos activos hoy. Por favor, intenta de nuevo más tarde.");
  }
};

// Obtener total de médicos
export const fetchTotalDoctors = async (): Promise<StatsResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/stats/total`, {
      headers: authHeaders(token),
    });

    console.log("fetchTotalDoctors status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchTotalDoctors:", errorData);
      throw new Error(errorData.message || "Failed to fetch total doctors.");
    }

    const result = (await response.json()) as StatsResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchTotalDoctors:", error);
    throw new Error("No se pudo obtener el total de médicos. Por favor, intenta de nuevo más tarde.");
  }
};

// Obtener médicos con múltiples especialidades
export const fetchDoctorsWithMultipleSpecialties = async (): Promise<PaginatedMedicosResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/multiple-specialties`, {
      headers: authHeaders(token),
    });

    console.log("fetchDoctorsWithMultipleSpecialties status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchDoctorsWithMultipleSpecialties:", errorData);
      throw new Error(errorData.message || "Failed to fetch doctors with multiple specialties.");
    }

    const result = (await response.json()) as PaginatedMedicosResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchDoctorsWithMultipleSpecialties:", error);
    throw new Error("No se pudieron obtener los médicos con múltiples especialidades. Por favor, intenta de nuevo más tarde.");
  }
};

// Obtener médicos por especialidad
export const fetchDoctorsBySpecialtyId = async (especialidadId: string): Promise<PaginatedMedicosResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/by-specialty/${especialidadId}`, {
      headers: authHeaders(token),
    });

    console.log("fetchDoctorsBySpecialtyId status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchDoctorsBySpecialtyId:", errorData);
      throw new Error(errorData.message || "Failed to fetch doctors by specialty ID.");
    }

    const result = (await response.json()) as PaginatedMedicosResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchDoctorsBySpecialtyId:", error);
    throw new Error("No se pudieron obtener los médicos por especialidad. Por favor, intenta de nuevo más tarde.");
  }
};

// Obtener médicos por usuario
export const fetchDoctorsByUserId = async (userId: string): Promise<PaginatedMedicosResponse> => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/medicos/by-user/${userId}`, {
      headers: authHeaders(token),
    });

    console.log("fetchDoctorsByUserId status:>> ", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from fetchDoctorsByUserId:", errorData);
      throw new Error(errorData.message || "Failed to fetch doctors by user ID.");
    }

    const result = (await response.json()) as PaginatedMedicosResponse;
    return result;
  } catch (error) {
    console.error("Error in fetchDoctorsByUserId:", error);
    throw new Error("No se pudieron obtener los médicos por usuario. Por favor, intenta de nuevo más tarde.");
  }
};
