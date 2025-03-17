// app/dashboard/(overview)/ConsultasPorEspecialidadChart.tsx
import React from "react";

// Definir el tipo de datos que esperamos
interface ConsultaPorEspecialidad {
  id: string;
  nombre: string;
  total: number;
}

interface ConsultasPorEspecialidadChartProps {
  consultas: ConsultaPorEspecialidad[];
  chartHeight?: number;
  className?: string;
}

const ConsultasPorEspecialidadChart: React.FC<ConsultasPorEspecialidadChartProps> = ({
  consultas,
  chartHeight = 350,
  className = "",
}) => {
  if (!consultas || consultas.length === 0) {
    return <div className="text-gray-500">No hay datos para mostrar.</div>;
  }

  // Configuración del gráfico
  const width = "100%"; // Ancho responsivo
  const height = chartHeight;
  const padding = 50; // Espacio para etiquetas
  const barWidth = (parseInt(width, 10) - padding * 2) / consultas.length || 50; // Ancho de cada barra
  const maxTotal = Math.max(...consultas.map(c => c.total), 1); // Máximo valor para escalar

  // Escala para los valores del eje Y
  const yScale = (height - padding * 2) / maxTotal;

  return (
    <div className={`p-0 ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Fondo */}
        <rect width={width} height={height} fill="#f7f7f7" /> {/* Fondo gris claro para mejor contraste */}

        {/* Barras y etiquetas */}
        {consultas.map((consulta, index) => {
          const barHeight = consulta.total * yScale;
          const x = padding + index * barWidth;
          const y = height - padding - barHeight;

          return (
            <g key={consulta.id}>
              {/* Barra */}
              <rect
                x={x}
                y={y}
                width={barWidth - 10}
                height={barHeight}
                fill="#4A90E2" // Color azul similar a la captura
                className="transition-all duration-300 hover:fill-blue-500"
              />

              {/* Etiqueta del total (arriba de la barra) */}
              <text
                x={x + (barWidth - 10) / 2}
                y={y - 10}
                textAnchor="middle"
                fill="#333"
                fontSize="12"
              >
                {consulta.total}
              </text>

              {/* Etiqueta de la especialidad (abajo, rotada verticalmente) */}
              <text
                x={x + (barWidth - 10) / 2}
                y={height - padding + 20}
                textAnchor="end"
                fill="#333"
                fontSize="12"
                transform={`rotate(-90 ${x + (barWidth - 10) / 2} ${height - padding + 20})`}
              >
                {consulta.nombre}
              </text>
            </g>
          );
        })}

        {/* Ejes */}
        {/* Eje X */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width === "100%" ? "90%" : width - padding} // Ajuste responsivo
          y2={height - padding}
          stroke="#333"
          strokeWidth="2"
        />
        {/* Eje Y */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Marcas en el eje Y */}
        {[...Array(5)].map((_, i) => {
          const y = height - padding - (i * (height - padding * 2)) / 4;
          const value = Math.round((maxTotal * i) / 4);
          return (
            <g key={i}>
              <line
                x1={padding - 5}
                y1={y}
                x2={padding}
                y2={y}
                stroke="#333"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fill="#333"
                fontSize="12"
                className="font-bold"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ConsultasPorEspecialidadChart;