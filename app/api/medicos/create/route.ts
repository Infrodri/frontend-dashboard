// app/api/medicos/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMedico } from "@/app/helpers/apimedicos";
import { Medico } from "@/app/types/MedicosTypes";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Datos recibidos en API Route (create):", JSON.stringify(body, null, 2));

    const medicoData: Partial<Medico> = {
      cedula: body.cedula,
      primerNombre: body.primerNombre,
      segundoNombre: body.segundoNombre,
      primerApellido: body.primerApellido,
      segundoApellido: body.segundoApellido,
      fechaNacimiento: body.fechaNacimiento,
      lugarNacimiento: body.lugarNacimiento,
      nacionalidad: body.nacionalidad,
      ciudadDondeVive: body.ciudadDondeVive,
      direccion: body.direccion,
      telefono: body.telefono,
      celular: body.celular,
      genero: body.genero,
      especialidades: Array.isArray(body.especialidades) ? body.especialidades : [body.especialidades], // Asegurar que sea un array
      usuario: body.usuario,
      estado: body.estado || "Activo",
      estaActivo: body.estaActivo || false,
    };

    console.log("Datos enviados a createMedico:", JSON.stringify(medicoData, null, 2));
    const response = await createMedico(medicoData, session.user.token);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error en createMedico API:", error.message);
    return NextResponse.json({ error: error.message || "No se pudo crear el médico" }, { status: 500 });
  }
}