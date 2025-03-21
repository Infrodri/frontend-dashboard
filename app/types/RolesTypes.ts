// app/types/RolesTypes.ts
export interface Role {
    _id: string;
    name: string;
    permissions: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface RoleResponse {
    _id: string;
    name: string;
    permissions: string[];
    createdAt?: string;
    updatedAt?: string;
  }

  export interface Roles {
    _id: string;
    name: string;
    permissions: string[];
    createdAt?: string;
    updatedAt?: string;
  }