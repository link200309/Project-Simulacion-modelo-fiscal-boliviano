import { Save, Info, Sliders, BarChart3, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Parameters {
  deudaInternaInicial: number;
  deudaExternaInicial: number;
  rinInicial: number;
  tasaCrecimientoPIB: number;
  tasaInteresExterna: number;
  subsidyReduction: number;
  reductionType: 'discrete' | 'gradual';
  subsidiosBase: number;
}

interface ParametersSectionProps {
  parameters: Parameters;
  onParametersChange: (params: Parameters) => void;
  onSensitivityAnalyzed?: (analysis: any) => void;
}

export function ParametersSection({ parameters, onParametersChange, onSensitivityAnalyzed }: ParametersSectionProps) {
  const [localParams, setLocalParams] = useState(parameters);
  const [saved, setSaved] = useState(false);
  const [sensitivityResults, setSensitivityResults] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSave = () => {
    onParametersChange(localParams);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const parameterFields = [
    {
      key: 'deudaInternaInicial' as keyof Parameters,
      label: 'Deuda Inicial Interna',
      unit: 'millones USD',
      help: 'Deuda pública interna al inicio del período (2020)',
      color: 'red'
    },
    {
      key: 'deudaExternaInicial' as keyof Parameters,
      label: 'Deuda Inicial Externa',
      unit: 'millones USD',
      help: 'Deuda pública externa al inicio del período (2020)',
      color: 'red'
    },
    {
      key: 'rinInicial' as keyof Parameters,
      label: 'Reservas Internacionales Netas (RIN)',
      unit: 'millones USD',
      help: 'Reservas internacionales netas iniciales',
      color: 'green'
    },
    {
      key: 'tasaCrecimientoPIB' as keyof Parameters,
      label: 'Tasa de Crecimiento Base del PIB',
      unit: '%',
      help: 'Tasa de crecimiento económico esperada anual',
      color: 'yellow'
    },
    {
      key: 'tasaInteresExterna' as keyof Parameters,
      label: 'Tasa de Interés Deuda Externa',
      unit: '%',
      help: 'Tasa de interés promedio para deuda externa',
      color: 'yellow'
    }
  ];

  // CORRECCIÓN 1 y 2: Solo cálculos necesarios sin gasto corriente base
  const ahorroAnual = localParams.subsidiosBase * (localParams.subsidyReduction / 100);
  const PIB_BASE = 40000; // Usado solo para calcular % del PIB
  const impactoDeficitPIB = (ahorroAnual / PIB_BASE) * 100;

  // CORRECCIÓN 2 y 3: Análisis de impacto simplificado
  const analyzeImpact = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const years = [2020, 2021, 2022, 2023, 2024, 2025];
      
      // CORRECCIÓN 3: Solo datos para comparación de escenarios
      const escenarioComparison = [];
      const trayectoriaReduccion = [];

      for (let i = 0; i < years.length; i++) {
        const year = years[i];
        let ahorroYear = 0;
        let porcentajeAplicado = 0;

        // Cálculo según tipo de reducción
        if (localParams.reductionType === 'discrete') {
          ahorroYear = ahorroAnual;
          porcentajeAplicado = localParams.subsidyReduction;
        } else {
          // Gradual: incremento lineal en 5 años
          const factor = Math.min((i + 1) / 5, 1);
          ahorroYear = ahorroAnual * factor;
          porcentajeAplicado = localParams.subsidyReduction * factor;
        }

        // Comparación de escenarios (sin reducción vs con reducción)
        escenarioComparison.push({
          year,
          escenarioBase: localParams.subsidiosBase,
          escenarioConReduccion: localParams.subsidiosBase - ahorroYear,
          ahorro: ahorroYear
        });

        // Trayectoria de reducción
        trayectoriaReduccion.push({
          year,
          porcentajeReduccion: porcentajeAplicado,
          subsidiosResultante: localParams.subsidiosBase - ahorroYear,
          ahorroAnual: ahorroYear
        });
      }

      const results = {
        escenarioComparison,
        trayectoriaReduccion,
        tipo: localParams.reductionType,
        ahorroTotal: trayectoriaReduccion.reduce((acc, t) => acc + t.ahorroAnual, 0)
      };

      setSensitivityResults(results);
      if (onSensitivityAnalyzed) {
        onSensitivityAnalyzed(results);
      }
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Guía de flujo */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-6">
        <h3 className="text-[var(--gray-900)] mb-3"> Guía de Uso del Simulador</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="bg-[var(--bolivia-green)] text-white px-2 py-1 rounded">1</span>
            <div>
              <div className="text-[var(--gray-900)]">Configure parámetros iniciales y política fiscal</div>
              <small className="text-[var(--gray-600)]">Defina valores base del modelo</small>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-[var(--bolivia-yellow)] text-[var(--gray-900)] px-2 py-1 rounded">2</span>
            <div>
              <div className="text-[var(--gray-900)]">Analice impacto parcial (opcional)</div>
              <small className="text-[var(--gray-600)]">Visualice efecto de subsidios</small>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-[var(--bolivia-red)] text-white px-2 py-1 rounded">3</span>
            <div>
              <div className="text-[var(--gray-900)]">Ejecute simulación completa</div>
              <small className="text-[var(--gray-600)]">Obtenga resultados finales</small>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-[var(--gray-900)] mb-2">Configuración de Parámetros Iniciales</h2>
          <p className="text-[var(--gray-600)]">
            Defina los parámetros estructurales del modelo fiscal boliviano. Estos valores iniciales servirán como base para las simulaciones estocásticas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {parameterFields.map(field => (
            <div key={field.key} className="space-y-2">
              <label className="flex items-center gap-2 text-[var(--gray-700)]">
                {field.label}
                <div className="group relative">
                  <Info className="w-4 h-4 text-[var(--gray-400)] cursor-help" />
                  <div className="absolute left-0 top-6 w-64 p-3 bg-[var(--gray-900)] text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <small>{field.help}</small>
                  </div>
                </div>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={localParams[field.key] as number}
                  onChange={(e) => setLocalParams({ ...localParams, [field.key]: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-[var(--gray-300)] rounded-lg focus:outline-none focus:border-[var(--bolivia-green)] transition-colors"
                  step={field.unit === '%' ? '0.1' : '100'}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gray-500)]">
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CORRECCIÓN 1-4: Subsección de Política Fiscal corregida */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="mb-6">
          <h3 className="text-[var(--gray-900)] mb-2 flex items-center gap-3">
            <Sliders className="w-7 h-7 text-[var(--bolivia-red)]" />
            Política Fiscal – Subsidios a Combustibles
          </h3>
          <p className="text-[var(--gray-600)] mb-3">
            Configure la política de reducción de subsidios a combustibles que se aplicará durante la simulación fiscal.
          </p>
          
          {/* CORRECCIÓN 1: Explicación del modelo sin gasto corriente base */}
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mb-4">
            <h4 className="text-[var(--gray-900)] mb-2"> Análisis de Variaciones Marginales</h4>
            <div className="space-y-2 font-mono text-sm text-[var(--gray-700)]">
              <div><strong>Ahorro_Subsidios</strong> = Subsidios_Base × (Porcentaje_Reducción / 100)</div>
              <div><strong>Impacto_Déficit</strong> = (Ahorro_Subsidios / PIB) × 100</div>
              <div className="text-xs text-[var(--gray-600)] mt-2">
                 
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            {/* CORRECCIÓN 4: Slider para estimación base de subsidios */}
            <div>
              <label className="block text-[var(--gray-700)] mb-3">
                Estimación Base de Subsidios a Combustibles
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={localParams.subsidiosBase}
                  onChange={(e) => setLocalParams({ ...localParams, subsidiosBase: parseInt(e.target.value) })}
                  className="flex-1 accent-[var(--bolivia-yellow)]"
                />
                <div className="min-w-[120px] text-center">
                  <div className="px-4 py-2 bg-[var(--bolivia-yellow)] text-[var(--gray-900)] rounded-lg">
                    ${localParams.subsidiosBase} M
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[var(--gray-700)] mb-3">
                Porcentaje de Reducción de Subsidios
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={localParams.subsidyReduction}
                  onChange={(e) => setLocalParams({ ...localParams, subsidyReduction: parseInt(e.target.value) })}
                  className="flex-1 accent-[var(--bolivia-red)]"
                />
                <div className="min-w-[80px] text-center">
                  <div className="px-4 py-2 bg-[var(--bolivia-red)] text-white rounded-lg">
                    {localParams.subsidyReduction}%
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[var(--gray-700)] mb-3">
                Tipo de Reducción
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-[var(--gray-300)] rounded-lg cursor-pointer hover:border-[var(--bolivia-green)] transition-colors">
                  <input
                    type="radio"
                    name="reductionType"
                    value="discrete"
                    checked={localParams.reductionType === 'discrete'}
                    onChange={(e) => setLocalParams({ ...localParams, reductionType: e.target.value as 'discrete' })}
                    className="w-5 h-5 accent-[var(--bolivia-green)]"
                  />
                  <div>
                    <div className="text-[var(--gray-800)]">Reducción Discreta</div>
                    <small className="text-[var(--gray-600)]">Aplicar el recorte de forma inmediata desde 2020</small>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border-2 border-[var(--gray-300)] rounded-lg cursor-pointer hover:border-[var(--bolivia-green)] transition-colors">
                  <input
                    type="radio"
                    name="reductionType"
                    value="gradual"
                    checked={localParams.reductionType === 'gradual'}
                    onChange={(e) => setLocalParams({ ...localParams, reductionType: e.target.value as 'gradual' })}
                    className="w-5 h-5 accent-[var(--bolivia-green)]"
                  />
                  <div>
                    <div className="text-[var(--gray-800)]">Reducción Gradual</div>
                    <small className="text-[var(--gray-600)]">Distribuir el recorte linealmente en 5 años</small>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* CORRECCIÓN 2: Solo métricas permitidas */}
          <div className="bg-[var(--gray-50)] border-2 border-[var(--gray-200)] rounded-lg p-6">
            <h4 className="text-[var(--gray-800)] mb-4">Estimación de Impacto Fiscal</h4>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-[var(--gray-600)] mb-1">Subsidios Base Configurados</div>
                <div className="text-[var(--gray-900)] text-2xl">${localParams.subsidiosBase.toLocaleString()} M</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <div className="text-[var(--gray-600)] mb-1">Ahorro Fiscal Anual Proyectado</div>
                <div className="text-[var(--bolivia-green)] text-2xl">${ahorroAnual.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} M</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <div className="text-[var(--gray-600)] mb-1">Impacto Estimado en el Déficit Fiscal</div>
                <div className="text-[var(--bolivia-yellow)] text-2xl">
                  +{impactoDeficitPIB.toFixed(2)}% PIB
                </div>
                <small className="text-[var(--gray-500)]">Mejora en el balance fiscal</small>
              </div>
            </div>
          </div>
        </div>

        {/* CORRECCIÓN 2: Botón Analizar Impacto */}
        <div className="mb-6">
          <button
            onClick={analyzeImpact}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--bolivia-yellow)] to-[var(--bolivia-red)] text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BarChart3 className={`w-5 h-5 ${analyzing ? 'animate-pulse' : ''}`} />
            {analyzing ? 'Analizando...' : 'Analizar Impacto de Política Fiscal'}
          </button>
          
          {/* CORRECCIÓN 5: Texto aclaratorio */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mt-4">
            <p className="text-[var(--gray-700)] text-sm">
              ℹ️ Este análisis muestra el impacto fiscal estimado de la política de subsidios. Los resultados finales del modelo se obtienen al ejecutar la simulación fiscal completa.
            </p>
          </div>
        </div>

        {/* CORRECCIÓN 3: Solo gráficas permitidas */}
        {sensitivityResults && (
          <div className="space-y-6 border-t-2 border-[var(--gray-200)] pt-6">
            <h4 className="text-[var(--gray-900)] flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-[var(--bolivia-green)]" />
              Resultados del Análisis de Sensibilidad
            </h4>

            {/* Gráfica 1: Comparación de Escenarios */}
            <div className="bg-[var(--gray-50)] rounded-lg p-6">
              <h5 className="text-[var(--gray-800)] mb-4">Comparación de Escenarios: Base vs Con Reducción</h5>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sensitivityResults.escenarioComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
                  <XAxis dataKey="year" stroke="var(--gray-600)" />
                  <YAxis stroke="var(--gray-600)" label={{ value: 'Subsidios (Millones USD)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--gray-900)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                    formatter={(value: any) => `$${value.toLocaleString()} M`}
                  />
                  <Legend />
                  <Bar dataKey="escenarioBase" name="Escenario Base (Sin Reducción)" fill="#D72638" />
                  <Bar dataKey="escenarioConReduccion" name="Escenario con Reducción" fill="#00A878" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[var(--gray-600)] text-center mt-3 text-sm">
                Ahorro total proyectado (2020-2025): <strong className="text-[var(--bolivia-green)]">${sensitivityResults.ahorroTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} M</strong>
              </p>
            </div>

            {/* Gráfica 2: Trayectoria de Reducción */}
            <div className="bg-[var(--gray-50)] rounded-lg p-6">
              <h5 className="text-[var(--gray-800)] mb-4">
                Trayectoria de Reducción - Tipo: {sensitivityResults.tipo === 'discrete' ? 'Discreta' : 'Gradual (5 años)'}
              </h5>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={sensitivityResults.trayectoriaReduccion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-300)" />
                  <XAxis dataKey="year" stroke="var(--gray-600)" />
                  <YAxis 
                    yAxisId="left"
                    stroke="var(--gray-600)" 
                    label={{ value: 'Porcentaje de Reducción (%)', angle: -90, position: 'insideLeft' }} 
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--gray-600)" 
                    label={{ value: 'Ahorro Anual (M USD)', angle: 90, position: 'insideRight' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--gray-900)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="porcentajeReduccion" 
                    name="% Reducción Aplicado" 
                    stroke="#FFC857" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="ahorroAnual" 
                    name="Ahorro Anual" 
                    stroke="#00A878" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[var(--gray-600)] text-center mt-3 text-sm">
                {sensitivityResults.tipo === 'discrete' 
                  ? 'La reducción se aplica completamente desde el año inicial (2020)' 
                  : 'La reducción se distribuye linealmente en 5 años, alcanzando el 100% en 2024'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón de guardar */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--bolivia-green)] text-white rounded-lg hover:bg-[var(--green-dark)] transition-colors shadow-md"
          >
            <Save className="w-5 h-5" />
            Guardar Parámetros y Política Fiscal
          </button>
          {saved && (
            <span className="text-[var(--bolivia-green)] flex items-center gap-2">
              ✓ Configuración guardada correctamente
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
