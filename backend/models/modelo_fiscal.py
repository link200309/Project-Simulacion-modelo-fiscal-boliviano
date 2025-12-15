# ==============================================================
# MODELO FISCAL ESTOCÁSTICO – BOLIVIA (2020–2025)
# VERSIÓN CORREGIDA
# ==============================================================

import numpy as np
import pandas as pd
from dataclasses import dataclass
from typing import Dict

# ==============================================================
# PARÁMETROS DEL MODELO
# ==============================================================

@dataclass
class Parametros:
    # Horizonte
    T: int = 6
    n_sim: int = 1000

    # ------------------------------
    # Año base 2020 (DATOS REALES)
    # Unidades: MILLONES DE Bs
    # ------------------------------
    PIB0: float = 257_600
    ingresos_totales_0: float = 87_000
    gasto_total_0: float = 115_000
    ingresos_gas_0: float = 13_394

    deuda_int0: float = 69_300
    deuda_ext0: float = 82_800
    RIN0: float = 36_900

    # ------------------------------
    # Parámetros macroeconómicos
    # ------------------------------
    g_pib: float = 0.022          # crecimiento PIB
    i_int: float = 0.025          # tasa interés deuda interna
    i_ext: float = 0.051          # tasa interés deuda externa

    # ------------------------------
    # Dinámica fiscal
    # ------------------------------
    elasticidad_ingresos: float = 1.0
    crecimiento_gasto: float = 0.018
    crecimiento_gas_base: float = 0.01  # tendencia base del gas (además de shocks)

    # ------------------------------
    # Shocks (gas)
    # ------------------------------
    sigma_gas: float = 0.20

    # ------------------------------
    # Riesgo financiero
    # ------------------------------
    phi_deuda: float = 0.02

    # ------------------------------
    # Dinámica RIN
    # ------------------------------
    tasa_ahorro_gas: float = 0.30  # % de ingresos gas que van a RIN
    tasa_uso_rin: float = 0.20     # % del déficit financiado con RIN


# ==============================================================
# SHOCKS ESTOCÁSTICOS
# ==============================================================

