// app/api/fichas-medicas/[id]/route.ts
import { fetchFichaMedicaById } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ficha = await fetchFichaMedicaById(params.id);
    if (!ficha) {
      return NextResponse.json({ error: "Ficha médica no encontrada" }, { status: 404 });
    }
    return NextResponse.json(ficha, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener la ficha médica", details: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedFicha = await updateFicha(params.id, data);
    return NextResponse.json(updatedFicha, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar ficha médica", details: error.message },
      { status: 400 }
    );
  }
}