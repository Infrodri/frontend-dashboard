// app/types/FichasMedicasTypes.ts
export interface Paciente {
    _id: string;
    primerNombre: string;
    primerApellido: string;
    cedula: string;
    edad?: number;
  }
  
  export interface AntecedentesPersonales {
    _id: string;
    paciente: string;
    enfermedades?: string[];
    alergias?: string[];
    estado: "Activo" | "Inactivo";
  }
  
  export interface AntecedentesFamiliares {
    _id: string;
    paciente: string;
    enfermedades?: string[];
    parentesco?: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface OperacionQuirurgica {
    _id: string;
    paciente: string;
    tipoOperacionQuirurgica: string;
    fecha: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface GinecologiaObstetrica {
    _id: string;
    paciente: string;
    tipoObstetricoGinecologico: string;
    fecha: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface Adiccion {
    _id: string;
    paciente: string;
    tipoAdiccion: string;
    frecuencia?: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface ExploracionFisica {
    _id: string;
    paciente: string;
    peso?: number;
    altura?: number;
    presionArterial?: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface ExamenNeurologico {
    _id: string;
    paciente: string;
    reflejos?: string;
    coordinacion?: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface OrganosSentidos {
    _id: string;
    paciente: string;
    vision?: string;
    audicion?: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface ConsultaMedica {
    _id: string;
    paciente: string;
    motivo?: string;
    diagnostico?: string;
    fecha: string;
    estado: "Activo" | "Inactivo";
  }
  
  export interface FichaMedica {
    _id: string;
    paciente: Paciente | string;
    antecedentesPersonales?: AntecedentesPersonales | null;
    antecedentesFamiliares?: AntecedentesFamiliares | null;
    operacionesQuirurgicas?: OperacionQuirurgica[];
    ginecologiaObstetrica?: GinecologiaObstetrica[];
    adicciones?: Adiccion[];
    exploracionFisica?: ExploracionFisica | null;
    examenNeurologico?: ExamenNeurologico | null;
    organosSentidos?: OrganosSentidos | null;
    consultasMedicas?: ConsultaMedica[];
    estado: "Activo" | "Inactivo";
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface PaginatedFichasResponse {
    fichas: FichaMedica[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface FichaResponse {
    success?: boolean;
    ficha?: FichaMedica;
    antecedentes?: AntecedentesPersonales | AntecedentesFamiliares;
    operacion?: OperacionQuirurgica;
    ginecologia?: GinecologiaObstetrica;
    adiccion?: Adiccion;
    exploracion?: ExploracionFisica;
    examen?: ExamenNeurologico;
    organos?: OrganosSentidos;
    consulta?: ConsultaMedica;
    message?: string;
  }