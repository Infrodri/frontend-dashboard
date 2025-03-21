// app/api/fichas-medicas/[pacienteId]/organos-sentidos/route.ts
import { addOrganosSentidos } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { pacienteId: string } }) {
  try {
    const data = await request.json();
    const result = await addOrganosSentidos(params.pacienteId, data);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al guardar datos de órganos de los sentidos", details: error.message },
      { status: 400 }
    );
  }
}