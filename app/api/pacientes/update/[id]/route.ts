// app/api/pacientes/update/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updatePaciente } from "@/app/helpers/apipacientes";
import { Paciente } from "@/app/types/PacientesTypes";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    console.log("Datos recibidos en API Route (update):", JSON.stringify(body, null, 2));

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
      estado: body.estado,
      estadoAtencion: body.estadoAtencion,
    };

    console.log("Datos enviados a updatePaciente:", JSON.stringify(pacienteData, null, 2));
    const response = await updatePaciente(id, pacienteData);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error en updatePaciente API:", error.message);
    return NextResponse.json({ error: error.message || "No se pudo actualizar el paciente" }, { status: 500 });
  }
}