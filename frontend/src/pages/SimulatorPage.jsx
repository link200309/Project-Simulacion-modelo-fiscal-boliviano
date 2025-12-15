import { useState, useEffect } from "react";
import { obtenerResultadosSimulacion } from "../services/api";
import ResultadosChart from "../components/ResultadosChart";
import ResultadosTabla from "../components/ResultadosTabla";
import ResumenEstadistico from "../components/ResumenEstadistico";
import FormularioParametros from "../components/FormularioParametros";
import AnalisisRiesgo from "../components/AnalisisRiesgo";
import EscenariosPoliticaFiscal from "../components/EscenariosPoliticaFiscal";
import BotonesExportacion from "../components/BotonesExportacion";

export default function SimulatorPage() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("graficos");

  const cargarSimulacion = async (parametrosPersonalizados = null) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await obtenerResultadosSimulacion(
        parametrosPersonalizados
      );
      if (resultado.estado === "exito") {
        setDatos(resultado.datos);
      } else {
        setError("Error en la simulación");
      }
    } catch (err) {
      setError("Error al conectar con el servidor: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSimulacion();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Simulador Fiscal
          </h1>
          <p className="text-slate-300">
            Análisis de impacto fiscal y deuda pública
          </p>
        </div>

        {/* Formulario de parámetros */}
        <FormularioParametros onSubmit={cargarSimulacion} cargando={cargando} />

        {/* Mensajes */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Contenido de datos */}
        {datos && (
          <>
            {/* Resumen Estadístico */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Resumen Estadístico
              </h2>
              <ResumenEstadistico datos={datos} />
            </div>

            {/* Pestañas */}
            <div className="flex gap-4 mb-8 border-b border-slate-700">
              <button
                onClick={() => setVistaActiva("graficos")}
                className={`pb-4 px-6 font-semibold transition duration-200 ${
                  vistaActiva === "graficos"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Gráficos
              </button>
              <button
                onClick={() => setVistaActiva("tabla")}
                className={`pb-4 px-6 font-semibold transition duration-200 ${
                  vistaActiva === "tabla"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Tabla de Datos
              </button>
              <button
                onClick={() => setVistaActiva("incertidumbre")}
                className={`pb-4 px-6 font-semibold transition duration-200 ${
                  vistaActiva === "incertidumbre"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Análisis Incertidumbre (RF2)
              </button>
              <button
                onClick={() => setVistaActiva("politica")}
                className={`pb-4 px-6 font-semibold transition duration-200 ${
                  vistaActiva === "politica"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Política Fiscal (RF4)
              </button>
            </div>

            {/* Contenido según vista activa */}
            {vistaActiva === "graficos" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ResultadosChart
                  titulo="Déficit Final"
                  datos={datos.deficit_final}
                  color="rgb(239, 68, 68)"
                />
                <ResultadosChart
                  titulo="Deuda Media"
                  datos={datos.deuda_media}
                  color="rgb(249, 115, 22)"
                />
                <ResultadosChart
                  titulo="Ratio Deuda/PIB"
                  datos={datos.ratio_deuda_pib}
                  color="rgb(34, 197, 94)"
                />
                <ResultadosChart
                  titulo="RIN Media"
                  datos={datos.rin_media}
                  color="rgb(59, 130, 246)"
                />
              </div>
            )}

            {vistaActiva === "tabla" && <ResultadosTabla datos={datos} />}

            {vistaActiva === "incertidumbre" && (
              <div>
                <AnalisisRiesgo datos={datos} />
              </div>
            )}

            {vistaActiva === "politica" && (
              <div>
                <EscenariosPoliticaFiscal datos={datos} />
              </div>
            )}

            {/* Botones de Exportación - Al final */}
            <div className="mt-12">
              <BotonesExportacion datos={datos} vistaActiva={vistaActiva} />
            </div>
          </>
        )}

        {!cargando && !datos && !error && (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <p className="text-slate-400">
              Haz clic en "Ejecutar Simulación" para cargar los datos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
