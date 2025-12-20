import { Zap, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";

interface ShockConfig {
  commodity: string;
  volatilidad: number;
  enabled: boolean;
}

interface StochasticShocksSectionProps {
  onShocksGenerated: (shocks: any) => void;
}

export function StochasticShocksSection({
  onShocksGenerated,
}: StochasticShocksSectionProps) {
  const [numSimulaciones, setNumSimulaciones] = useState(5000);
  const [shockConfigs, setShockConfigs] = useState<ShockConfig[]>([
    {
      commodity: "Gas Natural",
      volatilidad: 0.2,
      enabled: true,
    },
    {
      commodity: "Zinc",
      volatilidad: 0.25,
      enabled: true,
    },
    {
      commodity: "Plata",
      volatilidad: 0.3,
      enabled: true,
    },
    {
      commodity: "Plomo",
      volatilidad: 0.22,
      enabled: true,
    },
    {
      commodity: "Estaño",
      volatilidad: 0.28,
      enabled: true,
    },
    {
      commodity: "Oro",
      volatilidad: 0.18,
      enabled: true,
    },
  ]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Precios base editables por el usuario
  const [preciosBase, setPreciosBase] = useState<{ [key: string]: number }>({
    "Gas Natural": 55.0, // USD/MMBTU
    Zinc: 2200.0, // USD/tonelada
    Plata: 20.0, // USD/onza troy
    Plomo: 1850.0, // USD/tonelada
    Estaño: 17000.0, // USD/tonelada
    Oro: 1800.0, // USD/onza troy
  });

  const generateShocks = () => {
    setIsGenerating(true);

    // Simulación de proceso estocástico (Geometric Brownian Motion simplificado)
    const years = 6; // 2020-2025
    const dt = 1;
    const previewSims = 50; // Mostrar 50 trayectorias en preview

    const trajectories: any = {};
    const bandData: any = {}; // Datos de bandas P10-P90

    shockConfigs.forEach((config) => {
      if (!config.enabled) return;

      trajectories[config.commodity] = [];
      bandData[config.commodity] = [];

      const precioInicial = preciosBase[config.commodity] || 100;

      for (let sim = 0; sim < numSimulaciones; sim++) {
        let price = precioInicial;
        const trajectory = [{ year: 2020, price }];

        for (let t = 1; t < years; t++) {
          const shock = (Math.random() - 0.5) * 2 * config.volatilidad;
          price = price * (1 + shock);
          trajectory.push({ year: 2020 + t, price });
        }

        trajectories[config.commodity].push(trajectory);
      }

      // Calcular bandas P10-P90 para cada año
      for (let t = 0; t < years; t++) {
        const yearPrices = trajectories[config.commodity]
          .map((traj: any) => traj[t].price)
          .sort((a: number, b: number) => a - b);
        const p10 = yearPrices[Math.floor(yearPrices.length * 0.1)];
        const p50 = yearPrices[Math.floor(yearPrices.length * 0.5)];
        const p90 = yearPrices[Math.floor(yearPrices.length * 0.9)];
        const mean =
          yearPrices.reduce((a: number, b: number) => a + b, 0) /
          yearPrices.length;

        bandData[config.commodity].push({
          year: 2020 + t,
          p10,
          p50,
          p90,
          mean,
        });
      }
    });

    // Preparar datos para gráfico (promedio por año)
    const chartData = [];
    for (let t = 0; t < years; t++) {
      const yearData: any = { year: 2020 + t };

      shockConfigs.forEach((config) => {
        if (!config.enabled) return;

        const yearPrices = trajectories[config.commodity].map(
          (traj: any) => traj[t].price
        );
        const avgPrice =
          yearPrices.reduce((a: number, b: number) => a + b, 0) /
          yearPrices.length;
        yearData[config.commodity] = avgPrice;
      });

      chartData.push(yearData);
    }

    setPreviewData(chartData);
    onShocksGenerated({
      trajectories,
      bandData,
      chartData,
      numSimulaciones,
      configs: shockConfigs, // Pasar la configuración de shocks
      preciosBase: preciosBase, // Pasar los precios base
    });

    setTimeout(() => setIsGenerating(false), 500);
  };

  const updateConfig = (
    index: number,
    field: keyof ShockConfig,
    value: any
  ) => {
    const newConfigs = [...shockConfigs];
    (newConfigs[index] as any)[field] = value;
    setShockConfigs(newConfigs);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-[var(--gray-900)] mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-[var(--bolivia-yellow)]" />
          Generación de Shocks Estocásticos
        </h2>
        <p className="text-[var(--gray-600)]">
          Configure los parámetros de incertidumbre para simular fluctuaciones
          en precios de commodities y su impacto en los ingresos fiscales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {shockConfigs.map((config, index) => (
          <div
            key={index}
            className="border-2 border-[var(--gray-200)] rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) =>
                  updateConfig(index, "enabled", e.target.checked)
                }
                className="w-5 h-5 accent-[var(--bolivia-green)]"
              />
              <h4 className="text-[var(--gray-800)]">{config.commodity}</h4>
            </div>

            {config.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[var(--gray-700)] mb-2">
                    Volatilidad (σ)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.5"
                    step="0.01"
                    value={config.volatilidad}
                    onChange={(e) =>
                      updateConfig(
                        index,
                        "volatilidad",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full accent-[var(--bolivia-yellow)]"
                  />
                  <span className="text-[var(--gray-600)]">
                    {(config.volatilidad * 100).toFixed(0)}%
                  </span>
                </div>

                <div>
                  <label className="block text-[var(--gray-700)] mb-2">
                    Precio Base (2020)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--gray-600)] text-sm font-medium">
                      USD
                    </span>
                    <input
                      type="number"
                      value={preciosBase[config.commodity]}
                      onChange={(e) =>
                        setPreciosBase({
                          ...preciosBase,
                          [config.commodity]: parseFloat(e.target.value) || 0,
                        })
                      }
                      step={
                        config.commodity === "Gas Natural"
                          ? "1"
                          : config.commodity === "Plata" ||
                            config.commodity === "Oro"
                          ? "10"
                          : "100"
                      }
                      min="0"
                      className="flex-1 px-3 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bolivia-green)] text-[var(--gray-900)]"
                    />
                  </div>
                  <span className="text-xs text-[var(--gray-500)] mt-1 block">
                    {config.commodity === "Gas Natural"
                      ? "USD/MMBTU"
                      : config.commodity === "Plata" ||
                        config.commodity === "Oro"
                      ? "USD/onza troy"
                      : "USD/tonelada"}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-[var(--gray-700)] mb-2">Iteraciones</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={numSimulaciones}
            onChange={(e) => setNumSimulaciones(parseInt(e.target.value))}
            className="flex-1 accent-[var(--bolivia-green)]"
          />
          <span className="px-4 py-2 bg-[var(--gray-100)] rounded-lg min-w-[120px] text-center">
            {numSimulaciones.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={generateShocks}
        disabled={isGenerating}
        className="flex items-center gap-2 px-6 py-3 bg-[var(--bolivia-yellow)] text-[var(--gray-900)] rounded-lg hover:bg-[var(--yellow-dark)] hover:text-white transition-colors shadow-md disabled:opacity-50 mb-6"
      >
        <TrendingUp className="w-5 h-5" />
        {isGenerating ? "Generando..." : "Generar Shocks Estocásticos"}
      </button>

      {previewData.length > 0 && (
        <div className="border-2 border-[var(--gray-200)] rounded-lg p-6 bg-[var(--gray-50)]">
          <h4 className="text-[var(--gray-800)] mb-4">
            Vista Previa: Trayectorias Esperadas
          </h4>
          <p className="text-[var(--gray-600)] text-sm mb-3">
            Usa el control deslizante en la parte inferior para navegar por los
            años
          </p>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
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
                formatter={(value: any) => `$${Number(value).toFixed(2)}`}
              />
              <Legend />
              {shockConfigs
                .filter((c) => c.enabled)
                .map((config, i) => {
                  const colors = [
                    "#00A878", // Verde - Gas Natural
                    "#3b82f6", // Azul - Zinc
                    "#f59e0b", // Naranja - Plata
                    "#ef4444", // Rojo - Plomo
                    "#8b5cf6", // Púrpura - Estaño
                    "#FFD700", // Dorado - Oro
                  ];
                  return (
                    <Line
                      key={config.commodity}
                      type="monotone"
                      dataKey={config.commodity}
                      stroke={colors[i % colors.length]}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  );
                })}
              <Brush
                dataKey="year"
                height={30}
                stroke="#00A878"
                fill="#f3f4f6"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
