import { useState } from "react";

export default function FormularioParametros({ onSubmit, cargando }) {
  const [usarParametrosPersonalizados, setUsarParametrosPersonalizados] =
    useState(false);
  const [mostrarIncertidumbre, setMostrarIncertidumbre] = useState(false);
  const [parametros, setParametros] = useState({
    deuda_interna: 69300,
    deuda_externa: 82800,
    rin_inicial: 36900,
    tasa_crecimiento_pib: 0.022,
    tasa_interes_deuda_externa: 0.051,
    sigma_gas: 0.2,
    phi_deuda: 0.02,
    n_sim: 1000,
    reduccion_subsidios: 0.0,
    tipo_reduccion: "gradual",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParametros({
      ...parametros,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usarParametrosPersonalizados) {
      onSubmit(parametros);
    } else {
      onSubmit(null);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={usarParametrosPersonalizados}
              onChange={(e) =>
                setUsarParametrosPersonalizados(e.target.checked)
              }
              className="w-4 h-4"
            />
            <span className="text-white font-semibold">
              Usar parámetros personalizados
            </span>
          </label>
          <p className="text-slate-400 text-sm mt-2">
            Si no está marcado, se usarán los valores por defecto
          </p>
        </div>

        {usarParametrosPersonalizados && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-slate-900 rounded border border-slate-700">
            {/* Deuda Interna */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Deuda Inicial Interna (Millones Bs)
              </label>
              <input
                type="number"
                name="deuda_interna"
                value={parametros.deuda_interna}
                onChange={handleInputChange}
                step="1000"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                Valor por defecto: 69,300
              </p>
            </div>

            {/* Deuda Externa */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Deuda Inicial Externa (Millones Bs)
              </label>
              <input
                type="number"
                name="deuda_externa"
                value={parametros.deuda_externa}
                onChange={handleInputChange}
                step="1000"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                Valor por defecto: 82,800
              </p>
            </div>

            {/* RIN Inicial */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                RIN Inicial (Millones Bs)
              </label>
              <input
                type="number"
                name="rin_inicial"
                value={parametros.rin_inicial}
                onChange={handleInputChange}
                step="1000"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                Valor por defecto: 36,900
              </p>
            </div>

            {/* Tasa de Crecimiento PIB */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Tasa Crecimiento PIB (%)
              </label>
              <input
                type="number"
                name="tasa_crecimiento_pib"
                value={parametros.tasa_crecimiento_pib * 100}
                onChange={(e) =>
                  setParametros({
                    ...parametros,
                    tasa_crecimiento_pib: parseFloat(e.target.value) / 100,
                  })
                }
                step="0.1"
                min="0"
                max="100"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                Valor por defecto: 2.2%
              </p>
            </div>

            {/* Tasa Interés Deuda Externa */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Tasa Interés Deuda Externa (%)
              </label>
              <input
                type="number"
                name="tasa_interes_deuda_externa"
                value={parametros.tasa_interes_deuda_externa * 100}
                onChange={(e) =>
                  setParametros({
                    ...parametros,
                    tasa_interes_deuda_externa:
                      parseFloat(e.target.value) / 100,
                  })
                }
                step="0.1"
                min="0"
                max="100"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                Valor por defecto: 5.1%
              </p>
            </div>
          </div>
        )}

        {usarParametrosPersonalizados && (
          <div className="mt-6 p-4 bg-slate-900 rounded border border-slate-700">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={mostrarIncertidumbre}
                onChange={(e) => setMostrarIncertidumbre(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-white font-semibold">
                Configurar Incertidumbre (RF2)
              </span>
            </label>

            {mostrarIncertidumbre && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
                {/* Volatilidad del Gas */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    σ Volatilidad Gas (%)
                  </label>
                  <input
                    type="number"
                    name="sigma_gas"
                    value={parametros.sigma_gas * 100}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        sigma_gas: parseFloat(e.target.value) / 100,
                      })
                    }
                    step="1"
                    min="0"
                    max="100"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-slate-500 text-xs mt-1">Defecto: 20%</p>
                </div>

                {/* Factor Riesgo Financiero */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    φ Factor Riesgo (0-0.1)
                  </label>
                  <input
                    type="number"
                    name="phi_deuda"
                    value={parametros.phi_deuda}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        phi_deuda: parseFloat(e.target.value),
                      })
                    }
                    step="0.001"
                    min="0"
                    max="0.1"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-slate-500 text-xs mt-1">Defecto: 0.02</p>
                </div>

                {/* Simulaciones */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Nº Simulaciones
                  </label>
                  <input
                    type="number"
                    name="n_sim"
                    value={parametros.n_sim}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        n_sim: parseInt(e.target.value),
                      })
                    }
                    step="100"
                    min="100"
                    max="5000"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-slate-500 text-xs mt-1">Defecto: 1000</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-700">
              <label className="block text-slate-300 text-sm font-semibold mb-3">
                Reducción de Subsidios a Combustibles (RF4):{" "}
                {Math.round(parametros.reduccion_subsidios * 100)}%
              </label>
              <input
                type="range"
                name="reduccion_subsidios"
                value={parametros.reduccion_subsidios}
                onChange={(e) =>
                  setParametros({
                    ...parametros,
                    reduccion_subsidios: parseFloat(e.target.value),
                  })
                }
                step="0.01"
                min="0"
                max="1"
                className="w-full"
              />
              <div className="flex justify-between text-slate-500 text-xs mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>

              {/* Tipo de reducción */}
              <div className="mt-4">
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Tipo de Reducción:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo_reduccion"
                      value="gradual"
                      checked={parametros.tipo_reduccion === "gradual"}
                      onChange={(e) =>
                        setParametros({
                          ...parametros,
                          tipo_reduccion: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Gradual (a lo largo de los años)
                    </span>
                  </label>
                  <label className="flex items-center text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo_reduccion"
                      value="discreta"
                      checked={parametros.tipo_reduccion === "discreta"}
                      onChange={(e) =>
                        setParametros({
                          ...parametros,
                          tipo_reduccion: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Discreta (inmediata)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          {cargando ? "Ejecutando simulación..." : "Ejecutar Simulación"}
        </button>
      </form>
    </div>
  );
}
