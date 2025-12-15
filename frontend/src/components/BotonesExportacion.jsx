import React from "react";
import {
  exportarCSV,
  exportarJSON,
  exportarExcel,
  exportarAnalisisRiesgo,
} from "../utils/exportar";

export default function BotonesExportacion({ datos, vistaActiva }) {
  const handleExportCSV = () => {
    exportarCSV(datos, "simulacion_fiscal.csv");
  };

  const handleExportJSON = () => {
    exportarJSON(datos, "simulacion_fiscal.json");
  };

  const handleExportExcel = () => {
    exportarExcel(datos, "simulacion_fiscal.xlsx");
  };

  const handleExportRiesgo = () => {
    exportarAnalisisRiesgo(datos, "analisis_riesgo.json");
  };

  if (!datos) return null;

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 16v-4m0 0V8m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Exportar Datos
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
          CSV
        </button>

        <button
          onClick={handleExportJSON}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
          </svg>
          JSON
        </button>

        <button
          onClick={handleExportExcel}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4z" />
            <path d="M7 6h6a1 1 0 110 2H7a1 1 0 110-2zm0 4h6a1 1 0 110 2H7a1 1 0 110-2zm0 4h6a1 1 0 110 2H7a1 1 0 110-2z" />
          </svg>
          Excel
        </button>

        {vistaActiva === "incertidumbre" && (
          <button
            onClick={handleExportRiesgo}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Riesgo
          </button>
        )}
      </div>

      <p className="text-slate-400 text-xs mt-3">
        Descarga los datos en el formato que prefieras para análisis adicional
      </p>
    </div>
  );
}
