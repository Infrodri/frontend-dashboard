// app/api/fichas-medicas/[id]/reporte/route.ts
import { generateReporte } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reporte = await generateReporte(params.id);
    if (!reporte) {
      return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
    }
    return NextResponse.json(reporte, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al generar el reporte", details: error.message },
      { status: 400 }
    );
  }
}