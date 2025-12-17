import { Play, Loader, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface FiscalSimulationSectionProps {
  onSimulationComplete: (results: any) => void;
  parameters: any;
  shocks: any;
}

export function FiscalSimulationSection({ onSimulationComplete, parameters, shocks }: FiscalSimulationSectionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setCompleted(false);

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulación del modelo fiscal
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generar resultados simulados
    const years = [2020, 2021, 2022, 2023, 2024, 2025];
    const numSims = 5000;
    
    // Inicializar resultados
    const deudaTotal: any[] = [];
    const deudaPIB: any[] = [];
    const rin: any[] = [];
    const deficitFiscal: any[] = [];
    
    for (let year of years) {
      const yearIndex = year - 2020;
      
      // Simular múltiples escenarios
      const debtSims = [];
      const debtGDPSims = [];
      const rinSims = [];
      const deficitSims = [];
      
      for (let s = 0; s < numSims; s++) {
        // Modelo simplificado con componentes estocásticos
        const shockFactor = 1 + (Math.random() - 0.5) * 0.3;
        const gdpGrowth = parameters.tasaCrecimientoPIB / 100;
        
        // Deuda acumulativa con intereses
        const debt = (parameters.deudaInternaInicial + parameters.deudaExternaInicial) * 
                     Math.pow(1 + parameters.tasaInteresExterna / 100, yearIndex) * 
                     shockFactor;
        
        // PIB con crecimiento
        const gdp = 40000 * Math.pow(1 + gdpGrowth, yearIndex); // PIB base 40,000 millones
        
        // RIN con fluctuaciones
        const rinValue = parameters.rinInicial * (1 - yearIndex * 0.08) * shockFactor;
        
        // Déficit como % del PIB
        const deficit = -3 - yearIndex * 0.5 + (Math.random() - 0.5) * 2;
        
        debtSims.push(debt);
        debtGDPSims.push((debt / gdp) * 100);
        rinSims.push(Math.max(rinValue, 1000)); // Mínimo 1000
        deficitSims.push(deficit);
      }
      
      // Calcular percentiles
      const sortedDebt = [...debtSims].sort((a, b) => a - b);
      const sortedDebtGDP = [...debtGDPSims].sort((a, b) => a - b);
      const sortedRIN = [...rinSims].sort((a, b) => a - b);
      const sortedDeficit = [...deficitSims].sort((a, b) => a - b);
      
      const p10 = (arr: number[]) => arr[Math.floor(arr.length * 0.1)];
      const p50 = (arr: number[]) => arr[Math.floor(arr.length * 0.5)];
      const p90 = (arr: number[]) => arr[Math.floor(arr.length * 0.9)];
      const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      
      deudaTotal.push({
        year,
        mean: mean(debtSims),
        p10: p10(sortedDebt),
        p50: p50(sortedDebt),
        p90: p90(sortedDebt)
      });
      
      deudaPIB.push({
        year,
        mean: mean(debtGDPSims),
        p10: p10(sortedDebtGDP),
        p50: p50(sortedDebtGDP),
        p90: p90(sortedDebtGDP)
      });
      
      rin.push({
        year,
        mean: mean(rinSims),
        p10: p10(sortedRIN),
        p50: p50(sortedRIN),
        p90: p90(sortedRIN)
      });
      
      deficitFiscal.push({
        year,
        mean: mean(deficitSims),
        p10: p10(sortedDeficit),
        p50: p50(sortedDeficit),
        p90: p90(sortedDeficit),
        distribution: sortedDeficit
      });
    }
    
    const results = {
      deudaTotal,
      deudaPIB,
      rin,
      deficitFiscal,
      numSimulaciones: numSims
    };
    
    onSimulationComplete(results);
    setIsRunning(false);
    setCompleted(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      {/* CORRECCIÓN 7: Texto de guía de flujo */}
      <div className="bg-green-50 border-2 border-[var(--bolivia-green)] rounded-lg p-4 mb-6">
        <h4 className="text-[var(--gray-900)] mb-2"> Paso Final: Ejecutar Simulación Completa</h4>
        <p className="text-[var(--gray-700)] text-sm">
          Una vez configurados los parámetros, definida la política fiscal y generados los shocks estocásticos, 
          ejecute la simulación fiscal completa para obtener los resultados integrados que incluyen todas las variables del modelo.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-[var(--gray-900)] mb-2">Simulación de Escenarios Fiscales</h2>
        <p className="text-[var(--gray-600)] mb-4">
          El modelo fiscal integra parámetros macroeconómicos, shocks estocásticos y políticas fiscales dentro de un único escenario de simulación. Ejecute el modelo completo en el horizonte 2020–2025 incorporando:
        </p>
        <ul className="list-disc list-inside text-[var(--gray-600)] space-y-2 ml-4">
          <li>Ingresos por exportación de commodities con shocks estocásticos (gas natural y minerales)</li>
          <li>Recaudación tributaria interna (IVA, IT, RC-IVA)</li>
          <li>Gasto público corriente ajustado por política de subsidios</li>
          <li>Servicio de deuda interna y externa</li>
          <li>Evolución de las Reservas Internacionales Netas (RIN)</li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-[var(--gray-50)] to-[var(--gray-100)] border-2 border-[var(--gray-200)] rounded-lg p-6 mb-6">
        <h4 className="text-[var(--gray-800)] mb-3">Ecuaciones Principales del Modelo</h4>
        <div className="space-y-2 text-[var(--gray-700)] font-mono text-sm">
          <div>Ingresos<sub>t</sub> = Ing_Commodities<sub>t</sub> + Ing_Tributarios<sub>t</sub></div>
          <div>Gastos<sub>t</sub> = Gasto_Base<sub>t</sub> - Ahorro_Subsidios<sub>t</sub></div>
          <div>Déficit<sub>t</sub> = Ingresos<sub>t</sub> - Gastos<sub>t</sub> - Servicio_Deuda<sub>t</sub></div>
          <div>Deuda<sub>t</sub> = Deuda<sub>t-1</sub> × (1 + r) - Déficit<sub>t</sub></div>
          <div>RIN<sub>t</sub> = RIN<sub>t-1</sub> + Saldo_Cuenta_Corriente<sub>t</sub></div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={runSimulation}
          disabled={isRunning || completed}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--bolivia-red)] to-[var(--bolivia-yellow)] text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              Ejecutando Simulación Fiscal...
            </>
          ) : completed ? (
            <>
              <CheckCircle className="w-6 h-6" />
              Simulación Completada
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Ejecutar Simulación Fiscal
            </>
          )}
        </button>

        {isRunning && (
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--gray-600)]">Progreso</span>
              <span className="text-[var(--bolivia-green)]">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-[var(--gray-200)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--bolivia-green)] to-[var(--bolivia-yellow)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {completed && (
          <div className="bg-green-50 border-2 border-[var(--bolivia-green)] rounded-lg p-4 text-center">
            <p className="text-[var(--bolivia-green)]">
              ✓ Simulación completada exitosamente. Diríjase a la sección "Resultados" para visualizar los datos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}