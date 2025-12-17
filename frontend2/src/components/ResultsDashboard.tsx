import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  PieChart as PieChartIcon,
} from "lucide-react";
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

  const { deudaTotal, deudaPIB, rin, deficitFiscal } = results;

  // Preparar datos para distribución del déficit final
  const finalDeficit = deficitFiscal[deficitFiscal.length - 1];
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
        bin: binStart.toFixed(1),
        frequency: count,
      });
    }
  }

  const latestDebt = deudaTotal[deudaTotal.length - 1];
  const latestDebtGDP = deudaPIB[deudaPIB.length - 1];
  const latestRIN = rin[rin.length - 1];
  const latestDeficit = deficitFiscal[deficitFiscal.length - 1];

  // CORRECCIÓN 6: Datos para gráficos de pastel
  const gastoPublicoData = [
    { name: "Gasto Corriente", value: 25000, fill: "#D72638" },
    { name: "Gasto de Capital", value: 8000, fill: "#FFC857" },
  ];

  const ingresosData = [
    { name: "Ingresos Commodities", value: 4500, fill: "#00A878" },
    { name: "Recaudación Interna", value: 18500, fill: "#6B7280" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-[var(--gray-900)] mb-2">Dashboard de Resultados</h2>
        <p className="text-[var(--gray-600)] mb-6">
          Resultados del escenario con políticas fiscales y shocks estocásticos
          aplicados. Los intervalos representan percentiles 10-90 de las
          simulaciones Monte Carlo.
        </p>

        {/* KPIs Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-white border-2 border-[var(--bolivia-red)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[var(--bolivia-red)]" />
              <span className="text-[var(--gray-600)]">Deuda Total 2025</span>
            </div>
            <div className="text-[var(--bolivia-red)] text-2xl">
              ${(latestDebt.mean / 1000).toFixed(1)}B
            </div>
            <small className="text-[var(--gray-500)]">
              Media de {results.numSimulaciones.toLocaleString()} sims
            </small>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white border-2 border-[var(--bolivia-yellow)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-[var(--bolivia-yellow)]" />
              <span className="text-[var(--gray-600)]">Deuda/PIB 2025</span>
            </div>
            <div className="text-[var(--bolivia-yellow)] text-2xl">
              {latestDebtGDP.mean.toFixed(1)}%
            </div>
            <small className="text-[var(--gray-500)]">Ratio promedio</small>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-[var(--bolivia-green)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-[var(--bolivia-green)]" />
              <span className="text-[var(--gray-600)]">RIN 2025</span>
            </div>
            <div className="text-[var(--bolivia-green)] text-2xl">
              ${(latestRIN.mean / 1000).toFixed(1)}B
            </div>
            <small className="text-[var(--gray-500)]">
              Reservas internacionales
            </small>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              <span className="text-[var(--gray-600)]">Déficit 2025</span>
            </div>
            <div className="text-orange-500 text-2xl">
              {latestDeficit.mean.toFixed(2)}%
            </div>
            <small className="text-[var(--gray-500)]">% del PIB</small>
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
                  value: "Millones USD",
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
                formatter={(value: any) => `$${value.toFixed(0)}M`}
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
                  value: "Millones USD",
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
                formatter={(value: any) => `$${value.toFixed(0)}M`}
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
                  value: "% del PIB",
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
              Histograma de {results.numSimulaciones.toLocaleString()}{" "}
              simulaciones Monte Carlo
            </small>
          </p>
        </div>
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
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gastoPublicoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `$${value.toLocaleString()} M`}
                  contentStyle={{
                    backgroundColor: "var(--gray-900)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-[var(--gray-600)] text-center mt-2 text-sm">
              Total: ${(25000 + 8000).toLocaleString()} M
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
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ingresosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `$${value.toLocaleString()} M`}
                  contentStyle={{
                    backgroundColor: "var(--gray-900)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-[var(--gray-600)] text-center mt-2 text-sm">
              Total: ${(4500 + 18500).toLocaleString()} M
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
              📊 Shocks Estocásticos: Trayectorias de Precios de Commodities
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
                      formatter={(value: any) => `$${value.toFixed(2)}`}
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
                      value: "Subsidios (Millones USD)",
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
                    formatter={(value: any) => `$${value.toLocaleString()} M`}
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
                      value: "Ahorro (M USD)",
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
                  Deuda Pública Total (M USD)
                </td>
                <td className="text-right py-3 px-4">
                  {latestDebt.mean.toFixed(0)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestDebt.p05.toFixed(0)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestDebt.p25.toFixed(0)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestDebt.p95.toFixed(0)}
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
                  RIN (M USD)
                </td>
                <td className="text-right py-3 px-4">
                  {latestRIN.mean.toFixed(0)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestRIN.p05.toFixed(0)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestRIN.p25.toFixed(0)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestRIN.p95.toFixed(0)}
                </td>
              </tr>
              <tr className="hover:bg-[var(--gray-50)]">
                <td className="py-3 px-4 text-[var(--gray-900)]">
                  Déficit Fiscal (% PIB)
                </td>
                <td className="text-right py-3 px-4">
                  {latestDeficit.mean.toFixed(2)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestDeficit.p05.toFixed(2)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestDeficit.p25.toFixed(2)}
                </td>
                <td className="text-right py-3 px-4">
                  {latestDeficit.p95.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
