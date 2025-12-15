import React from "react";

export default function EscenariosPoliticaFiscal({ datos }) {
  if (!datos || !datos.gastos || !datos.deficit_final) {
    return <div className="p-4 text-slate-400">No hay datos disponibles</div>;
  }

  // Calcular años (2020-2025)
  const años = Array.from({ length: datos.gastos.length }, (_, i) => 2020 + i);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">
        Escenarios de Política Fiscal (RF4)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gasto Corriente */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">
            Gasto Corriente (sin Subsidios)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-2 text-slate-300">Año</th>
                  <th className="text-right p-2 text-slate-300">
                    Gasto (M Bs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.gasto_sin_subsidio.map((valor, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-700 hover:bg-slate-800"
                  >
                    <td className="p-2 text-slate-300">{años[idx]}</td>
                    <td className="text-right p-2 text-white">
                      {Math.round(valor).toLocaleString("es-BO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gasto Total (incluyendo subsidios) */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Gasto Total (con Subsidios)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-2 text-slate-300">Año</th>
                  <th className="text-right p-2 text-slate-300">
                    Gasto (M Bs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.gastos.map((valor, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-700 hover:bg-slate-800"
                  >
                    <td className="p-2 text-slate-300">{años[idx]}</td>
                    <td className="text-right p-2 text-white">
                      {Math.round(valor).toLocaleString("es-BO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subsidios */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Subsidios a Combustibles
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-2 text-slate-300">Año</th>
                  <th className="text-right p-2 text-slate-300">
                    Subsidio (M Bs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.subsidios.map((valor, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-700 hover:bg-slate-800"
                  >
                    <td className="p-2 text-slate-300">{años[idx]}</td>
                    <td className="text-right p-2 text-white">
                      {Math.round(valor).toLocaleString("es-BO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Déficit Fiscal */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-red-400 mb-4">
            Déficit Fiscal Total
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-2 text-slate-300">Año</th>
                  <th className="text-right p-2 text-slate-300">
                    Déficit (M Bs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.deficit_final.map((valor, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-700 hover:bg-slate-800"
                  >
                    <td className="p-2 text-slate-300">{años[idx]}</td>
                    <td className="text-right p-2 text-white">
                      {Math.round(valor).toLocaleString("es-BO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-900 rounded border border-slate-700 text-sm text-slate-300">
        <p>
          Nota: Estos valores reflejan el impacto de la política fiscal
          seleccionada en el formulario de parámetros.
        </p>
        <p>
          Utiliza el slider de "Reducción de Subsidios" para variar el
          porcentaje y observar su efecto directo en el gasto corriente y el
          déficit fiscal.
        </p>
      </div>
    </div>
  );
}
