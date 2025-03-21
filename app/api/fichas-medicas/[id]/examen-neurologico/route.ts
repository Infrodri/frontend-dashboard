// app/api/fichas-medicas/[pacienteId]/examen-neurologico/route.ts
import { addExamenNeurologico } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { pacienteId: string } }) {
  try {
    const data = await request.json();
    const result = await addExamenNeurologico(params.pacienteId, data);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al guardar examen neurológico", details: error.message },
      { status: 400 }
    );
  }
}