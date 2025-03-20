// app/types/MedicosTypes.ts
export interface Medico {
    _id: string;
    cedula: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    fechaNacimiento: string;
    lugarNacimiento: string;
    nacionalidad: string;
    ciudadDondeVive: string;
    direccion: string;
    telefono: string;
    celular: string;
    genero: "Masculino" | "Femenino" | "Otro";
    especialidades: string[] | { _id: string; nombre: string }[];
    usuario: string | { _id: string; name: string };
    estado: "Activo" | "Inactivo";
    estaActivo: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Especialidad {
    _id: string;
    nombre: string;
    descripcion: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    permissions: string[];
    roles: string[] | { _id: string; name: string }[];
  }
  
  export interface Pagination {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }