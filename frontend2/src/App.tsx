import { useState } from "react";
import { Header } from "./components/Header";
import { ParametersSection } from "./components/ParametersSection";
import { StochasticShocksSection } from "./components/StochasticShocksSection";
import { FiscalSimulationSection } from "./components/FiscalSimulationSection";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { DownloadSection } from "./components/DownloadSection";
import { DocumentationSection } from "./components/DocumentationSection";

export default function App() {
  const [activeSection, setActiveSection] = useState("parameters");

  // Estado del modelo
  const [parameters, setParameters] = useState({
    deudaInternaInicial: 69300,
    deudaExternaInicial: 82800,
    rinInicial: 36900,
    tasaCrecimientoPIB: 2.2,
    tasaInteresExterna: 5.1,
    subsidyReduction: 0,
    reductionType: "gradual" as "discrete" | "gradual",
    subsidiosBase: 3000,
    pibInicial: 257600,
    tipoFinanciamiento: "RIN" as "RIN" | "Deuda",
    tasaInteresInterna: 2.5,
    tipoCambio: 6.96,
    // Ingresos tributarios iniciales (millones Bs)
    ingresosIvaInicial: 25000,
    ingresosItInicial: 8000,
    ingresosIueInicial: 7500,
    ingresosRcIvaInicial: 6500,
    ingresosIceInicial: 4500,
    ingresosGaInicial: 3000,
    ingresosIehdInicial: 2500,
    ingresosIdhInicial: 5500,
    // Ingresos no tributarios iniciales (millones Bs)
    ingresosEmpresasPublicasInicial: 1800,
    ingresosDonacionesInicial: 800,
    // Desglose de gasto corriente (millones Bs)
    sueldosSalariosInicial: 28000,
    bienesServiciosInicial: 18000,
    otrosGastosCorrientesInicial: 9000,
    // Desglose de transferencias sociales (millones Bs)
    bonosSocialesInicial: 5000,
    pensionesInicial: 8000,
    gobiernosSubnacionalesInicial: 5000,
    otrasTransferenciasInicial: 2000,
  });

  const [shocks, setShocks] = useState<any>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState<any>(null);

  const renderSection = () => {
    switch (activeSection) {
      case "parameters":
        return (
          <ParametersSection
            parameters={parameters}
            onParametersChange={setParameters}
            onSensitivityAnalyzed={setSensitivityAnalysis}
          />
        );

      case "simulation":
        return (
          <div className="space-y-6">
            <StochasticShocksSection onShocksGenerated={setShocks} />
            <FiscalSimulationSection
              onSimulationComplete={setSimulationResults}
              parameters={parameters}
              shocks={shocks}
            />
          </div>
        );

      case "results":
        return (
          <ResultsDashboard
            results={simulationResults}
            shocks={shocks}
            sensitivityAnalysis={sensitivityAnalysis}
            tipoCambio={parameters.tipoCambio}
          />
        );

      case "downloads":
        return (
          <DownloadSection
            results={simulationResults}
            parameters={parameters}
          />
        );

      case "documentation":
        return <DocumentationSection />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">{renderSection()}</main>

      <footer className="bg-white border-t-2 border-[var(--gray-200)] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[var(--gray-600)] text-center md:text-left">
              <p className="mb-1">
                <strong>Simulador Fiscal Boliviano bajo Incertidumbre</strong> ·
                Modelo 2020–2025
              </p>
              <small className="text-[var(--gray-500)]">
                Herramienta académica para análisis de sostenibilidad fiscal y
                política económica
              </small>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-6 h-6 bg-[var(--bolivia-red)] rounded"></div>
                <div className="w-6 h-6 bg-[var(--bolivia-yellow)] rounded"></div>
                <div className="w-6 h-6 bg-[var(--bolivia-green)] rounded"></div>
              </div>
              <span className="text-[var(--gray-500)]">Bolivia</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
