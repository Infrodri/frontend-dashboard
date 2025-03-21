// app/api/fichas-medicas/[id]/soft/route.ts
import { softDeleteFicha } from "@/app/helpers/apifichasmedicas";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await softDeleteFicha(params.id);
    return NextResponse.json({ message: "Ficha médica desactivada con éxito" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al desactivar ficha médica", details: error.message },
      { status: 400 }
    );
  }
}