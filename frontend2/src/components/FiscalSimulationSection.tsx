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
        precio_gas_base: preciosBase["Gas Natural"] || 3.5,
        precio_zinc_base: preciosBase["Zinc"] || 2200.0,
        precio_plata_base: preciosBase["Plata"] || 20.0,
        precio_plomo_base: preciosBase["Plomo"] || 1850.0,
        precio_estano_base: preciosBase["Estaño"] || 17000.0,
        precio_oro_base: preciosBase["Oro"] || 1800.0,
        // Enviar si cada commodity está habilitado (enabled)
        gas_habilitado: gasShock?.enabled !== false,
        zinc_habilitado: zincShock?.enabled !== false,
        plata_habilitado: plataShock?.enabled !== false,
        plomo_habilitado: plomoShock?.enabled !== false,
        estano_habilitado: estanoShock?.enabled !== false,
        oro_habilitado: oroShock?.enabled !== false,
        // Ingresos tributarios iniciales (millones Bs)
        ingresos_iva_inicial: parameters.ingresosIvaInicial || 25000,
        ingresos_it_inicial: parameters.ingresosItInicial || 8000,
        ingresos_iue_inicial: parameters.ingresosIueInicial || 7500,
        ingresos_rc_iva_inicial: parameters.ingresosRcIvaInicial || 6500,
        ingresos_ice_inicial: parameters.ingresosIceInicial || 4500,
        ingresos_ga_inicial: parameters.ingresosGaInicial || 3000,
        ingresos_iehd_inicial: parameters.ingresosIehdInicial || 2500,
        ingresos_idh_inicial: parameters.ingresosIdhInicial || 5500,
        // Ingresos no tributarios iniciales (millones Bs)
        ingresos_empresas_publicas_inicial:
          parameters.ingresosEmpresasPublicasInicial || 1800,
        ingresos_donaciones_inicial:
          parameters.ingresosDonacionesInicial || 800,
        // Desglose de gasto corriente (millones Bs)
        sueldos_salarios_inicial: parameters.sueldosSalariosInicial || 28000,
        bienes_servicios_inicial: parameters.bienesServiciosInicial || 18000,
        otros_gastos_corrientes_inicial:
          parameters.otrosGastosCorrientesInicial || 9000,
        // Desglose de transferencias sociales (millones Bs)
        bonos_sociales_inicial: parameters.bonosSocialesInicial || 5000,
        pensiones_inicial: parameters.pensionesInicial || 8000,
        gobiernos_subnacionales_inicial:
          parameters.gobiernosSubnacionalesInicial || 5000,
        otras_transferencias_inicial:
          parameters.otrasTransferenciasInicial || 2000,
        phi_deuda: 0.02,
        n_sim: 1000,
        tipo_cambio: parameters.tipoCambio || 6.96,
        reduccion_subsidios: parameters.subsidyReduction / 100,
        tipo_reduccion:
          parameters.reductionType === "discrete" ? "discreta" : "gradual",
      };

      // Llamar al backend
      const response = await runFiscalSimulation(backendParams);

      if (response.estado === "exito") {
        // Transformar datos del backend al formato del frontend
        const transformedResults = transformSimulationData(response.datos);

        // Si hay reducción de subsidios, ejecutar también simulación base
        if (parameters.subsidyReduction > 0) {
          const baseParams = {
            ...backendParams,
            reduccion_subsidios: 0, // Escenario base sin reducción
          };

          const baseResponse = await runFiscalSimulation(baseParams);

          if (baseResponse.estado === "exito") {
            const baseResults = transformSimulationData(baseResponse.datos);

            // Pasar ambos resultados: base y con reducción
            onSimulationComplete({
              conReduccion: transformedResults,
              base: baseResults,
              tieneComparacion: true,
            });
          }
        } else {
          // Sin reducción, solo pasar resultados normales
          onSimulationComplete({
            conReduccion: transformedResults,
            tieneComparacion: false,
          });
        }

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
          El modelo fiscal estocástico simula la dinámica fiscal de Bolivia para
          el período 2020-2025 mediante 1000 simulaciones Monte Carlo,
          integrando shocks estocásticos en precios de commodities, políticas
          fiscales y reglas automáticas de ajuste. El modelo proyecta:
        </p>
        <ul className="list-disc list-inside text-[var(--gray-600)] space-y-2 ml-4">
          <li>
            <strong>Ingresos Fiscales:</strong> Incluyen commodities (gas, zinc,
            plata, plomo, estaño, oro) con shocks lognormales, ingresos
            tributarios (IVA, IT, IUE, RC-IVA, ICE, GA, IEHD) y no tributarios
            (empresas públicas, donaciones)
          </li>
          <li>
            <strong>Gasto Público:</strong> Compuesto por gasto corriente
            (sueldos, bienes y servicios), transferencias sociales (bonos,
            pensiones, gobiernos subnacionales), inversión pública y subsidios a
            combustibles
          </li>
          <li>
            <strong>Dinámica de Deuda:</strong> Evolución de deuda interna y
            externa con tasas de interés diferenciadas y prima de riesgo
            endógena según ratio deuda/PIB
          </li>
          <li>
            <strong>Reservas Internacionales (RIN):</strong>{" "}
            Acumulación/desacumulación según saldo fiscal y opciones de
            financiamiento
          </li>
          <li>
            <strong>Reglas Fiscales:</strong> Ajustes automáticos de austeridad
            cuando deuda/PIB &gt; 60% o 70%
          </li>
          <li>
            <strong>Inflación Endógena:</strong> Responde a choques de precios
            de commodities, déficit fiscal y variaciones del tipo de cambio
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-[var(--gray-50)] to-[var(--gray-100)] border-2 border-[var(--gray-200)] rounded-lg p-6 mb-6">
        <h4 className="text-[var(--gray-800)] mb-3">
          Ecuaciones Principales del Modelo Fiscal Estocástico
        </h4>
        <div className="space-y-3 text-[var(--gray-700)] text-sm">
          <div className="border-l-4 border-blue-500 pl-3">
            <strong>Ingresos Totales:</strong>
            <div className="font-mono mt-1">
              Ing<sub>t</sub> = Ing_Commodities<sub>t</sub> + Ing_Tributarios
              <sub>t</sub> + Ing_NoTributarios<sub>t</sub>
            </div>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <strong>Ingresos por Commodities (con shocks estocásticos):</strong>
            <div className="font-mono mt-1">
              Ing_Commodity<sub>t</sub> = Ing_Base<sub>0</sub> × (1 + g)
              <sup>t</sup> × exp(ε<sub>t</sub>), &nbsp; ε<sub>t</sub> ~ N(0, σ²)
            </div>
          </div>
          <div className="border-l-4 border-purple-500 pl-3">
            <strong>Gastos Totales:</strong>
            <div className="font-mono mt-1">
              G<sub>t</sub> = GC<sub>t</sub> + TS<sub>t</sub> + IP<sub>t</sub> +
              Sub<sub>t</sub>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              GC = Gasto Corriente, TS = Transferencias Sociales, IP = Inversión
              Pública, Sub = Subsidios
            </div>
          </div>
          <div className="border-l-4 border-red-500 pl-3">
            <strong>Déficit Fiscal:</strong>
            <div className="font-mono mt-1">
              D<sub>t</sub> = G<sub>t</sub> - Ing<sub>t</sub> + Int_Deuda
              <sub>t</sub>
            </div>
          </div>
          <div className="border-l-4 border-yellow-600 pl-3">
            <strong>Dinámica de Deuda:</strong>
            <div className="font-mono mt-1">
              Deuda<sub>t</sub> = Deuda<sub>t-1</sub> + D<sub>t</sub> +
              Prima_Riesgo(Deuda/PIB<sub>t</sub>)
            </div>
          </div>
          <div className="border-l-4 border-indigo-500 pl-3">
            <strong>Regla Fiscal (Austeridad):</strong>
            <div className="font-mono mt-1">
              Si Deuda/PIB<sub>t</sub> &gt; 0.70: GC<sub>t</sub>, TS<sub>t</sub>{" "}
              ÷ 1.015, &nbsp; IP<sub>t</sub> × 0.95
            </div>
            <div className="font-mono mt-1">
              Si Deuda/PIB<sub>t</sub> &gt; 0.60: GC<sub>t</sub>, TS<sub>t</sub>{" "}
              ÷ 1.005, &nbsp; IP<sub>t</sub> × 0.98
            </div>
          </div>
          <div className="border-l-4 border-teal-500 pl-3">
            <strong>Reservas Internacionales:</strong>
            <div className="font-mono mt-1">
              RIN<sub>t</sub> = RIN<sub>t-1</sub> + SuperávitComercial
              <sub>t</sub> - FinanciamientoRIN<sub>t</sub>
            </div>
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
