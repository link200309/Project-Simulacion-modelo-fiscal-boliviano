import { Line } from "react-chartjs-2";

export default function GraficoIncertidumbre({ datos }) {
  if (!datos) {
    return (
      <div className="text-center py-8 text-slate-400">
        No hay datos disponibles
      </div>
    );
  }

  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  // Gráfico 1: Ratio Deuda/PIB con bandas de incertidumbre
  const chartDeuda = {
    labels: years,
    datasets: [
      {
        label: "P95 (Percentil 95%)",
        data: datos.ratio_deuda_pib_p95 || [],
        borderColor: "rgba(239, 68, 68, 0.8)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
      {
        label: "P75 (Percentil 75%)",
        data: datos.ratio_deuda_pib_p75 || [],
        borderColor: "rgba(249, 115, 22, 0.8)",
        backgroundColor: "rgba(249, 115, 22, 0.15)",
        borderWidth: 1.5,
        borderDash: [3, 3],
        fill: "-1",
        tension: 0.4,
      },
      {
        label: "Media",
        data: datos.ratio_deuda_pib || [],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "P25 (Percentil 25%)",
        data: datos.ratio_deuda_pib_p25 || [],
        borderColor: "rgba(34, 197, 94, 0.8)",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        borderWidth: 1.5,
        borderDash: [3, 3],
        fill: "-1",
        tension: 0.4,
      },
      {
        label: "P05 (Percentil 5%)",
        data: datos.ratio_deuda_pib_p05 || [],
        borderColor: "rgba(139, 92, 246, 0.8)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const optionsDeuda = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: "rgb(148, 163, 184)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        position: "top",
      },
      title: {
        display: true,
        text: "Ratio Deuda/PIB con Bandas de Incertidumbre (2020-2025)",
        color: "rgb(226, 232, 240)",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Ratio (%)",
          color: "rgb(148, 163, 184)",
        },
        ticks: {
          color: "rgb(148, 163, 184)",
          callback: function (value) {
            return value.toFixed(2);
          },
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
      },
      x: {
        ticks: {
          color: "rgb(148, 163, 184)",
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
      },
    },
  };

  // Gráfico 2: RIN con bandas de incertidumbre
  const chartRIN = {
    labels: years,
    datasets: [
      {
        label: "P95 (Percentil 95%)",
        data: datos.rin_p95 || [],
        borderColor: "rgba(239, 68, 68, 0.8)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
      {
        label: "P75 (Percentil 75%)",
        data: datos.rin_p75 || [],
        borderColor: "rgba(249, 115, 22, 0.8)",
        backgroundColor: "rgba(249, 115, 22, 0.15)",
        borderWidth: 1.5,
        borderDash: [3, 3],
        fill: "-1",
        tension: 0.4,
      },
      {
        label: "Media",
        data: datos.rin_media || [],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "P25 (Percentil 25%)",
        data: datos.rin_p25 || [],
        borderColor: "rgba(34, 197, 94, 0.8)",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        borderWidth: 1.5,
        borderDash: [3, 3],
        fill: "-1",
        tension: 0.4,
      },
      {
        label: "P05 (Percentil 5%)",
        data: datos.rin_p05 || [],
        borderColor: "rgba(139, 92, 246, 0.8)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const optionsRIN = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: "rgb(148, 163, 184)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        position: "top",
      },
      title: {
        display: true,
        text: "Reservas Internacionales Netas (RIN) con Bandas de Incertidumbre",
        color: "rgb(226, 232, 240)",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Millones Bs",
          color: "rgb(148, 163, 184)",
        },
        ticks: {
          color: "rgb(148, 163, 184)",
          callback: function (value) {
            return value.toLocaleString("es-BO");
          },
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
      },
      x: {
        ticks: {
          color: "rgb(148, 163, 184)",
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <Line data={chartDeuda} options={optionsDeuda} />
        <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded">
          <p className="text-blue-300 text-sm">
            📌 <strong>Interpretación:</strong> El área entre P05 y P95
            representa la incertidumbre del 90% (rango donde cae el 90% de las
            simulaciones). La línea azul es el valor medio esperado.
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <Line data={chartRIN} options={optionsRIN} />
        <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded">
          <p className="text-blue-300 text-sm">
            <strong>Interpretación:</strong> Muestra la evolución de las
            reservas con incertidumbre. Un RIN menor a 10,000 millones se
            considera crítico para la estabilidad cambiaria.
          </p>
        </div>
      </div>
    </div>
  );
}
