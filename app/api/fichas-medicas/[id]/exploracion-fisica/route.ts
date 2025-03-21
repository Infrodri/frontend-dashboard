// app/api/fichas-medicas/[pacienteId]/exploracion-fisica/route.ts
import { addExploracionFisica } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { pacienteId: string } }) {
  try {
    const data = await request.json();
    const result = await addExploracionFisica(params.pacienteId, data);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al guardar exploración física", details: error.message },
      { status: 400 }
    );
  }
}