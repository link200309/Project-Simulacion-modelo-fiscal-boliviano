import { Zap, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ShockConfig {
  commodity: string;
  volatilidad: number;
  valorEsperado: number;
  enabled: boolean;
}

interface StochasticShocksSectionProps {
  onShocksGenerated: (shocks: any) => void;
}

export function StochasticShocksSection({ onShocksGenerated }: StochasticShocksSectionProps) {
  const [numSimulaciones, setNumSimulaciones] = useState(5000);
  const [shockConfigs, setShockConfigs] = useState<ShockConfig[]>([
    { commodity: 'Gas Natural', volatilidad: 0.25, valorEsperado: 50, enabled: true },
    { commodity: 'Minerales', volatilidad: 0.30, valorEsperado: 100, enabled: true }
  ]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShocks = () => {
    setIsGenerating(true);
    
    // Simulación de proceso estocástico (Geometric Brownian Motion simplificado)
    const years = 6; // 2020-2025
    const dt = 1;
    const previewSims = 50; // Mostrar 50 trayectorias en preview
    
    const trajectories: any = {};
    const bandData: any = {}; // Datos de bandas P10-P90
    
    shockConfigs.forEach(config => {
      if (!config.enabled) return;
      
      trajectories[config.commodity] = [];
      bandData[config.commodity] = [];
      
      for (let sim = 0; sim < numSimulaciones; sim++) {
        let price = config.valorEsperado;
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
        const yearPrices = trajectories[config.commodity].map((traj: any) => traj[t].price).sort((a: number, b: number) => a - b);
        const p10 = yearPrices[Math.floor(yearPrices.length * 0.1)];
        const p50 = yearPrices[Math.floor(yearPrices.length * 0.5)];
        const p90 = yearPrices[Math.floor(yearPrices.length * 0.9)];
        const mean = yearPrices.reduce((a: number, b: number) => a + b, 0) / yearPrices.length;

        bandData[config.commodity].push({
          year: 2020 + t,
          p10,
          p50,
          p90,
          mean
        });
      }
    });
    
    // Preparar datos para gráfico (promedio por año)
    const chartData = [];
    for (let t = 0; t < years; t++) {
      const yearData: any = { year: 2020 + t };
      
      shockConfigs.forEach(config => {
        if (!config.enabled) return;
        
        const yearPrices = trajectories[config.commodity].map((traj: any) => traj[t].price);
        const avgPrice = yearPrices.reduce((a: number, b: number) => a + b, 0) / yearPrices.length;
        yearData[config.commodity] = avgPrice;
      });
      
      chartData.push(yearData);
    }
    
    setPreviewData(chartData);
    onShocksGenerated({ trajectories, bandData, chartData, numSimulaciones });
    
    setTimeout(() => setIsGenerating(false), 500);
  };

  const updateConfig = (index: number, field: keyof ShockConfig, value: any) => {
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
          Configure los parámetros de incertidumbre para simular fluctuaciones en precios de commodities y su impacto en los ingresos fiscales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {shockConfigs.map((config, index) => (
          <div key={index} className="border-2 border-[var(--gray-200)] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateConfig(index, 'enabled', e.target.checked)}
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
                    onChange={(e) => updateConfig(index, 'volatilidad', parseFloat(e.target.value))}
                    className="w-full accent-[var(--bolivia-yellow)]"
                  />
                  <span className="text-[var(--gray-600)]">{(config.volatilidad * 100).toFixed(0)}%</span>
                </div>
                
                <div>
                  <label className="block text-[var(--gray-700)] mb-2">
                    Valor Esperado (USD)
                  </label>
                  <input
                    type="number"
                    value={config.valorEsperado}
                    onChange={(e) => updateConfig(index, 'valorEsperado', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-[var(--gray-300)] rounded-lg focus:outline-none focus:border-[var(--bolivia-green)]"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-[var(--gray-700)] mb-2">
          Iteraciones
        </label>
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
        {isGenerating ? 'Generando...' : 'Generar Shocks Estocásticos'}
      </button>

      {previewData.length > 0 && (
        <div className="border-2 border-[var(--gray-200)] rounded-lg p-6 bg-[var(--gray-50)]">
          <h4 className="text-[var(--gray-800)] mb-4">Vista Previa: Trayectorias Esperadas</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
              <XAxis dataKey="year" stroke="var(--gray-600)" />
              <YAxis stroke="var(--gray-600)" label={{ value: 'Precio (USD)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--gray-900)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Legend />
              {shockConfigs.filter(c => c.enabled).map((config, i) => (
                <Line 
                  key={config.commodity}
                  type="monotone" 
                  dataKey={config.commodity} 
                  stroke={i === 0 ? 'var(--bolivia-green)' : 'var(--bolivia-yellow)'} 
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}