// app/types/models.ts

export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    permissions?: string[];
    roles?: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ActiveDoctor {
    _id: string;
    nombre: string;
    especialidades: string[];
  }
  
  export interface Patient {
    _id: string;
    cedula: string;
    primerNombre: string;
    primerApellido: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    estado: string;
    estadoAtencion: string;
  }
  
  export interface Consultation {
    _id: string;
    paciente: string | Patient;
    medico: string | ActiveDoctor;
    fecha: string;
    estado: "pending" | "completed" | "cancelled";
  }
  
  export interface PaginatedResponse<T> {
    success: boolean;
    data: {
      data: T[];
      total: number;
      page: number;
      totalPages: number;
    };
  }
  
  export interface PageCountResponse {
    success: boolean;
    totalPages: number;
  }
  
  export interface DashboardStats {
    success: boolean;
    data: {
      totalPacientes: number;
      totalConsultasHoy: number;
      consultasPendientes: number;
      totalMedicosActivos: number;
      totalRecetasHoy: number;
      totalExamenesHoy: number;
      consultasPorMedico: any[]; // Array vacío o datos específicos
    };
  }
  
  export interface RevenueData {
    totalRevenue: number;
    activeDoctors: number;
  }