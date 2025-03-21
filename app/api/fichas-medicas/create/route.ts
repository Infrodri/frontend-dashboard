// app/api/fichas-medicas/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createFicha } from "@/app/helpers/apifichasmedicas";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Datos recibidos en API Route (create):", JSON.stringify(body, null, 2));

    const { pacienteId } = body;
    if (!pacienteId) {
      return NextResponse.json({ error: "El ID del paciente es requerido" }, { status: 400 });
    }

    const response = await createFicha(pacienteId, session.user.token);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error en createFicha API:", error.message);
    return NextResponse.json({ error: error.message || "No se pudo crear la ficha médica" }, { status: 500 });
  }
}