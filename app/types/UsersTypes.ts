export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password?: string; // Opcional, no se muestra en detalles
  permissions: string[];
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}