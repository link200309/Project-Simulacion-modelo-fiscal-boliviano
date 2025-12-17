import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ResultadosChart({ titulo, datos, color }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && datos && datos.length > 0) {
      // Destruir gráfico anterior si existe
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext("2d");

      // Crear etiquetas para los años
      const labels = datos.map((_, idx) => `${2020 + idx}`);

      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: titulo,
              data: datos,
              borderColor: color,
              backgroundColor: color + "20",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: color,
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              labels: {
                color: "#e2e8f0",
                font: {
                  size: 12,
                },
              },
            },
          },
          scales: {
            y: {
              grid: {
                color: "rgba(148, 163, 184, 0.1)",
              },
              ticks: {
                color: "#cbd5e1",
              },
            },
            x: {
              grid: {
                color: "rgba(148, 163, 184, 0.1)",
              },
              ticks: {
                color: "#cbd5e1",
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [datos, color, titulo]);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">{titulo}</h2>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
