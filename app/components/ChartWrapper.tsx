// app/dashboard/(overview)/ChartWrapper.tsx
import { fetchConsultasPorMes } from "@/app/helpers/api";
import ConsultasPorEspecialidadChart from "./ConsultasPorEspecialidadChart";
import React from "react";

const ChartWrapper = async () => {
  try {
    const consultas = await fetchConsultasPorMes(2025, 3); // Año y mes específicos
    console.log("Data passed to ConsultasPorEspecialidadChart:", consultas);
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <ConsultasPorEspecialidadChart
          consultas={consultas}
          chartHeight={350}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in ChartWrapper:", error);
    return <div className="text-gray-500">No se pudieron cargar las consultas por especialidad.</div>;
  }
};

export default ChartWrapper;