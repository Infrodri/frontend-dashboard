// app/api/fichas-medicas/[pacienteId]/consulta-medica/route.ts
import { addConsultaMedica } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { pacienteId: string } }) {
  try {
    const data = await request.json();
    const result = await addConsultaMedica(params.pacienteId, data);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al añadir consulta médica", details: error.message },
      { status: 400 }
    );
  }
}