import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ResultsDashboardProps {
  results: any;
  shocks?: any;
  sensitivityAnalysis?: any;
}

export function ResultsDashboard({
  results,
  shocks,
  sensitivityAnalysis,
}: ResultsDashboardProps) {
  const [currency, setCurrency] = useState<"Bs" | "USD">("Bs");
  const [activeTab, setActiveTab] = useState<"base" | "reduccion">("base");
  const EXCHANGE_RATE = 6.96;

  // Función para convertir valores monetarios
  const convertValue = (valueInMillionsBs: number): number => {
    if (currency === "USD") {
      return valueInMillionsBs / EXCHANGE_RATE;
    }
    return valueInMillionsBs;
  };

  // Función para obtener la unidad de moneda
  const getCurrencyUnit = (): string => {
    return currency === "USD" ? "M USD" : "M Bs";
  };

  if (!results) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <BarChart3 className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
        <h3 className="text-[var(--gray-600)] mb-2">
          No hay resultados disponibles
        </h3>
        <p className="text-[var(--gray-500)]">
          Por favor, ejecute la simulación fiscal primero en la sección
          "Simulación"
        </p>
      </div>
    );
  }

  // Determinar si hay comparación de escenarios
  const tieneComparacion = results.tieneComparacion || false;
  const datosConReduccion = results.conReduccion || results;
  const datosBase = tieneComparacion ? results.base : null;

  // Renderizar componente de dashboard
  const renderDashboard = (resultados: any, titulo: string) => {
    if (!resultados) {
      return null;
    }

    const { deudaTotal, deudaPIB, rin, deficitFiscal, inflacion } = resultados;

    // Preparar datos para distribución del déficit final
    const finalDeficit = deficitFiscal?.[deficitFiscal.length - 1];
    const distributionData = [];

    if (finalDeficit?.distribution) {
      const bins = 30;
      const min = Math.min(...finalDeficit.distribution);
      const max = Math.max(...finalDeficit.distribution);
      const binSize = (max - min) / bins;

      for (let i = 0; i < bins; i++) {
        const binStart = min + i * binSize;
        const binEnd = binStart + binSize;
        const count = finalDeficit.distribution.filter(
          (v: number) => v >= binStart && v < binEnd
        ).length;

        distributionData.push({
          bin: convertValue(binStart).toFixed(1),
          frequency: count,
        });
      }
    }

    const latestDebt = deudaTotal?.[deudaTotal.length - 1] || {
      mean: 0,
      p05: 0,
      p25: 0,
      p75: 0,
      p95: 0,
    };
    const latestDebtGDP = deudaPIB?.[deudaPIB.length - 1] || {
      mean: 0,
      p05: 0,
      p25: 0,
      p75: 0,
      p95: 0,
    };
    const latestRIN = rin?.[rin.length - 1] || {
      mean: 0,
      p05: 0,
      p25: 0,
      p75: 0,
      p95: 0,
    };
    const latestDeficit = deficitFiscal?.[deficitFiscal.length - 1] || {
      mean: 0,
      p05: 0,
      p25: 0,
      p75: 0,
      p95: 0,
    };
    const latestInflacion = inflacion?.[inflacion.length - 1] || {
      mean: 0,
      p05: 0,
      p25: 0,
      p75: 0,
      p95: 0,
    };

    // Calcular datos reales de gastos e ingresos del modelo (año final 2025)
    // Los datos llegan como arrays de {year, value}
    const gastoFinal =
      resultados.gastos?.[resultados.gastos.length - 1]?.value || 0;
    const gastoSinSubsidioFinal =
      resultados.gastoSinSubsidio?.[resultados.gastoSinSubsidio.length - 1]
        ?.value || 0;
    const subsidioFinal =
      resultados.subsidios?.[resultados.subsidios.length - 1]?.value || 0;

    const ingresosGasFinal =
      resultados.ingresosGas?.[resultados.ingresosGas.length - 1]?.value || 0;
    const ingresosZincFinal =
      resultados.ingresosZinc?.[resultados.ingresosZinc.length - 1]?.value || 0;
    const ingresosPlataFinal =
      resultados.ingresosPlata?.[resultados.ingresosPlata.length - 1]?.value ||
      0;
    const ingresosPlomoFinal =
      resultados.ingresosPlomo?.[resultados.ingresosPlomo.length - 1]?.value ||
      0;
    const ingresosEstanoFinal =
      resultados.ingresosEstano?.[resultados.ingresosEstano.length - 1]
        ?.value || 0;
    const ingresosOroFinal =
      resultados.ingresosOro?.[resultados.ingresosOro.length - 1]?.value || 0;
    const ingresosCommoditiesFinal =
      ingresosGasFinal +
      ingresosZincFinal +
      ingresosPlataFinal +
      ingresosPlomoFinal +
      ingresosEstanoFinal +
      ingresosOroFinal;

    // Obtener ingresos tributarios y no tributarios desglosados
    const ingresosIVAFinal =
      resultados.ingresosIVA?.[resultados.ingresosIVA.length - 1]?.value || 0;
    const ingresosITFinal =
      resultados.ingresosIT?.[resultados.ingresosIT.length - 1]?.value || 0;
    const ingresosIUEFinal =
      resultados.ingresosIUE?.[resultados.ingresosIUE.length - 1]?.value || 0;
    const ingresosRCIVAFinal =
      resultados.ingresosRCIVA?.[resultados.ingresosRCIVA.length - 1]?.value ||
      0;
    const ingresosICEFinal =
      resultados.ingresosICE?.[resultados.ingresosICE.length - 1]?.value || 0;
    const ingresosGAFinal =
      resultados.ingresosGA?.[resultados.ingresosGA.length - 1]?.value || 0;
    const ingresosIEHDFinal =
      resultados.ingresosIEHD?.[resultados.ingresosIEHD.length - 1]?.value || 0;
    const ingresosOtrosTributariosFinal =
      resultados.ingresosOtrosTributarios?.[
        resultados.ingresosOtrosTributarios.length - 1
      ]?.value || 0;
    const ingresosRegaliasFinal =
      resultados.ingresosRegalias?.[resultados.ingresosRegalias.length - 1]
        ?.value || 0;
    const ingresosOtrosNoTributariosFinal =
      resultados.ingresosOtrosNoTributarios?.[
        resultados.ingresosOtrosNoTributarios.length - 1
      ]?.value || 0;

    // Calcular totales de ingresos tributarios
    const ingresosTributariosFinal =
      ingresosIVAFinal +
      ingresosITFinal +
      ingresosIUEFinal +
      ingresosRCIVAFinal +
      ingresosICEFinal +
      ingresosGAFinal +
      ingresosIEHDFinal +
      ingresosOtrosTributariosFinal;

    // Obtener componentes del gasto desglosados
    const gastoCorrienteFinal =
      resultados.gastoCorriente?.[resultados.gastoCorriente.length - 1]
        ?.value || 0;
    const transferenciasSocialesFinal =
      resultados.transferenciasSociales?.[
        resultados.transferenciasSociales.length - 1
      ]?.value || 0;
    const inversionPublicaFinal =
      resultados.inversionPublica?.[resultados.inversionPublica.length - 1]
        ?.value || 0;

    // Datos para gráficos de pastel con valores reales del modelo
    const gastoPublicoData = [
      { name: "Gasto Corriente", value: gastoCorrienteFinal, fill: "#D72638" },
      {
        name: "Transferencias Sociales",
        value: transferenciasSocialesFinal,
        fill: "#f59e0b",
      },
      {
        name: "Inversión Pública",
        value: inversionPublicaFinal,
        fill: "#3b82f6",
      },
      { name: "Subsidios", value: subsidioFinal, fill: "#FFC857" },
    ].filter((item) => item.value > 0);

    const ingresosData = [
      {
        name: "Commodities",
        value: ingresosCommoditiesFinal,
        fill: "#00A878",
      },
      {
        name: "IVA",
        value: ingresosIVAFinal,
        fill: "#3b82f6",
      },
      {
        name: "IT",
        value: ingresosITFinal,
        fill: "#8b5cf6",
      },
      {
        name: "IUE",
        value: ingresosIUEFinal,
        fill: "#f59e0b",
      },
      {
        name: "RC-IVA",
        value: ingresosRCIVAFinal,
        fill: "#10b981",
      },
      {
        name: "ICE",
        value: ingresosICEFinal,
        fill: "#ef4444",
      },
      {
        name: "GA",
        value: ingresosGAFinal,
        fill: "#ec4899",
      },
      {
        name: "IEHD",
        value: ingresosIEHDFinal,
        fill: "#f97316",
      },
      {
        name: "Regalías",
        value: ingresosRegaliasFinal,
        fill: "#14b8a6",
      },
      {
        name: "Otros",
        value: ingresosOtrosTributariosFinal + ingresosOtrosNoTributariosFinal,
        fill: "#6B7280",
      },
    ].filter((item) => item.value > 0);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[var(--gray-900)] mb-2">
                {titulo || "Dashboard de Resultados"}
              </h2>
              <p className="text-[var(--gray-600)]">
                Resultados del escenario con políticas fiscales y shocks
                estocásticos aplicados. Los intervalos representan percentiles
                10-90 de las simulaciones Monte Carlo.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--gray-600)]">Unidad:</span>
              <div className="flex gap-2 bg-[var(--gray-100)] rounded-lg p-1">
                <button
                  onClick={() => setCurrency("Bs")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    currency === "Bs"
                      ? "bg-white text-[var(--gray-900)] shadow-sm"
                      : "text-[var(--gray-600)] hover:text-[var(--gray-900)]"
                  }`}
                >
                  Bs
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    currency === "USD"
                      ? "bg-white text-[var(--gray-900)] shadow-sm"
                      : "text-[var(--gray-600)] hover:text-[var(--gray-900)]"
                  }`}
                >
                  USD
                </button>
              </div>
              <span className="text-xs text-[var(--gray-500)]">
                TC: 1 USD = {EXCHANGE_RATE} Bs
              </span>
            </div>
          </div>

          {/* KPIs Summary */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[200px] bg-gradient-to-br from-red-50 to-white border-2 border-[var(--bolivia-red)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[var(--bolivia-red)]" />
                <span className="text-[var(--gray-600)]">Deuda Total 2025</span>
              </div>
              <div className="text-[var(--bolivia-red)] text-2xl">
                {convertValue(latestDebt.mean).toFixed(0)} {getCurrencyUnit()}
              </div>
              <small className="text-[var(--gray-500)]">
                Media de{" "}
                {resultados.numSimulaciones?.toLocaleString() || "1000"} sims
              </small>
            </div>

            <div className="flex-1 min-w-[200px] bg-gradient-to-br from-yellow-50 to-white border-2 border-[var(--bolivia-yellow)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-[var(--bolivia-yellow)]" />
                <span className="text-[var(--gray-600)]">Deuda/PIB 2025</span>
              </div>
              <div className="text-[var(--bolivia-yellow)] text-2xl">
                {latestDebtGDP.mean.toFixed(1)}%
              </div>
              <small className="text-[var(--gray-500)]">Ratio promedio</small>
            </div>

            <div className="flex-1 min-w-[200px] bg-gradient-to-br from-green-50 to-white border-2 border-[var(--bolivia-green)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-[var(--bolivia-green)]" />
                <span className="text-[var(--gray-600)]">RIN 2025</span>
              </div>
              <div className="text-[var(--bolivia-green)] text-2xl">
                {convertValue(latestRIN.mean).toFixed(0)} {getCurrencyUnit()}
              </div>
              <small className="text-[var(--gray-500)]">
                Reservas internacionales
              </small>
            </div>

            <div className="flex-1 min-w-[200px] bg-gradient-to-br from-orange-50 to-white border-2 border-orange-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-orange-500" />
                <span className="text-[var(--gray-600)]">Déficit 2025</span>
              </div>
              <div className="text-orange-500 text-2xl">
                {convertValue(latestDeficit.mean).toFixed(0)}{" "}
                {getCurrencyUnit()}
              </div>
              <small className="text-[var(--gray-500)]">
                Déficit fiscal promedio
              </small>
            </div>

            <div className="flex-1 min-w-[200px] bg-gradient-to-br from-blue-50 to-white border-2 border-blue-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-[var(--gray-600)]">Inflación 2025</span>
              </div>
              <div className="text-blue-500 text-2xl">
                {latestInflacion ? latestInflacion.mean.toFixed(2) : "0.00"}%
              </div>
              <small className="text-[var(--gray-500)]">
                Tasa promedio anual
              </small>
            </div>
          </div>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deuda Pública Total */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--gray-800)] mb-4">
              Trayectoria de la Deuda Pública Total
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={deudaTotal}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
                <XAxis dataKey="year" stroke="var(--gray-600)" />
                <YAxis
                  stroke="var(--gray-600)"
                  label={{
                    value: getCurrencyUnit(),
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--gray-900)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: any) =>
                    `${convertValue(value).toFixed(0)} ${getCurrencyUnit()}`
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="p90"
                  stackId="1"
                  stroke="var(--red-light)"
                  fill="var(--red-light)"
                  fillOpacity={0.3}
                  name="P90"
                />
                <Area
                  type="monotone"
                  dataKey="p50"
                  stackId="2"
                  stroke="var(--bolivia-red)"
                  fill="var(--bolivia-red)"
                  fillOpacity={0.5}
                  name="Mediana"
                />
                <Area
                  type="monotone"
                  dataKey="p10"
                  stackId="3"
                  stroke="var(--red-dark)"
                  fill="var(--red-dark)"
                  fillOpacity={0.3}
                  name="P10"
                />
                <Line
                  type="monotone"
                  dataKey="mean"
                  stroke="var(--gray-900)"
                  strokeWidth={2}
                  dot={false}
                  name="Media"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[var(--gray-500)] mt-2 text-center">
              <small>Sombreado: intervalo de confianza 10-90 percentil</small>
            </p>
          </div>

          {/* Ratio Deuda/PIB */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--gray-800)] mb-4">
              Ratio Deuda Pública / PIB
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deudaPIB}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
                <XAxis dataKey="year" stroke="var(--gray-600)" />
                <YAxis
                  stroke="var(--gray-600)"
                  label={{
                    value: "% del PIB",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--gray-900)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: any) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="p90"
                  stroke="var(--red-light)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="P90"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="mean"
                  stroke="var(--bolivia-yellow)"
                  strokeWidth={3}
                  name="Media"
                />
                <Line
                  type="monotone"
                  dataKey="p10"
                  stroke="var(--yellow-dark)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="P10"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[var(--gray-500)] mt-2 text-center">
              <small>Línea sólida: media · Líneas punteadas: percentiles</small>
            </p>
          </div>

          {/* Reservas Internacionales Netas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--gray-800)] mb-4">
              Evolución de las Reservas Internacionales Netas (RIN)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={rin}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
                <XAxis dataKey="year" stroke="var(--gray-600)" />
                <YAxis
                  stroke="var(--gray-600)"
                  label={{
                    value: getCurrencyUnit(),
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--gray-900)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: any) =>
                    `${convertValue(value).toFixed(0)} ${getCurrencyUnit()}`
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="p90"
                  stackId="1"
                  stroke="var(--green-light)"
                  fill="var(--green-light)"
                  fillOpacity={0.3}
                  name="P90"
                />
                <Area
                  type="monotone"
                  dataKey="p50"
                  stackId="2"
                  stroke="var(--bolivia-green)"
                  fill="var(--bolivia-green)"
                  fillOpacity={0.5}
                  name="Mediana"
                />
                <Area
                  type="monotone"
                  dataKey="p10"
                  stackId="3"
                  stroke="var(--green-dark)"
                  fill="var(--green-dark)"
                  fillOpacity={0.3}
                  name="P10"
                />
                <Line
                  type="monotone"
                  dataKey="mean"
                  stroke="var(--gray-900)"
                  strokeWidth={2}
                  dot={false}
                  name="Media"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[var(--gray-500)] mt-2 text-center">
              <small>
                Mayor RIN indica mayor capacidad de respuesta a shocks externos
              </small>
            </p>
          </div>

          {/* Distribución Déficit Fiscal */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-[var(--gray-800)] mb-4">
              Distribución Probabilística del Déficit Fiscal 2025
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
                <XAxis
                  dataKey="bin"
                  stroke="var(--gray-600)"
                  label={{
                    value: getCurrencyUnit(),
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  stroke="var(--gray-600)"
                  label={{
                    value: "Frecuencia",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--gray-900)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar
                  dataKey="frequency"
                  fill="var(--bolivia-red)"
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[var(--gray-500)] mt-2 text-center">
              <small>
                Histograma de{" "}
                {resultados.numSimulaciones?.toLocaleString() || "1000"}{" "}
                simulaciones Monte Carlo
              </small>
            </p>
          </div>

          {/* Inflación */}
          {inflacion && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-[var(--gray-800)] mb-4">
                Evolución de la Inflación Anual
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={inflacion}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--gray-300)"
                  />
                  <XAxis dataKey="year" stroke="var(--gray-600)" />
                  <YAxis
                    stroke="var(--gray-600)"
                    label={{
                      value: "% Anual",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--gray-900)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    formatter={(value: any) => `${value.toFixed(2)}%`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="p90"
                    stroke="#93C5FD"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name="P90"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="mean"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Media"
                  />
                  <Line
                    type="monotone"
                    dataKey="p10"
                    stroke="#1E40AF"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name="P10"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[var(--gray-500)] mt-2 text-center">
                <small>
                  Inflación influenciada por déficit fiscal y precios
                  internacionales (efecto parcial en tasas de interés)
                </small>
              </p>
            </div>
          )}
        </div>

        {/* CORRECCIÓN 6: Gráficos de Pastel */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-[var(--gray-900)] mb-6 flex items-center gap-2">
            <PieChartIcon className="w-6 h-6 text-[var(--bolivia-yellow)]" />
            Composición Fiscal - Desglose de Gastos e Ingresos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--gray-50)] rounded-lg p-6">
              <h4 className="text-[var(--gray-800)] mb-4 text-center">
                Composición del Gasto Público
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={gastoPublicoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gastoPublicoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) =>
                      `${convertValue(value).toFixed(0)} ${getCurrencyUnit()}`
                    }
                    contentStyle={{
                      backgroundColor: "var(--gray-900)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    labelStyle={{ color: "white" }}
                    itemStyle={{ color: "white" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-[var(--gray-600)] text-center mt-2 text-sm">
                Total:{" "}
                {convertValue(
                  gastoPublicoData.reduce((acc, d) => acc + d.value, 0)
                ).toFixed(0)}{" "}
                {getCurrencyUnit()}
              </p>
            </div>

            <div className="bg-[var(--gray-50)] rounded-lg p-6">
              <h4 className="text-[var(--gray-800)] mb-4 text-center">
                Fuentes de Ingresos Fiscales
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={ingresosData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ingresosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) =>
                      `${convertValue(value).toFixed(0)} ${getCurrencyUnit()}`
                    }
                    contentStyle={{
                      backgroundColor: "var(--gray-900)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    labelStyle={{ color: "white" }}
                    itemStyle={{ color: "white" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-[var(--gray-600)] text-center mt-2 text-sm">
                Total:{" "}
                {convertValue(
                  ingresosData.reduce((acc, d) => acc + d.value, 0)
                ).toFixed(0)}{" "}
                {getCurrencyUnit()}
              </p>
            </div>
          </div>
        </div>

        {/* CORRECCIÓN 5: Resultados Complementarios */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8">
          <h3 className="text-[var(--gray-900)] mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--bolivia-yellow)]" />
            Resultados Complementarios del Escenario Simulado
          </h3>
          <p className="text-[var(--gray-600)] mb-6">
            A continuación se presentan visualizaciones adicionales de shocks
            estocásticos y análisis de sensibilidad de políticas fiscales.
          </p>

          {/* Shocks Estocásticos */}
          {shocks?.bandData && (
            <div className="space-y-6 mb-8">
              <h4 className="text-[var(--gray-800)]">
                Shocks Estocásticos: Trayectorias de Precios de Commodities
              </h4>

              {Object.keys(shocks.bandData).map((commodity) => (
                <div key={commodity} className="bg-white rounded-lg p-6">
                  <h5 className="text-[var(--gray-800)] mb-4">
                    {commodity} - Bandas de Incertidumbre (P10-P90)
                  </h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={shocks.bandData[commodity]}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--gray-300)"
                      />
                      <XAxis dataKey="year" stroke="var(--gray-600)" />
                      <YAxis
                        stroke="var(--gray-600)"
                        label={{
                          value: "Precio (USD)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--gray-900)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                        formatter={(value: any) => `${value.toFixed(2)}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="p90"
                        stroke="var(--bolivia-yellow)"
                        fill="var(--bolivia-yellow)"
                        fillOpacity={0.2}
                        name="P90"
                      />
                      <Area
                        type="monotone"
                        dataKey="p10"
                        stroke="var(--bolivia-green)"
                        fill="var(--bolivia-green)"
                        fillOpacity={0.2}
                        name="P10"
                      />
                      <Line
                        type="monotone"
                        dataKey="mean"
                        stroke="var(--gray-900)"
                        strokeWidth={2}
                        name="Media"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          )}

          {/* Análisis de Sensibilidad */}
          {sensitivityAnalysis && (
            <div className="space-y-6">
              <h4 className="text-[var(--gray-800)]">
                📈 Análisis de Sensibilidad: Impacto de Política de Subsidios
              </h4>

              <div className="bg-white rounded-lg p-6">
                <h5 className="text-[var(--gray-800)] mb-4">
                  Comparación de Escenarios
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sensitivityAnalysis.escenarioComparison}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--gray-300)"
                    />
                    <XAxis dataKey="year" stroke="var(--gray-600)" />
                    <YAxis
                      stroke="var(--gray-600)"
                      label={{
                        value: `Subsidios (${getCurrencyUnit()})`,
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--gray-900)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                      labelStyle={{ color: "white" }}
                      itemStyle={{ color: "white" }}
                      formatter={(value: any) =>
                        `${convertValue(value).toFixed(
                          currency === "USD" ? 2 : 0
                        )} ${getCurrencyUnit()}`
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="escenarioBase"
                      name="Escenario Base"
                      fill="#D72638"
                    />
                    <Bar
                      dataKey="escenarioConReduccion"
                      name="Con Reducción"
                      fill="#00A878"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h5 className="text-[var(--gray-800)] mb-4">
                  Trayectoria de Reducción
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensitivityAnalysis.trayectoriaReduccion}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--gray-300)"
                    />
                    <XAxis dataKey="year" stroke="var(--gray-600)" />
                    <YAxis
                      yAxisId="left"
                      stroke="var(--gray-600)"
                      label={{
                        value: "% Reducción",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="var(--gray-600)"
                      label={{
                        value: `Ahorro (${getCurrencyUnit()})`,
                        angle: 90,
                        position: "insideRight",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--gray-900)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                      labelStyle={{ color: "white" }}
                      itemStyle={{ color: "white" }}
                      formatter={(value: any, name: string) => {
                        if (name === "% Reducción") {
                          return `${Number(value).toFixed(1)}%`;
                        }
                        return `${convertValue(value).toFixed(
                          currency === "USD" ? 2 : 0
                        )} ${getCurrencyUnit()}`;
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="porcentajeReduccion"
                      name="% Reducción"
                      stroke="#FFC857"
                      strokeWidth={3}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ahorroAnual"
                      name="Ahorro Anual"
                      stroke="#00A878"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Tabla resumen estadístico */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-[var(--gray-800)] mb-4">
            Resumen Estadístico - Año 2025
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[var(--gray-300)]">
                  <th className="text-left py-3 px-4 text-[var(--gray-700)]">
                    Variable
                  </th>
                  <th className="text-right py-3 px-4 text-[var(--gray-700)]">
                    Media
                  </th>
                  <th className="text-right py-3 px-4 text-[var(--gray-700)]">
                    P05
                  </th>
                  <th className="text-right py-3 px-4 text-[var(--gray-700)]">
                    P25
                  </th>
                  <th className="text-right py-3 px-4 text-[var(--gray-700)]">
                    P95
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--gray-200)] hover:bg-[var(--gray-50)]">
                  <td className="py-3 px-4 text-[var(--gray-900)]">
                    Deuda Pública Total ({getCurrencyUnit()})
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDebt.mean).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDebt.p05).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDebt.p25).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDebt.p95).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                </tr>
                <tr className="border-b border-[var(--gray-200)] hover:bg-[var(--gray-50)]">
                  <td className="py-3 px-4 text-[var(--gray-900)]">
                    Ratio Deuda/PIB (%)
                  </td>
                  <td className="text-right py-3 px-4">
                    {latestDebtGDP.mean.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {latestDebtGDP.p05.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {latestDebtGDP.p25.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {latestDebtGDP.p95.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b border-[var(--gray-200)] hover:bg-[var(--gray-50)]">
                  <td className="py-3 px-4 text-[var(--gray-900)]">
                    RIN ({getCurrencyUnit()})
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestRIN.mean).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestRIN.p05).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestRIN.p25).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestRIN.p95).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-[var(--gray-50)]">
                  <td className="py-3 px-4 text-[var(--gray-900)]">
                    Déficit Fiscal ({getCurrencyUnit()})
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDeficit.mean).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDeficit.p05).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDeficit.p25).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                  <td className="text-right py-3 px-4">
                    {convertValue(latestDeficit.p95).toFixed(
                      currency === "USD" ? 2 : 0
                    )}
                  </td>
                </tr>
                {latestInflacion && (
                  <tr className="border-t border-[var(--gray-200)] hover:bg-[var(--gray-50)]">
                    <td className="py-3 px-4 text-[var(--gray-900)]">
                      Inflación (%)
                    </td>
                    <td className="text-right py-3 px-4">
                      {latestInflacion.mean.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {latestInflacion.p05.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {latestInflacion.p25.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {latestInflacion.p95.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }; // Fin de renderDashboard

  // Renderizado principal
  if (tieneComparacion) {
    return (
      <div className="space-y-6">
        {/* Encabezado de comparación */}
        <div className="bg-gradient-to-r from-[var(--bolivia-green)] to-green-600 rounded-xl shadow-md p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            📊 Comparación de Escenarios
          </h2>
          <p className="text-green-50">
            Análisis comparativo: Escenario Base vs. Escenario con Reducción de
            Subsidios
          </p>
        </div>

        {/* Pestañas (Tabs) */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="flex border-b-2 border-[var(--gray-200)]">
            <button
              onClick={() => setActiveTab("base")}
              className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                activeTab === "base"
                  ? "border-b-4 border-blue-500 text-blue-700 bg-blue-50"
                  : "text-[var(--gray-600)] hover:bg-[var(--gray-50)]"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span>Escenario Base (Sin Reducción)</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("reduccion")}
              className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                activeTab === "reduccion"
                  ? "border-b-4 border-green-500 text-green-700 bg-green-50"
                  : "text-[var(--gray-600)] hover:bg-[var(--gray-50)]"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Escenario con Reducción</span>
              </div>
            </button>
          </div>

          {/* Contenido de las pestañas */}
          <div className="p-6">
            {activeTab === "base" && (
              <div>
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                  <p className="text-blue-900 font-medium">
                    📈 Escenario Base - Proyección manteniendo subsidios
                    actuales
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Este escenario muestra la evolución fiscal sin aplicar
                    políticas de reducción de subsidios
                  </p>
                </div>
                {renderDashboard(datosBase, "Escenario Base")}
              </div>
            )}

            {activeTab === "reduccion" && (
              <div>
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6">
                  <p className="text-green-900 font-medium">
                    📉 Escenario con Reducción - Proyección con política de
                    ajuste
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Este escenario muestra la evolución fiscal aplicando la
                    reducción de subsidios configurada
                  </p>
                </div>
                {renderDashboard(datosConReduccion, "Escenario con Reducción")}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // Sin comparación, mostrar dashboard normal
    return renderDashboard(datosConReduccion, "Resultados de Simulación");
  }
}
