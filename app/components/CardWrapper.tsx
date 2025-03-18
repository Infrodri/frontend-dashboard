// app/components/CardWrapper.tsx
import React from "react";
import StatsCards from "./StatsCards";
import { fetchCardData } from "@/app/helpers/api";

const CardWrapper = async () => {
  try {
    const { totalPacientes, totalConsultas, pacientesPendientes, pacientesAtendidos, consultasUrgentes } = await fetchCardData();

    return (
      <StatsCards
        totalPacientes={totalPacientes}
        totalConsultas={totalConsultas}
        pacientesPendientes={pacientesPendientes}
        pacientesAtendidos={pacientesAtendidos}
        pacientesDerivados={""}
        consultasUrgentes={consultasUrgentes}
        className="p-4"
      />
    );
  } catch (error) {
    console.error("Error in CardWrapper:", error);
    return <div>No se pudieron cargar las estadísticas del dashboard.</div>;
  }
};

export default CardWrapper;