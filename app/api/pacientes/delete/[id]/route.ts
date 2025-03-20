// app/api/pacientes/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deletePaciente } from "@/app/helpers/apipacientes";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deletePaciente(id);
    return NextResponse.json({ message: "Paciente eliminado con éxito" }, { status: 200 });
  } catch (error: any) {
    console.error("Error en deletePaciente API:", error.message);
    return NextResponse.json({ error: error.message || "No se pudo eliminar el paciente" }, { status: 500 });
  }
}