import { BookOpen, Code, TrendingUp, Database } from "lucide-react";

export function DocumentationSection() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-[var(--gray-900)] mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[var(--bolivia-green)]" />
          Documentación del Modelo
        </h2>
        <p className="text-[var(--gray-600)]">
          Marco teórico, ecuaciones estructurales y metodología de simulación
          del modelo fiscal boliviano bajo incertidumbre.
        </p>
      </div>

      <div className="space-y-8">
        {/* Sección 1: Fundamentos Teóricos */}
        <section className="border-l-4 border-[var(--bolivia-red)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3">
            1. Fundamentos Teóricos
          </h3>
          <p className="text-[var(--gray-700)] mb-4">
            El modelo implementa un sistema dinámico-estocástico de ecuaciones
            fiscales para Bolivia (2020-2025), utilizando 1,000 simulaciones
            Monte Carlo para capturar incertidumbre en precios de 6 commodities
            de exportación. Incorpora 9 fuentes de ingresos tributarios y no
            tributarios, desglose detallado de gasto público, reglas fiscales
            endógenas, inflación endógena con efecto Fisher parcial, y dinámica
            de deuda dual (interna/externa) con financiamiento alternativo vía
            RIN.
          </p>
        </section>

        {/* Sección 2: Ecuaciones del Modelo */}
        <section className="border-l-4 border-[var(--bolivia-yellow)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3 flex items-center gap-2">
            <Code className="w-6 h-6 text-[var(--bolivia-yellow)]" />
            2. Ecuaciones Estructurales
          </h3>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">
                2.1 PIB Real e Inflación
              </h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  PIB<sub>real,t</sub> = PIB<sub>real,t-1</sub> × (1 + g
                  <sub>PIB</sub>)
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  π<sub>esperada,t</sub> = ρ<sub>π</sub> × π<sub>t-1</sub> + (1
                  - ρ<sub>π</sub>) × π<sup>*</sup>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  PIB<sub>nominal,t</sub> = PIB<sub>real,t</sub> × (1 + π
                  <sub>esperada,t</sub>)
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                donde g<sub>PIB</sub> es crecimiento real, ρ<sub>π</sub> = 0.65
                (persistencia), π<sup>*</sup> = 4% (objetivo).
              </p>
            </div>

            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">
                2.2 Ingresos Fiscales
              </h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  I<sub>t</sub> = I<sup>tributarios</sup>
                  <sub>t</sub> + I<sup>no-trib</sup>
                  <sub>t</sub> + I<sup>commodities</sup>
                  <sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  I<sup>tributarios</sup>
                  <sub>t</sub> = IVA<sub>t</sub> + IT<sub>t</sub> + IUE
                  <sub>t</sub> + RC-IVA<sub>t</sub> + ICE<sub>t</sub> + GA
                  <sub>t</sub> + IEHD<sub>t</sub> + IDH<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Impuesto<sub>i,t</sub> = Impuesto<sub>i,t-1</sub> × (1 + ε
                  <sub>i</sub> × g<sub>PIB</sub>)
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  I<sup>commodities</sup>
                  <sub>t</sub> = Σ<sub>j=1..6</sub> (P<sub>j,t</sub> × TC
                  <sub>t</sub> × Q<sub>j,t</sub>)
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                6 commodities: gas, zinc, plata, plomo, estaño, oro. ε
                <sub>i</sub> son elasticidades-PIB (0.8-1.3). TC = 6.96 Bs/USD.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">2.3 Gasto Público</h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  G<sub>t</sub> = GC<sub>t</sub> + TS<sub>t</sub> + IP
                  <sub>t</sub> + Subsidios<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  GC<sub>t</sub> = Sueldos<sub>t</sub> + BienesSvcs<sub>t</sub>{" "}
                  + OtrosGC<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  TS<sub>t</sub> = Bonos<sub>t</sub> + Pensiones<sub>t</sub> +
                  GobSubnac<sub>t</sub> + OtrasTS<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Subsidios<sub>t</sub> = S<sub>base,t</sub> × (PIB<sub>t</sub>
                  /PIB<sub>0</sub>)
                  <sup>
                    ε<sub>S,PIB</sub>
                  </sup>{" "}
                  × shock
                  <sup>
                    ε<sub>S,precios</sub>
                  </sup>{" "}
                  × (1 - α)
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                α = reducción de subsidios (política), reglas fiscales ajustan
                GC, TS, IP si Deuda/PIB &gt; 60%.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">
                2.4 Balance Fiscal y Deuda
              </h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Déficit<sub>primario,t</sub> = G<sub>t</sub> - I<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Intereses<sub>t</sub> = D<sub>int,t-1</sub> × i
                  <sub>int,t</sub> + D<sub>ext,t-1</sub> × i<sub>ext,t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  i<sub>ext,t</sub> = i<sub>ext</sub>
                  <sup>base</sup> + φ × max(0, Deuda/PIB - 0.6) + 0.6 × (π
                  <sub>t</sub> - π<sup>*</sup>)
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Déficit<sub>total,t</sub> = Déficit<sub>primario,t</sub> +
                  Intereses<sub>t</sub>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  ΔD<sub>t</sub> = Déficit<sub>total,t</sub> &nbsp;&nbsp; (si
                  financiamiento = Deuda)
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  ΔRIN<sub>t</sub> = -Déficit<sub>total,t</sub> &nbsp;&nbsp; (si
                  financiamiento = RIN)
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                Efecto Fisher parcial (60%) en tasas. Prima de riesgo φ = 0.02.
                Distribución deuda: 70% externa, 30% interna.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
              <h4 className="text-[var(--gray-800)] mb-3">
                2.5 Reglas Fiscales Automáticas
              </h4>
              <div className="font-mono text-sm text-[var(--gray-700)] space-y-2">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Si Deuda/PIB &gt; 0.70: GC ÷= 1.015, TS ÷= 1.015, IP ×= 0.95,
                  Subsidios ×= 0.85
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  Si 0.60 &lt; Deuda/PIB ≤ 0.70: GC ÷= 1.005, TS ÷= 1.005, IP ×=
                  0.98, Subsidios ×= 0.95
                </div>
              </div>
              <p className="text-[var(--gray-600)] mt-3">
                Austeridad endógena para garantizar sostenibilidad. Recortes más
                severos en inversión y subsidios.
              </p>
            </div>
          </div>
        </section>

        {/* Sección 3: Proceso Estocástico */}
        <section className="border-l-4 border-[var(--bolivia-green)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[var(--bolivia-green)]" />
            3. Shocks Estocásticos de Commodities
          </h3>

          <p className="text-[var(--gray-700)] mb-4">
            Los precios de 6 commodities (gas, zinc, plata, plomo, estaño, oro)
            siguen Movimiento Browniano Geométrico (GBM) con tendencia y
            volatilidad independientes:
          </p>

          <div className="bg-gradient-to-r from-[var(--gray-50)] to-white border-2 border-[var(--gray-200)] rounded-lg p-4">
            <div className="font-mono text-sm text-[var(--gray-700)] space-y-3">
              <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                P<sub>j,t</sub> = P<sub>j,0</sub> × (1 + μ<sub>j</sub>)
                <sup>t+1</sup> × shock<sub>j,s,t</sub>
              </div>
              <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                shock<sub>j,s,t</sub> = exp(σ<sub>j</sub> × ε<sub>j,s,t</sub> -
                σ<sub>j</sub>²/2)
              </div>
              <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                ε<sub>j,s,t</sub> ~ N(0, 1) &nbsp;&nbsp; independientes entre j,
                s, t
              </div>
              <div className="text-[var(--gray-600)] text-sm mt-2">
                j = commodity, s = simulación, t = año
              </div>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <h4 className="text-[var(--gray-800)] mb-2">
              Parámetros de Calibración (μ, σ):
            </h4>
            <ul className="text-[var(--gray-700)] space-y-1">
              <li>
                • <strong>Gas Natural:</strong> μ = 1.0%, σ = 25%
              </li>
              <li>
                • <strong>Zinc:</strong> μ = 1.2%, σ = 30%
              </li>
              <li>
                • <strong>Plata:</strong> μ = 1.5%, σ = 35%
              </li>
              <li>
                • <strong>Plomo:</strong> μ = 1.0%, σ = 28%
              </li>
              <li>
                • <strong>Estaño:</strong> μ = 1.8%, σ = 32%
              </li>
              <li>
                • <strong>Oro:</strong> μ = 2.0%, σ = 25%
              </li>
              <li>
                • <strong>Número de simulaciones:</strong> 1,000 trayectorias
                Monte Carlo
              </li>
            </ul>
          </div>

          <div className="mt-4 bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <h4 className="text-[var(--gray-800)] mb-2">
              Cantidades de Producción:
            </h4>
            <p className="text-[var(--gray-700)] mb-2">
              Las cantidades exportadas crecen al 50% del crecimiento de
              precios:
            </p>
            <div className="font-mono text-sm text-[var(--gray-700)]">
              <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                Q<sub>j,t</sub> = Q<sub>j,base</sub> × (1 + 0.5 × μ<sub>j</sub>)
                <sup>t+1</sup>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 4: Implementación Computacional */}
        <section className="border-l-4 border-[var(--gray-600)] pl-6">
          <h3 className="text-[var(--gray-800)] mb-3 flex items-center gap-2">
            <Database className="w-6 h-6 text-[var(--gray-600)]" />
            4. Implementación Computacional
          </h3>

          <p className="text-[var(--gray-700)] mb-4">
            El modelo está implementado en Python (backend) con Flask API, y
            TypeScript/React (frontend) con Recharts para visualización. El
            algoritmo de simulación Monte Carlo ejecuta 1,000 trayectorias de 6
            años cada una.
          </p>

          <div className="bg-[var(--gray-50)] rounded-lg p-4 space-y-4">
            <div>
              <h4 className="text-[var(--gray-800)] mb-2">
                Algoritmo de Simulación (Python/NumPy):
              </h4>
              <ol className="list-decimal list-inside text-[var(--gray-700)] space-y-2 ml-2">
                <li>
                  Generar 1,000 trayectorias estocásticas de 6 commodities
                  (2020-2025) usando GBM discreto
                </li>
                <li>
                  Para cada trayectoria s = 1..1000:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>
                      Inicializar PIB real, inflación, deuda interna/externa,
                      RIN
                    </li>
                    <li>
                      Para cada año t = 0..5:
                      <ul className="list-circle list-inside ml-6">
                        <li>Calcular PIB nominal con inflación endógena</li>
                        <li>
                          Actualizar 9 ingresos con elasticidades-PIB
                          específicas
                        </li>
                        <li>
                          Calcular ingresos de 6 commodities con precios
                          estocásticos
                        </li>
                        <li>
                          Actualizar gastos (GC, TS, IP) con tasas de
                          crecimiento
                        </li>
                        <li>
                          Calcular subsidios con política y reglas fiscales
                        </li>
                        <li>Aplicar reglas fiscales si Deuda/PIB &gt; 60%</li>
                        <li>
                          Calcular déficit primario e intereses (Efecto Fisher)
                        </li>
                        <li>
                          Actualizar deuda dual o RIN según tipo de
                          financiamiento
                        </li>
                        <li>Guardar 40+ variables en arrays (1000×6)</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  Computar estadísticos: media, percentiles (5, 25, 75, 95) para
                  todas las variables
                </li>
                <li>
                  Generar distribuciones probabilísticas para histogramas de
                  riesgo
                </li>
                <li>
                  Calcular indicadores de riesgo: P(Deuda/PIB &gt; 80%), P(RIN
                  &lt; 10 mil M USD)
                </li>
              </ol>
            </div>

            <div>
              <h4 className="text-[var(--gray-800)] mb-2">
                Stack Tecnológico:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  <strong className="text-[var(--bolivia-green)]">
                    Backend:
                  </strong>
                  <code className="block text-sm text-[var(--gray-600)] mt-1">
                    Python 3.10+, NumPy, Flask, dataclasses
                  </code>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  <strong className="text-[var(--bolivia-green)]">
                    Frontend:
                  </strong>
                  <code className="block text-sm text-[var(--gray-600)] mt-1">
                    TypeScript, React, Recharts, Vite
                  </code>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  <strong className="text-[var(--bolivia-green)]">
                    Simulación:
                  </strong>
                  <code className="block text-sm text-[var(--gray-600)] mt-1">
                    Monte Carlo, GBM, 1000 trayectorias
                  </code>
                </div>
                <div className="bg-white p-3 rounded border border-[var(--gray-300)]">
                  <strong className="text-[var(--bolivia-green)]">
                    Visualización:
                  </strong>
                  <code className="block text-sm text-[var(--gray-600)] mt-1">
                    Gráficos de línea, área, barras, pie, histogramas
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[var(--gray-800)] mb-2">
                Variables Rastreadas (40+ series):
              </h4>
              <ul className="text-[var(--gray-700)] space-y-1 grid grid-cols-2 gap-2">
                <li>• Deuda interna/externa/total</li>
                <li>• RIN, Déficit, PIB real/nominal</li>
                <li>• Inflación, Ratio Deuda/PIB</li>
                <li>• 6 ingresos por commodity</li>
                <li>• 7 ingresos tributarios + IDH</li>
                <li>• 2 ingresos no tributarios</li>
                <li>• 3 componentes gasto corriente</li>
                <li>• 4 componentes transferencias</li>
                <li>• Inversión pública, Subsidios</li>
                <li>• 6 precios de commodities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección 5: Referencias */}
        <section className="border-2 border-[var(--gray-300)] rounded-lg p-6 bg-gradient-to-br from-[var(--gray-50)] to-white">
          <h3 className="text-[var(--gray-800)] mb-3">
            5. Referencias y Fuentes de Datos
          </h3>
          <div className="space-y-3 text-[var(--gray-700)]">
            <div>
              <strong>Datos Fiscales Históricos:</strong> Ministerio de Economía
              y Finanzas Públicas de Bolivia (MEFP),
              dataset_maestro_2020_2024.csv
            </div>
            <div>
              <strong>Reservas Internacionales y Tipo de Cambio:</strong> Banco
              Central de Bolivia (BCB), TC = 6.96 Bs/USD
            </div>
            <div>
              <strong>Precios de Commodities (calibración):</strong> Banco
              Mundial Commodity Prices, Bloomberg, London Metal Exchange
            </div>
            <div>
              <strong>PIB y Crecimiento:</strong> Instituto Nacional de
              Estadística (INE), FMI World Economic Outlook
            </div>
            <div>
              <strong>Marco Metodológico:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>
                  Modelos DSGE fiscales (Christiano-Eichenbaum-Evans, 2005)
                </li>
                <li>
                  Análisis de sostenibilidad de deuda (IMF Debt Sustainability
                  Framework)
                </li>
                <li>
                  Simulación Monte Carlo para finanzas públicas (Debrun et al.,
                  2019)
                </li>
                <li>Efecto Fisher en economías emergentes (Mishkin, 1992)</li>
              </ul>
            </div>
            <div>
              <strong>Impuestos bolivianos:</strong> IVA (Impuesto al Valor
              Agregado), IT (Impuesto a las Transacciones), IUE (Impuesto sobre
              Utilidades de Empresas), RC-IVA (Régimen Complementario al IVA),
              ICE (Impuesto a los Consumos Específicos), GA (Gravamen
              Arancelario), IEHD (Impuesto Especial a los Hidrocarburos y sus
              Derivados), IDH (Impuesto Directo a los Hidrocarburos)
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
