import { Play, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { runFiscalSimulation, transformSimulationData } from "../services/api";

interface FiscalSimulationSectionProps {
  onSimulationComplete: (results: any) => void;
  parameters: any;
  shocks: any;
}

export function FiscalSimulationSection({
  onSimulationComplete,
  parameters,
  shocks,
}: FiscalSimulationSectionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setCompleted(false);
    setError(null);

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Obtener parámetros de shocks desde el objeto shocks si está disponible
      const gasShock = shocks?.configs?.find((c: any) =>
        c.commodity.includes("Gas")
      );
      const zincShock = shocks?.configs?.find(
        (c: any) => c.commodity === "Zinc"
      );
      const plataShock = shocks?.configs?.find(
        (c: any) => c.commodity === "Plata"
      );
      const plomoShock = shocks?.configs?.find(
        (c: any) => c.commodity === "Plomo"
      );
      const estanoShock = shocks?.configs?.find(
        (c: any) => c.commodity === "Estaño"
      );
      const oroShock = shocks?.configs?.find((c: any) => c.commodity === "Oro");

      // Obtener precios base desde shocks
      const preciosBase = shocks?.preciosBase || {};

      // Preparar parámetros para el backend
      const backendParams = {
        deuda_interna: parameters.deudaInternaInicial,
        deuda_externa: parameters.deudaExternaInicial,
        rin_inicial: parameters.rinInicial,
        tasa_crecimiento_pib: parameters.tasaCrecimientoPIB / 100,
        tasa_interes_deuda_externa: parameters.tasaInteresExterna / 100,
        tasa_interes_deuda_interna:
          (parameters.tasaInteresInterna || 2.5) / 100,
        pib_inicial: parameters.pibInicial || 257600,
        tipo_financiamiento: parameters.tipoFinanciamiento || "Deuda",
        sigma_gas: gasShock?.volatilidad || 0.2,
        sigma_zinc: zincShock?.volatilidad || 0.25,
        sigma_plata: plataShock?.volatilidad || 0.3,
        sigma_plomo: plomoShock?.volatilidad || 0.22,
        sigma_estano: estanoShock?.volatilidad || 0.28,
        sigma_oro: oroShock?.volatilidad || 0.18,
        precio_gas_base: preciosBase["Gas Natural"] || 55.0,
        precio_zinc_base: preciosBase["Zinc"] || 2200.0,
        precio_plata_base: preciosBase["Plata"] || 20.0,
        precio_plomo_base: preciosBase["Plomo"] || 1850.0,
        precio_estano_base: preciosBase["Estaño"] || 17000.0,
        precio_oro_base: preciosBase["Oro"] || 1800.0,
        phi_deuda: 0.02,
        n_sim: 1000,
        reduccion_subsidios: parameters.subsidyReduction / 100,
        tipo_reduccion:
          parameters.reductionType === "discrete" ? "discreta" : "gradual",
      };

      // Llamar al backend
      const response = await runFiscalSimulation(backendParams);

      if (response.estado === "exito") {
        // Transformar datos del backend al formato del frontend
        const transformedResults = transformSimulationData(response.datos);
        onSimulationComplete(transformedResults);
        setCompleted(true);
      } else {
        throw new Error("Error en la simulación del backend");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido en la simulación";
      setError(errorMessage);
      console.error("Simulation error:", err);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      {/* CORRECCIÓN 7: Texto de guía de flujo */}
      <div className="bg-green-50 border-2 border-[var(--bolivia-green)] rounded-lg p-4 mb-6">
        <h4 className="text-[var(--gray-900)] mb-2">
          {" "}
          Paso Final: Ejecutar Simulación Completa
        </h4>
        <p className="text-[var(--gray-700)] text-sm">
          Una vez configurados los parámetros, definida la política fiscal y
          generados los shocks estocásticos, ejecute la simulación fiscal
          completa para obtener los resultados integrados que incluyen todas las
          variables del modelo.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-[var(--gray-900)] mb-2">
          Simulación de Escenarios Fiscales
        </h2>
        <p className="text-[var(--gray-600)] mb-4">
          El modelo fiscal integra parámetros macroeconómicos, shocks
          estocásticos y políticas fiscales dentro de un único escenario de
          simulación. Ejecute el modelo completo en el horizonte 2020–2025
          incorporando:
        </p>
        <ul className="list-disc list-inside text-[var(--gray-600)] space-y-2 ml-4">
          <li>
            Ingresos por exportación de commodities (gas natural y minerales)
            con shocks estocásticos configurados en la sección anterior
          </li>
          <li>
            Ingresos fiscales no relacionados con commodities (tributarios y
            otros)
          </li>
          <li>
            Gasto público corriente más subsidios a combustibles ajustados por
            política fiscal
          </li>
          <li>Servicio de deuda interna y externa con primas de riesgo</li>
          <li>Evolución de las Reservas Internacionales Netas (RIN)</li>
          <li>Reglas fiscales automáticas según ratio deuda/PIB</li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-[var(--gray-50)] to-[var(--gray-100)] border-2 border-[var(--gray-200)] rounded-lg p-6 mb-6">
        <h4 className="text-[var(--gray-800)] mb-3">
          Ecuaciones Principales del Modelo
        </h4>
        <div className="space-y-2 text-[var(--gray-700)] font-mono text-sm">
          <div>
            Ing_Minerales<sub>t</sub> = Ing_Zinc<sub>t</sub> + Ing_Plata
            <sub>t</sub> + Ing_Plomo<sub>t</sub> + Ing_Estaño<sub>t</sub>
          </div>
          <div>
            Ing_Zinc<sub>t</sub> = Ing_Zinc<sub>0</sub> × (1 + g)<sup>t</sup> ×
            Shock_Zinc<sub>t</sub>
          </div>
          <div>
            Ingresos<sub>t</sub> = Ing_NoCommodities<sub>t</sub> + Ing_Gas
            <sub>t</sub> + Ing_Minerales
            <sub>t</sub>
          </div>
          <div>
            Gastos<sub>t</sub> = Gasto_Base<sub>t</sub> + Subsidios<sub>t</sub>
          </div>
          <div>
            Déficit_Primario<sub>t</sub> = Gastos<sub>t</sub> - Ingresos
            <sub>t</sub>
          </div>
          <div>
            Déficit_Total<sub>t</sub> = Déficit_Primario<sub>t</sub> + Intereses
            <sub>t</sub>
          </div>
          <div>
            Deuda<sub>t</sub> = Deuda<sub>t-1</sub> + Nueva_Deuda<sub>t</sub>
          </div>
          <div>
            RIN<sub>t</sub> = RIN<sub>t-1</sub> + Saldo_Cuenta_Corriente
            <sub>t</sub> - Financiamiento_RIN<sub>t</sub>
          </div>
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

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-semibold">
                Error en la Simulación
              </p>
              <p className="text-red-600 text-sm">{error}</p>
              <p className="text-red-600 text-xs mt-2">
                Asegúrese de que el backend está ejecutándose en
                http://localhost:5000
              </p>
            </div>
          </div>
        )}

        {completed && !error && (
          <div className="bg-green-50 border-2 border-[var(--bolivia-green)] rounded-lg p-4 text-center">
            <p className="text-[var(--bolivia-green)]">
              ✓ Simulación completada exitosamente. Diríjase a la sección
              "Resultados" para visualizar los datos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
