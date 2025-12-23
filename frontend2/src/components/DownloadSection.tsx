import { Download, FileSpreadsheet, FileText, CheckSquare } from "lucide-react";
import { useState } from "react";

interface DownloadSectionProps {
  results: any;
  parameters: any;
}

export function DownloadSection({ results, parameters }: DownloadSectionProps) {
  const [selectedVariables, setSelectedVariables] = useState({
    deudaTotal: true,
    deudaPIB: true,
    rin: true,
    deficitFiscal: true,
  });

  // Extraer datos correctos según la estructura de results
  const datosParaDescarga = results?.conReduccion || results;
  const tieneComparacion = results?.tieneComparacion || false;

  const toggleVariable = (variable: keyof typeof selectedVariables) => {
    setSelectedVariables((prev) => ({
      ...prev,
      [variable]: !prev[variable],
    }));
  };

  const downloadCSV = () => {
    if (!datosParaDescarga) return;

    let csvContent = "Year,Variable,Mean,P10,P50,P90\n";

    const variableMap = {
      deudaTotal: "Deuda Total (M USD)",
      deudaPIB: "Deuda/PIB (%)",
      rin: "RIN (M USD)",
      deficitFiscal: "Deficit Fiscal (% PIB)",
    };

    Object.entries(selectedVariables).forEach(([key, selected]) => {
      if (selected && datosParaDescarga[key]) {
        datosParaDescarga[key].forEach((row: any) => {
          csvContent += `${row.year},${
            variableMap[key as keyof typeof variableMap]
          },${row.mean},${row.p10},${row.p50},${row.p90}\n`;
        });
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulacion_fiscal_boliviana.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    // En una implementación real, se usaría una librería como xlsx
    // Por ahora, usar CSV como alternativa
    downloadCSV();
  };

  const downloadParameters = () => {
    if (!parameters) return;

    const jsonContent = JSON.stringify(parameters, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parametros_simulacion.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const hasResults = datosParaDescarga && datosParaDescarga.deudaTotal;

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-[var(--gray-900)] mb-2">
          Descarga de Datos y Resultados
        </h2>
        <p className="text-[var(--gray-600)]">
          Exporte los resultados de las simulaciones en formatos estructurados
          para análisis posteriores en Python, R, Excel u otras herramientas.
        </p>
      </div>

      {!hasResults ? (
        <div className="bg-yellow-50 border-2 border-[var(--bolivia-yellow)] rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-[var(--bolivia-yellow)] mx-auto mb-3" />
          <p className="text-[var(--gray-700)]">
            No hay resultados disponibles para descargar. Ejecute primero la
            simulación fiscal.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selector de variables */}
          <div className="border-2 border-[var(--gray-200)] rounded-lg p-6">
            <h4 className="text-[var(--gray-800)] mb-4">
              Seleccionar Variables para Exportar
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(selectedVariables).map(([key, selected]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-4 border-2 border-[var(--gray-300)] rounded-lg cursor-pointer hover:border-[var(--bolivia-green)] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      toggleVariable(key as keyof typeof selectedVariables)
                    }
                    className="w-5 h-5 accent-[var(--bolivia-green)]"
                  />
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[var(--bolivia-green)]" />
                    <span className="text-[var(--gray-800)]">
                      {key === "deudaTotal" && "Deuda Pública Total"}
                      {key === "deudaPIB" && "Ratio Deuda/PIB"}
                      {key === "rin" && "Reservas Internacionales Netas"}
                      {key === "deficitFiscal" && "Déficit Fiscal"}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Botones de descarga */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={downloadCSV}
              disabled={!Object.values(selectedVariables).some((v) => v)}
              className="flex items-center justify-center gap-3 p-6 bg-[var(--bolivia-green)] text-white rounded-lg hover:bg-[var(--green-dark)] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-6 h-6" />
              <div className="text-left">
                <div>Descargar CSV</div>
                <small className="opacity-90">Formato estándar de datos</small>
              </div>
            </button>

            <button
              onClick={downloadExcel}
              disabled={!Object.values(selectedVariables).some((v) => v)}
              className="flex items-center justify-center gap-3 p-6 bg-[var(--bolivia-yellow)] text-[var(--gray-900)] rounded-lg hover:bg-[var(--yellow-dark)] hover:text-white transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-6 h-6" />
              <div className="text-left">
                <div>Descargar Excel</div>
                <small className="opacity-90">Compatible con MS Excel</small>
              </div>
            </button>

            <button
              onClick={downloadParameters}
              className="flex items-center justify-center gap-3 p-6 bg-[var(--bolivia-red)] text-white rounded-lg hover:bg-[var(--red-dark)] transition-colors shadow-md"
            >
              <Download className="w-6 h-6" />
              <div className="text-left">
                <div>Parámetros JSON</div>
                <small className="opacity-90">Configuración del modelo</small>
              </div>
            </button>
          </div>

          {/* Información adicional */}
          <div className="bg-[var(--gray-50)] border-2 border-[var(--gray-200)] rounded-lg p-6">
            <h4 className="text-[var(--gray-800)] mb-3">
              Formato de los Datos
            </h4>
            <div className="space-y-2 text-[var(--gray-700)]">
              <p>
                <strong>CSV/Excel:</strong> Contiene las series temporales
                2020-2025 con estadísticos descriptivos (media, percentiles 10,
                50 y 90) para cada variable seleccionada.
              </p>
              <p>
                <strong>JSON de Parámetros:</strong> Incluye la configuración
                completa del modelo (deuda inicial, tasas de interés,
                crecimiento del PIB, etc.) para reproducibilidad del análisis.
              </p>
              <p className="text-[var(--gray-600)] mt-4">
                <small>
                  <strong>Sugerencia:</strong> Los datos exportados pueden ser
                  procesados en Python (pandas), R (tidyverse), Stata o MATLAB
                  para análisis econométricos avanzados.
                </small>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
