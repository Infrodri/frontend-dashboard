// app/api/fichas-medicas/route.ts
import { createFicha, fetchFichasMedicas } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const fichas = await fetchFichasMedicas();
    return NextResponse.json(fichas, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener fichas médicas", details: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pacienteId } = await request.json();
    const newFicha = await createFicha(pacienteId);
    return NextResponse.json(newFicha, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear ficha médica", details: error.message },
      { status: 400 }
    );
  }
}