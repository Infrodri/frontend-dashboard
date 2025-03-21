// app/api/fichas-medicas/[pacienteId]/antecedentes-familiares/route.ts
import { addAntecedentesFamiliares } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { pacienteId: string } }) {
  try {
    const data = await request.json();
    const result = await addAntecedentesFamiliares(params.pacienteId, data);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al añadir antecedentes familiares", details: error.message },
      { status: 400 }
    );
  }
}