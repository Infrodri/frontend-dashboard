// app/api/pacientes/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPaciente } from "@/app/helpers/apipacientes";
import { Paciente } from "@/app/types/PacientesTypes";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Datos recibidos en API Route:", JSON.stringify(body, null, 2));

    const pacienteData: Partial<Paciente> = {
      cedula: body.cedula,
      primerNombre: body.primerNombre,
      segundoNombre: body.segundoNombre,
      primerApellido: body.primerApellido,
      segundoApellido: body.segundoApellido,
      fechaNacimiento: body.fechaNacimiento,
      direccion: body.direccion,
      telefono: body.telefono,
      celular: body.celular,
      genero: body.genero,
    };

    console.log("Datos enviados a createPaciente:", JSON.stringify(pacienteData, null, 2));
    const response = await createPaciente(pacienteData);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error en createPaciente API:", error.message);
    return NextResponse.json({ error: error.message || "No se pudo crear el paciente" }, { status: 500 });
  }
}