import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // Obtener la sesión
  const session = await auth();
  console.log("Sesión completa en API Route (toggle):", JSON.stringify(session, null, 2));

  // Obtener el token de diferentes lugares
  const token = session?.user?.token || session?.token || session?.accessToken;
  if (!token) {
    console.error("No se encontró el token en la sesión:", JSON.stringify(session, null, 2));
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // Extraer el cuerpo de la solicitud
    const body = await req.json();
    console.log("Datos recibidos en API Route (toggle):", JSON.stringify(body, null, 2));

    // Validar el campo estaActivo
    if (typeof body.estaActivo !== "boolean") {
      return NextResponse.json(
        { error: "El campo 'estaActivo' debe ser un booleano" },
        { status: 400 }
      );
    }

    // Hacer la solicitud al backend externo usando el endpoint correcto
    const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api/v1").replace(/\/+$/, "");
    const url = `${BACKEND_URL}/medicos/${params.id}/active-status`; // Corregir el endpoint
    console.log("URL de la solicitud (API Route toggle):", url);
    console.log("Encabezados de la solicitud:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log("Datos enviados (API Route toggle):", JSON.stringify({ estaActivo: body.estaActivo }, null, 2));

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estaActivo: body.estaActivo }),
    });

    console.log("Estado de la respuesta del backend:", response.status);
    console.log("Encabezados de la respuesta del backend:", JSON.stringify([...response.headers], null, 2));

    // Intentar obtener el cuerpo de la respuesta como texto primero
    const responseText = await response.text();
    console.log("Cuerpo de la respuesta del backend (texto):", responseText);

    if (!response.ok) {
      // Intentar parsear el cuerpo como JSON
      try {
        const errorData = JSON.parse(responseText);
        console.error("Error del backend (API Route toggle):", JSON.stringify(errorData, null, 2));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      } catch (parseError) {
        console.error("No se pudo parsear la respuesta como JSON:", parseError);
        throw new Error(`Error ${response.status}: ${response.statusText} - Respuesta no es JSON: ${responseText.slice(0, 200)}`);
      }
    }

    // Si la respuesta es exitosa, parsear como JSON
    const result = JSON.parse(responseText);
    console.log("Respuesta del backend (API Route toggle):", JSON.stringify(result, null, 2));
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error en API Route (toggle):", error);
    console.error("Mensaje de error:", error.message);
    return NextResponse.json(
      { error: error.message || "No se pudo actualizar el estado del médico. Verifica la conexión con el backend." },
      { status: 500 }
    );
  }
}