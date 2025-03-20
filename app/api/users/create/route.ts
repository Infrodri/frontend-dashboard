// app/api/users/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createUser } from "@/app/helpers/apiusers";
import { User } from "@/app/types/UsersTypes";
import { fetchRoles } from "@/app/helpers/apiusers";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Datos recibidos en API Route:", JSON.stringify(body, null, 2));

    // Obtener los roles disponibles
    const roles = await fetchRoles();
    console.log("Roles disponibles:", JSON.stringify(roles, null, 2));

    // Mapear los nombres de roles a sus _id
    const roleNames = body.roles || [];
    const roleIds = roleNames
      .map((roleName: string) => {
        const role = roles.find((r) => r.name === roleName);
        if (!role) {
          throw new Error(`Rol no encontrado: ${roleName}`);
        }
        return role._id;
      })
      .filter(Boolean);

    if (roleIds.length !== roleNames.length) {
      throw new Error("Uno o más roles no fueron encontrados.");
    }

    const userData: Partial<User> = {
      name: body.name,
      username: body.username,
      email: body.email,
      password: body.password,
      permissions: body.permissions || [],
      roles: body.roles || [], // Enviar los _id de los roles
    };

    console.log("Datos enviados a createUser:", JSON.stringify(userData, null, 2));
    const response = await createUser(userData);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error en createUser API:", error.message);
    return NextResponse.json({ error: error.message || "No se pudo crear el usuario" }, { status: 500 });
  }
}