// app/types/medico.ts
export interface Especialidad {
    _id: string;
    nombre: string;
    descripcion?: string;
    estado: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Role {
    _id: string;
    name: string;
    permissions: string[];
  }
  
  export interface Usuario {
    _id: string;
    name: string;
    username: string;
    email: string;
    permissions: string[];
    roles: Role[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Medico {
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