def shocks_gas(T, n, sigma, rng):
    """
    Shocks multiplicativos sobre ingresos por gas
    Retorna matriz (n_sim, T) de factores multiplicativos
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)  # Corrección lognormal para E[exp(Z)] = 1


# ==============================================================
# MODELO FISCAL DINÁMICO
# ==============================================================

def simular_modelo(p: Parametros, seed=42) -> Dict[str, np.ndarray]:
    rng = np.random.default_rng(seed)
    shocks = shocks_gas(p.T, p.n_sim, p.sigma_gas, rng)

    # Arrays para guardar resultados
    deuda_interna = np.zeros((p.n_sim, p.T))
    deuda_externa = np.zeros((p.n_sim, p.T))
    deuda_total = np.zeros((p.n_sim, p.T))
    deficit = np.zeros((p.n_sim, p.T))
    PIB = np.zeros((p.n_sim, p.T))
    RIN = np.zeros((p.n_sim, p.T))
    ingresos_totales = np.zeros((p.n_sim, p.T))
    ingresos_gas = np.zeros((p.n_sim, p.T))
    gastos = np.zeros((p.n_sim, p.T))

    # Separar ingresos no-gas desde el inicio
    ingresos_no_gas_0 = p.ingresos_totales_0 - p.ingresos_gas_0

    for s in range(p.n_sim):
        # Estados iniciales
        pib = p.PIB0
        ingresos_no_gas = ingresos_no_gas_0
        gasto = p.gasto_total_0
        rin = p.RIN0
        deuda_int = p.deuda_int0
        deuda_ext = p.deuda_ext0

        for t in range(p.T):
            # ============================================
            # 1. PIB
            # ============================================
            pib *= (1 + p.g_pib)

            # ============================================
            # 2. INGRESOS
            # ============================================
            # Ingresos no-gas (crecen con elasticidad al PIB)
            ingresos_no_gas *= (1 + p.elasticidad_ingresos * p.g_pib)
            
            # Ingresos del gas (tendencia + shock)
            gas_t = p.ingresos_gas_0 * ((1 + p.crecimiento_gas_base) ** (t + 1)) * shocks[s, t]
            
            # Total
            ingresos_t = ingresos_no_gas + gas_t

            # ============================================
            # 3. GASTO con regla fiscal
            # ============================================
            ratio_deuda_pib = (deuda_int + deuda_ext) / pib
            
            if ratio_deuda_pib > 0.70:
                # Austeridad: gasto crece más lento
                gasto *= (1 + p.crecimiento_gasto * 0.5)
            elif ratio_deuda_pib > 0.60:
                # Moderación
                gasto *= (1 + p.crecimiento_gasto * 0.8)
            else:
                # Normal
                gasto *= (1 + p.crecimiento_gasto)

            # ============================================
            # 4. DÉFICIT PRIMARIO
            # ============================================
            deficit_primario = gasto - ingresos_t

            # ============================================
            # 5. INTERESES
            # ============================================
            # Prima de riesgo (aumenta con ratio deuda/PIB)
            prima = p.phi_deuda * max(0, ratio_deuda_pib - 0.6)
            tasa_ext = p.i_ext + prima
            tasa_int = p.i_int + prima * 0.5  # Prima menor en deuda interna

            intereses_int = deuda_int * tasa_int
            intereses_ext = deuda_ext * tasa_ext
            intereses_totales = intereses_int + intereses_ext

            # ============================================
            # 6. DÉFICIT TOTAL (primario + intereses)
            # ============================================
            deficit_total = deficit_primario + intereses_totales

            # ============================================
            # 7. FINANCIAMIENTO DEL DÉFICIT
            # ============================================
            # Parte del déficit se financia con RIN
            if deficit_total > 0:
                # Usar RIN disponible
                financiamiento_rin = min(rin * p.tasa_uso_rin, deficit_total)
                financiamiento_deuda = deficit_total - financiamiento_rin
                
                nueva_deuda_ext = financiamiento_deuda * 0.70
                nueva_deuda_int = financiamiento_deuda * 0.30
            else:
                # Superávit: no financiamiento
                financiamiento_rin = 0
                nueva_deuda_ext = 0
                nueva_deuda_int = 0

            # ============================================
            # 8. ACTUALIZAR DEUDA
            # ============================================
            deuda_int += nueva_deuda_int
            deuda_ext += nueva_deuda_ext

            # ============================================
            # 9. RESERVAS INTERNACIONALES (RIN)
            # ============================================
            # Entradas: fracción de ingresos del gas
            entrada_rin = p.tasa_ahorro_gas * gas_t
            
            # Salidas: pago de intereses externos + financiamiento déficit
            salida_rin = intereses_ext * 0.5 + financiamiento_rin  # Solo parte de intereses
            
            rin = max(0, rin + entrada_rin - salida_rin)

            # ============================================
            # 10. GUARDAR RESULTADOS
            # ============================================
            deuda_interna[s, t] = deuda_int
            deuda_externa[s, t] = deuda_ext
            deuda_total[s, t] = deuda_int + deuda_ext
            deficit[s, t] = deficit_total
            PIB[s, t] = pib
            RIN[s, t] = rin
            ingresos_totales[s, t] = ingresos_t
            ingresos_gas[s, t] = gas_t
            gastos[s, t] = gasto

    return {
        "deuda_total": deuda_total,
        "deuda_interna": deuda_interna,
        "deuda_externa": deuda_externa,
        "ratio_deuda_pib": deuda_total / PIB,
        "RIN": RIN,
        "deficit": deficit,
        "PIB": PIB,
        "ingresos_totales": ingresos_totales,
        "ingresos_gas": ingresos_gas,
        "gastos": gastos
    }


# ==============================================================
# RESUMEN ESTADÍSTICO
# ==============================================================

def resumen(resultados):
    """Genera estadísticas descriptivas por año"""
    stats = {}
    for k, v in resultados.items():
        stats[k] = pd.DataFrame({
            "media": v.mean(axis=0),
            "mediana": np.median(v, axis=0),
            "p05": np.percentile(v, 5, axis=0),
            "p25": np.percentile(v, 25, axis=0),
            "p75": np.percentile(v, 75, axis=0),
            "p95": np.percentile(v, 95, axis=0),
            "std": v.std(axis=0)
        }, index=range(2020, 2020 + v.shape[1]))
    return stats


def indicadores_finales(resultados):
    """Estadísticas para el año final (2025)"""
    stats = {}
    for k, v in resultados.items():
        final = v[:, -1]
        stats[k] = {
            "media": final.mean(),
            "mediana": np.median(final),
            "std": final.std(),
            "p05": np.percentile(final, 5),
            "p95": np.percentile(final, 95),
            "prob_crisis": (final > final.mean() * 1.5).mean() if k == "ratio_deuda_pib" else None
        }
    return pd.DataFrame(stats).T


# ==============================================================
# EJECUCIÓN
# ==============================================================

if __name__ == "__main__":
    print("=" * 70)
    print("MODELO FISCAL ESTOCÁSTICO - BOLIVIA 2020-2025")
    print("=" * 70)
    
    p = Parametros()
    print(f"\n📊 Simulando {p.n_sim} escenarios para {p.T} años...")
    
    resultados = simular_modelo(p)
    res = resumen(resultados)

    print("\n" + "=" * 70)
    print("📈 DEUDA TOTAL (millones Bs)")
    print("=" * 70)
    print(res["deuda_total"].round(0))

    print("\n" + "=" * 70)
    print("📊 RATIO DEUDA/PIB (%)")
    print("=" * 70)
    print((res["ratio_deuda_pib"] * 100).round(2))

    print("\n" + "=" * 70)
    print("💰 RESERVAS INTERNACIONALES - RIN (millones Bs)")
    print("=" * 70)
    print(res["RIN"].round(0))

    print("\n" + "=" * 70)
    print("📉 DÉFICIT FISCAL (millones Bs)")
    print("=" * 70)
    print(res["deficit"].round(0))

    print("\n" + "=" * 70)
    print("🎯 INDICADORES FINALES (2025)")
    print("=" * 70)
    ind_finales = indicadores_finales(resultados)
    print(ind_finales.round(2))

    print("\n" + "=" * 70)
    print("⚠️  ANÁLISIS DE RIESGO")
    print("=" * 70)
    ratio_final = resultados["ratio_deuda_pib"][:, -1]
    print(f"Probabilidad Deuda/PIB > 80%: {(ratio_final > 0.80).mean()*100:.1f}%")
    print(f"Probabilidad Deuda/PIB > 90%: {(ratio_final > 0.90).mean()*100:.1f}%")
    print(f"Probabilidad RIN < 10,000:    {(resultados['RIN'][:, -1] < 10_000).mean()*100:.1f}%")
    
    print("\n✅ Simulación completada\n")