export default function AnalisisRiesgo({ datos }) {
  if (!datos || !datos.indicadores_riesgo) {
    return (
      <div className="text-center py-8 text-slate-400">
        No hay datos de riesgo disponibles
      </div>
    );
  }

  const riesgos = datos.indicadores_riesgo;

  const getRiskColor = (probabilidad) => {
    if (probabilidad > 50) return "bg-red-500";
    if (probabilidad > 25) return "bg-orange-500";
    return "bg-green-500";
  };

  const getRiskLevel = (probabilidad) => {
    if (probabilidad > 50) return "ALTO";
    if (probabilidad > 25) return "MEDIO";
    return "BAJO";
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">
        Análisis de Riesgo (2025)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Riesgo Deuda > 80% */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold">
              Probabilidad Deuda &gt; 80%
            </h3>
          </div>
          <div className="mb-4">
            <div className="relative w-full bg-slate-700 rounded-full h-8 overflow-hidden">
              <div
                className={`${getRiskColor(
                  riesgos.prob_deuda_gt_80
                )} h-full flex items-center justify-center text-white font-bold transition-all duration-500`}
                style={{
                  width: `${Math.min(riesgos.prob_deuda_gt_80, 100)}%`,
                }}
              >
                {riesgos.prob_deuda_gt_80 > 10 &&
                  `${riesgos.prob_deuda_gt_80.toFixed(1)}%`}
              </div>
            </div>
            {riesgos.prob_deuda_gt_80 <= 10 && (
              <div className="text-right mt-1 text-white font-semibold">
                {riesgos.prob_deuda_gt_80.toFixed(1)}%
              </div>
            )}
          </div>
          <div
            className={`text-center font-bold text-lg ${
              riesgos.prob_deuda_gt_80 > 50
                ? "text-red-400"
                : riesgos.prob_deuda_gt_80 > 25
                ? "text-orange-400"
                : "text-green-400"
            }`}
          >
            {getRiskLevel(riesgos.prob_deuda_gt_80)}
          </div>
        </div>

        {/* Riesgo Deuda > 90% */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold">
              Probabilidad Deuda &gt; 90%
            </h3>
          </div>
          <div className="mb-4">
            <div className="relative w-full bg-slate-700 rounded-full h-8 overflow-hidden">
              <div
                className={`${getRiskColor(
                  riesgos.prob_deuda_gt_90
                )} h-full flex items-center justify-center text-white font-bold transition-all duration-500`}
                style={{
                  width: `${Math.min(riesgos.prob_deuda_gt_90, 100)}%`,
                }}
              >
                {riesgos.prob_deuda_gt_90 > 10 &&
                  `${riesgos.prob_deuda_gt_90.toFixed(1)}%`}
              </div>
            </div>
            {riesgos.prob_deuda_gt_90 <= 10 && (
              <div className="text-right mt-1 text-white font-semibold">
                {riesgos.prob_deuda_gt_90.toFixed(1)}%
              </div>
            )}
          </div>
          <div
            className={`text-center font-bold text-lg ${
              riesgos.prob_deuda_gt_90 > 50
                ? "text-red-400"
                : riesgos.prob_deuda_gt_90 > 25
                ? "text-orange-400"
                : "text-green-400"
            }`}
          >
            {getRiskLevel(riesgos.prob_deuda_gt_90)}
          </div>
        </div>

        {/* Riesgo RIN < 10mil */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold">
              Probabilidad RIN &lt; 10 mil M₨
            </h3>
          </div>
          <div className="mb-4">
            <div className="relative w-full bg-slate-700 rounded-full h-8 overflow-hidden">
              <div
                className={`${getRiskColor(
                  riesgos.prob_rin_lt_10mil
                )} h-full flex items-center justify-center text-white font-bold transition-all duration-500`}
                style={{
                  width: `${Math.min(riesgos.prob_rin_lt_10mil, 100)}%`,
                }}
              >
                {riesgos.prob_rin_lt_10mil > 10 &&
                  `${riesgos.prob_rin_lt_10mil.toFixed(1)}%`}
              </div>
            </div>
            {riesgos.prob_rin_lt_10mil <= 10 && (
              <div className="text-right mt-1 text-white font-semibold">
                {riesgos.prob_rin_lt_10mil.toFixed(1)}%
              </div>
            )}
          </div>
          <div
            className={`text-center font-bold text-lg ${
              riesgos.prob_rin_lt_10mil > 50
                ? "text-red-400"
                : riesgos.prob_rin_lt_10mil > 25
                ? "text-orange-400"
                : "text-green-400"
            }`}
          >
            {getRiskLevel(riesgos.prob_rin_lt_10mil)}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded">
        <p className="text-blue-300 text-sm">
          ℹ️ <strong>Interpretación:</strong> Las barras muestran la
          probabilidad (en %) de que cada indicador alcance un nivel crítico en
          2025, considerando la incertidumbre del modelo basada en volatilidad
          de shocks.
        </p>
      </div>
    </div>
  );
}
