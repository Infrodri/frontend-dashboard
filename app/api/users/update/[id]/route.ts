import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUser } from "@/app/helpers/apiusers";
import { User } from "@/app/types/UsersTypes";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Datos recibidos en API Route (update):", JSON.stringify(body, null, 2));

    const userData: Partial<User> = {
      name: body.name,
      username: body.username,
      email: body.email,
      permissions: body.permissions || [],
      roles: body.roles || [],
    };

    console.log("Datos enviados a updateUser:", JSON.stringify(userData, null, 2));
    const response = await updateUser(params.id, userData);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error en updateUser API:", error.message);
    return NextResponse.json({ error: error.message || "No se pudo actualizar el usuario" }, { status: 500 });
  }
}