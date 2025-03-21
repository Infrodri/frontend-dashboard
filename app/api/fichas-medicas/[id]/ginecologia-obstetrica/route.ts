// app/api/fichas-medicas/[pacienteId]/ginecologia-obstetrica/route.ts
import { addGinecologiaObstetrica } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { pacienteId: string } }) {
  try {
    const data = await request.json();
    const result = await addGinecologiaObstetrica(params.pacienteId, data);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al añadir registro de ginecología y obstetricia", details: error.message },
      { status: 400 }
    );
  }
}