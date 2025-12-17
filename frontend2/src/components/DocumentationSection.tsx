import { BookOpen, Code, TrendingUp, Database } from 'lucide-react';

export function DocumentationSection() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-[var(--gray-900)] mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[var(--bolivia-green)]" />
          Documentación del Modelo
        </h2>
        <p className="text-[var(--gray-600)]">
          Marco teórico, ecuaciones estructurales y metodología de simulación del modelo fiscal boliviano bajo incertidumbre.
        </p>
      </div>

      <div className="space-y-8">
        {/* Sección 1: Fundamentos Teóricos */}
        <section className="border-l-4 border-[var(--bolivia-red)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3">1. Fundamentos Teóricos</h3>
          <p className="text-[var(--gray-700)] mb-4">
            El modelo implementa un sistema de ecuaciones fiscales dinámicas que captura la evolución de variables clave del sector público boliviano en un horizonte de 6 años (2020-2025), incorporando incertidumbre a través de simulaciones estocásticas Monte Carlo.
          </p>
          <div className="bg-[var(--gray-50)] rounded-lg p-4">
            <h4 className="text-[var(--gray-800)] mb-2">Supuestos Clave:</h4>
            <ul className="list-disc list-inside text-[var(--gray-700)] space-y-1">
              <li>Economía pequeña y abierta dependiente de exportaciones de commodities</li>
              <li>Precios internacionales siguen procesos estocásticos (GBM simplificado)</li>
              <li>Política fiscal reactiva ante shocks de ingresos</li>
              <li>Deuda pública denominada en USD (externa) y Bolivianos (interna)</li>
            </ul>
          </div>
        </section>

        {/* Sección 2: Ecuaciones del Modelo */}
        <section className="border-l-4 border-[var(--bolivia-yellow)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3 flex items-center gap-2">
            <Code className="w-6 h-6 text-[var(--bolivia-yellow)]" />
            2. Ecuaciones Estructurales
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">2.1 Ingresos Fiscales</h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  I<sub>t</sub> = I<sup>commodities</sup><sub>t</sub> + I<sup>tributarios</sup><sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  I<sup>commodities</sup><sub>t</sub> = P<sub>gas,t</sub> × Q<sub>gas,t</sub> + P<sub>min,t</sub> × Q<sub>min,t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  I<sup>tributarios</sup><sub>t</sub> = τ × PIB<sub>t</sub>
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                donde P<sub>i,t</sub> son precios estocásticos, Q<sub>i,t</sub> cantidades exportadas, y τ la presión tributaria efectiva (~25%).
              </p>
            </div>

            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">2.2 Gasto Público</h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  G<sub>t</sub> = G<sup>corriente</sup><sub>t</sub> + G<sup>capital</sup><sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  G<sup>corriente</sup><sub>t</sub> = Salarios<sub>t</sub> + Subsidios<sub>t</sub> + Transferencias<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Subsidios<sub>t</sub> = S<sub>0</sub> × (1 - α<sub>reducción</sub>)
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                α<sub>reducción</sub> ∈ [0,1] es el parámetro de política fiscal analizado en el módulo de sensibilidad.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">2.3 Balance Fiscal y Dinámica de Deuda</h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Déficit<sub>t</sub> = I<sub>t</sub> - G<sub>t</sub> - r × D<sub>t-1</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  D<sub>t</sub> = D<sub>t-1</sub> + ΔD<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  ΔD<sub>t</sub> = -Déficit<sub>t</sub>  (si Déficit<sub>t</sub> &lt; 0)
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                donde r es la tasa de interés promedio de la deuda y D<sub>t</sub> la deuda pública total.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">2.4 Reservas Internacionales Netas (RIN)</h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  RIN<sub>t</sub> = RIN<sub>t-1</sub> + CC<sub>t</sub> + CK<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  CC<sub>t</sub> = X<sub>t</sub> - M<sub>t</sub> + Transferencias<sub>t</sub>
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                CC: cuenta corriente, CK: cuenta de capital, X: exportaciones, M: importaciones.
              </p>
            </div>
          </div>
        </section>

        {/* Sección 3: Proceso Estocástico */}
        <section className="border-l-4 border-[var(--bolivia-green)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[var(--bolivia-green)]" />
            3. Shocks Estocásticos
          </h3>
          
          <p className="text-[var(--gray-700)] mb-4">
            Los precios de commodities siguen:
          </p>
          
          <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
            <div className="font-mono text-sm text-[var(--gray-700)] space-y-3">
              <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                dP<sub>t</sub> = μ P<sub>t</sub> dt + σ P<sub>t</sub> dW<sub>t</sub>
              </div>
              <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                P<sub>t+1</sub> = P<sub>t</sub> exp((μ - σ²/2)Δt + σ√Δt × ε<sub>t</sub>)
              </div>
              <div className="text-[var(--gray-600)] text-sm mt-2">
                donde ε<sub>t</sub> ~ N(0,1) es un shock aleatorio normal estándar
              </div>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <h4 className="text-[var(--gray-800)] mb-2">Parámetros de Calibración:</h4>
            <ul className="text-[var(--gray-700)] space-y-1">
              <li>• <strong>Gas Natural:</strong> μ = 0%, σ = 25% (volatilidad media)</li>
              <li>• <strong>Minerales:</strong> μ = 0%, σ = 30% (alta volatilidad)</li>
              <li>• <strong>Número de simulaciones:</strong> 1,000 - 10,000 trayectorias</li>
            </ul>
          </div>
        </section>

        {/* Sección 4: Implementación Computacional */}
        <section className="border-l-4 border-[var(--gray-600)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3 flex items-center gap-2">
            <Database className="w-6 h-6 text-[var(--gray-600)]" />
            4. Implementación Computacional
          </h3>
          
          <p className="text-[var(--gray-700)] mb-4">
            El modelo está implementado en TypeScript/JavaScript para el frontend, con lógica de simulación inspirada en métodos numéricos de Python (NumPy) y R.
          </p>

          <div className="bg-[var(--gray-50)] rounded-lg p-4 space-y-4">
            <div>
              <h4 className="text-[var(--gray-800)] mb-2">Algoritmo de Simulación:</h4>
              <ol className="list-decimal list-inside text-[var(--gray-700)] space-y-2 ml-2">
                <li>Generar N trayectorias estocásticas de precios de commodities (2020-2025)</li>
                <li>Para cada trayectoria i:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>Calcular ingresos fiscales I<sub>i,t</sub> en cada año t</li>
                    <li>Determinar gastos G<sub>i,t</sub> según reglas fiscales</li>
                    <li>Actualizar deuda D<sub>i,t</sub> y RIN<sub>i,t</sub></li>
                  </ul>
                </li>
                <li>Computar estadísticos: media, percentiles (10, 50, 90) para cada variable y año</li>
                <li>Generar distribuciones probabilísticas del déficit fiscal terminal</li>
              </ol>
            </div>

            <div>
              <h4 className="text-[var(--gray-800)] mb-2">Librerías Equivalentes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  <strong className="text-[var(--bolivia-green)]">Python:</strong>
                  <code className="block text-sm text-[var(--gray-600)] mt-1">
                    numpy, scipy.stats, pandas
                  </code>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  <strong className="text-[var(--bolivia-green)]">R:</strong>
                  <code className="block text-sm text-[var(--gray-600)] mt-1">
                    dplyr, ggplot2, tidyr
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 5: Referencias */}
        <section className="border-2 border-[var(--gray-300)] rounded-lg p-6 bg-gradient-to-br from-[var(--gray-50)] to-white">
          <h3 className="text-[var(--gray-800)] mb-3">5. Referencias y Fuentes de Datos</h3>
          <div className="space-y-3 text-[var(--gray-700)]">
            <div>
              <strong>Datos Fiscales:</strong> Ministerio de Economía y Finanzas Públicas de Bolivia (MEFP)
            </div>
            <div>
              <strong>Reservas Internacionales:</strong> Banco Central de Bolivia (BCB)
            </div>
            <div>
              <strong>Precios de Commodities:</strong> Banco Mundial, FMI Commodity Prices
            </div>
            <div>
              <strong>Marco Metodológico:</strong> Modelos DSGE fiscales, literatura de sostenibilidad de deuda pública (Blanchard, 1990; IMF Fiscal Monitor)
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-2 border-[var(--bolivia-yellow)] rounded-lg p-6">
          <h4 className="text-[var(--gray-800)] mb-2"> </h4>
          <p className="text-[var(--gray-700)]">
           Taller de simulacion de sistemas 2/2025
          </p>
        </div>
      </div>
    </div>
  );
}
