// app/types/RolesTypes.ts
export interface Roles {
  _id: string;
  name: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}