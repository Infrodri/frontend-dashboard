// app/types/PacientesTypes.ts
export interface Paciente {
    _id: string;
    cedula?: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    fechaNacimiento: string; // ISO 8601 string
    direccion: string;
    telefono: string;
    celular: string;
    genero: "Masculino" | "Femenino" | "Otro";
    estado: "Activo" | "Inactivo";
    estadoAtencion: "Pendiente" | "Atendido" | "Derivado";
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Pagination {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }