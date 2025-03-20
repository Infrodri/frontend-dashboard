import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateMedico } from "@/app/helpers/apimedicos";
import { Medico } from "@/app/types/MedicosTypes";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Obtener la sesión
  const session = await auth();
  console.log("Sesión completa en API Route (update):", JSON.stringify(session, null, 2));

  // Obtener el token de diferentes lugares
  const token = session?.user?.token || session?.token || session?.accessToken;
  if (!token) {
    console.error("No se encontró el token en la sesión:", JSON.stringify(session, null, 2));
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // Extraer el cuerpo de la solicitud
    const body = await req.json();
    console.log("Datos recibidos en API Route (update):", JSON.stringify(body, null, 2));

    // Validar campos obligatorios
    if (!body.cedula || !body.primerNombre || !body.primerApellido || !body.especialidades || !body.usuario) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (cedula, primerNombre, primerApellido, especialidades, usuario)" },
        { status: 400 }
      );
    }

    // Construir el objeto medicoData
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
      especialidades: Array.isArray(body.especialidades) ? body.especialidades : [body.especialidades],
      usuario: body.usuario,
      estaActivo: body.estaActivo, // Incluir estaActivo
      estado: body.estado, // Incluir estado
    };

    console.log("Datos enviados a updateMedico:", JSON.stringify(medicoData, null, 2));
    const response = await updateMedico(params.id, medicoData, token);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error en updateMedico API:", error);
    console.error("Mensaje de error:", error.message);
    return NextResponse.json(
      { error: error.message || "No se pudo actualizar el médico. Verifica la conexión con el backend." },
      { status: 500 }
    );
  }
}