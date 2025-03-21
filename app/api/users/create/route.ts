import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createUser } from "@/app/helpers/apiusers";
import { User } from "@/app/types/UsersTypes";
import { fetchRoles } from "@/app/helpers/apiusers";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.token) {
    console.error("No autenticado: token no encontrado en la sesión:", JSON.stringify(session, null, 2));
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const token = session.user.token;
  console.log("Token obtenido en API Route:", token);

  try {
    const body = await req.json();
    console.log("Datos recibidos en API Route:", JSON.stringify(body, null, 2));

    // Validar campos obligatorios
    if (!body.name || !body.username || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (name, username, email, password)" },
        { status: 400 }
      );
    }

    // Validar roles
    if (!body.roles || !Array.isArray(body.roles) || body.roles.length === 0) {
      return NextResponse.json(
        { error: "Debe proporcionar al menos un rol" },
        { status: 400 }
      );
    }

    // Obtener los roles disponibles
    let roles;
    try {
      roles = await fetchRoles(token);
    } catch (error: any) {
      console.error("Error al obtener roles:", error);
      return NextResponse.json(
        { error: "No se pudieron cargar los roles: " + (error.message || "Error desconocido") },
        { status: 500 }
      );
    }
    console.log("Roles disponibles:", JSON.stringify(roles, null, 2));

    if (!roles || roles.length === 0) {
      return NextResponse.json(
        { error: "No hay roles disponibles en la base de datos. Por favor, crea un rol primero." },
        { status: 400 }
      );
    }

    // Mapear los nombres de roles a sus _id
    const roleNames = body.roles || [];
    console.log("Nombres de roles recibidos:", JSON.stringify(roleNames, null, 2));

    // Verificar si roleNames contiene _id en lugar de nombres
    const roleIds = roleNames.map((roleName: string) => {
      // Si roleName parece un _id (por ejemplo, 24 caracteres hexadecimales), buscar por _id
      const isIdFormat = /^[0-9a-fA-F]{24}$/.test(roleName);
      let role;
      if (isIdFormat) {
        console.log(`El valor "${roleName}" parece un _id, buscando por _id...`);
        role = roles.find((r) => r._id === roleName);
      } else {
        console.log(`El valor "${roleName}" parece un nombre, buscando por nombre...`);
        role = roles.find((r) => r.name === roleName);
      }

      if (!role) {
        throw new Error(`Rol no encontrado: ${roleName}`);
      }
      console.log(`Mapeando rol "${roleName}" a _id: ${role._id}`);
      return role._id;
    }).filter(Boolean);

    if (roleIds.length !== roleNames.length) {
      throw new Error("Uno o más roles no fueron encontrados.");
    }

    const userData: Partial<User> = {
      name: body.name,
      username: body.username,
      email: body.email,
      password: body.password,
      permissions: body.permissions || [],
      roles: roleIds, // Usar los _id de los roles
    };

    console.log("Datos enviados a createUser:", JSON.stringify(userData, null, 2));
    const response = await createUser(userData, token);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error en createUser API:", error);
    console.error("Mensaje de error:", error.message);
    return NextResponse.json(
      { error: error.message || "No se pudo crear el usuario" },
      { status: 500 }
    );
  }
}