export default function ResumenEstadistico({ datos }) {
  const calcularPromedio = (array) => {
    return (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2);
  };

  const calcularMax = (array) => {
    return Math.max(...array).toFixed(2);
  };

  const calcularMin = (array) => {
    return Math.min(...array).toFixed(2);
  };

  const metricas = [
    {
      titulo: "Déficit Final",
      color: "red",
      datos: datos.deficit_final,
    },
    {
      titulo: "Deuda Media",
      color: "orange",
      datos: datos.deuda_media,
    },
    {
      titulo: "Ratio Deuda/PIB",
      color: "green",
      datos: datos.ratio_deuda_pib,
    },
    {
      titulo: "RIN Media",
      color: "blue",
      datos: datos.rin_media,
    },
  ];

  const colorClasses = {
    red: "text-red-400",
    orange: "text-orange-400",
    green: "text-green-400",
    blue: "text-blue-400",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricas.map((metrica, idx) => (
        <div
          key={idx}
          className="bg-slate-800 rounded-lg p-4 border border-slate-700"
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            {metrica.titulo}
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-500">Promedio</p>
              <p className={`text-lg font-bold ${colorClasses[metrica.color]}`}>
                {calcularPromedio(metrica.datos)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Máximo</p>
              <p className="text-sm text-slate-300">
                {calcularMax(metrica.datos)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Mínimo</p>
              <p className="text-sm text-slate-300">
                {calcularMin(metrica.datos)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
