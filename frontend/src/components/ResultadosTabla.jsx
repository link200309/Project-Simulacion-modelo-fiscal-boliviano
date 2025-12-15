export default function ResultadosTabla({ datos }) {
  const periodos = datos.deficit_final.map((_, idx) => `${2020 + idx}`);

  const filas = periodos.map((periodo, idx) => ({
    periodo,
    deficitFinal: datos.deficit_final[idx].toFixed(2),
    deudaMedia: datos.deuda_media[idx].toFixed(2),
    ratioDeudaPib: datos.ratio_deuda_pib[idx].toFixed(4),
    rinMedia: datos.rin_media[idx].toFixed(2),
  }));

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                Período
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                Déficit Final
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                Deuda Media
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                Ratio Deuda/PIB
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                RIN Media
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filas.map((fila, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-slate-800" : "bg-slate-750"
                } hover:bg-slate-700 transition duration-200`}
              >
                <td className="px-6 py-4 text-sm text-slate-200 font-medium">
                  {fila.periodo}
                </td>
                <td className="px-6 py-4 text-sm text-red-400">
                  {fila.deficitFinal}
                </td>
                <td className="px-6 py-4 text-sm text-orange-400">
                  {fila.deudaMedia}
                </td>
                <td className="px-6 py-4 text-sm text-green-400">
                  {fila.ratioDeudaPib}
                </td>
                <td className="px-6 py-4 text-sm text-blue-400">
                  {fila.rinMedia}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="bg-slate-900 p-6 border-t border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Resumen Estadístico
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <p className="text-slate-400 text-sm">Déficit Final Promedio</p>
            <p className="text-red-400 text-lg font-bold">
              {(
                datos.deficit_final.reduce((a, b) => a + b, 0) /
                datos.deficit_final.length
              ).toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <p className="text-slate-400 text-sm">Deuda Media Promedio</p>
            <p className="text-orange-400 text-lg font-bold">
              {(
                datos.deuda_media.reduce((a, b) => a + b, 0) /
                datos.deuda_media.length
              ).toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <p className="text-slate-400 text-sm">Ratio Deuda/PIB Promedio</p>
            <p className="text-green-400 text-lg font-bold">
              {(
                datos.ratio_deuda_pib.reduce((a, b) => a + b, 0) /
                datos.ratio_deuda_pib.length
              ).toFixed(4)}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <p className="text-slate-400 text-sm">RIN Media Promedio</p>
            <p className="text-blue-400 text-lg font-bold">
              {(
                datos.rin_media.reduce((a, b) => a + b, 0) /
                datos.rin_media.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
