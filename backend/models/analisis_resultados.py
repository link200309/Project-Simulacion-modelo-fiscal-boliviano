# ==============================================================
# ANÁLISIS Y VISUALIZACIÓN DE RESULTADOS - MODELO FISCAL
# ==============================================================

import numpy as np
import pandas as pd
from modelo_fiscal import Parametros, simular_modelo


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
# ANÁLISIS DE SENSIBILIDAD DE SUBSIDIOS (RF4)
# ==============================================================

def analisis_sensibilidad_subsidios(reducciones=[0.0, 0.10, 0.20, 0.30, 0.50], seed=42):
    """
    Ejecuta múltiples simulaciones variando el porcentaje de reducción del subsidio
    para analizar el impacto en el déficit fiscal
    """
    resultados_sensibilidad = {}
    
    for reduccion in reducciones:
        print(f"\n🔍 Simulando con reducción de subsidio: {reduccion*100:.0f}%")
        
        # Crear parámetros con la reducción especificada
        p = Parametros()
        p.reduccion_subsidio = reduccion
        
        # Simular
        res = simular_modelo(p, seed=seed)
        
        # Guardar resultados clave
        resultados_sensibilidad[f"reduccion_{int(reduccion*100)}pct"] = {
            "deficit_medio": res["deficit"].mean(axis=0),
            "subsidio_medio": res["subsidios"].mean(axis=0),
            "ratio_deuda_pib_medio": res["ratio_deuda_pib"].mean(axis=0),
            "deficit_final": res["deficit"][:, -1].mean(),
            "subsidio_final": res["subsidios"][:, -1].mean(),
            "ahorro_acumulado": (p.subsidio_0 * reduccion * 6)  # Aproximado
        }
    
    return resultados_sensibilidad


# ==============================================================
# IMPRESIÓN DE RESULTADOS
# ==============================================================

def imprimir_resultados(p, resultados, res):
    """Imprime todos los resultados de la simulación"""
    
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
    print("⛽ SUBSIDIOS (millones Bs)")
    print("=" * 70)
    print(res["subsidios"].round(0))

    print("\n" + "=" * 70)
    print("⛽ INGRESOS POR GAS (millones Bs)")
    print("=" * 70)
    print(res["ingresos_gas"].round(0))

    print("\n" + "=" * 70)
    print("⛏️  INGRESOS POR MINERALES (millones Bs)")
    print("=" * 70)
    print(res["ingresos_minerales_totales"].round(0))

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


def imprimir_sensibilidad_subsidios(sens):
    """Imprime el análisis de sensibilidad de subsidios"""
    
    print("\n" + "=" * 70)
    print("📊 ANÁLISIS DE SENSIBILIDAD DE SUBSIDIOS (RF4)")
    print("=" * 70)
    
    print("\nImpacto de la reducción de subsidios en el déficit final (2025):")
    print("-" * 70)
    for key, value in sens.items():
        reduccion_pct = key.replace("reduccion_", "").replace("pct", "")
        print(f"Reducción {reduccion_pct}%: Déficit = {value['deficit_final']:,.0f} M Bs | "
              f"Subsidio = {value['subsidio_final']:,.0f} M Bs")


# ==============================================================
# EJECUCIÓN PRINCIPAL
# ==============================================================

if __name__ == "__main__":
    print("=" * 70)
    print("MODELO FISCAL ESTOCÁSTICO - BOLIVIA 2020-2025")
    print("CON SHOCKS ESTOCÁSTICOS EN GAS Y MINERALES")
    print("=" * 70)
    
    p = Parametros()
    print(f"\n📊 Simulando {p.n_sim} escenarios para {p.T} años...")
    print(f"   • Volatilidad Gas: {p.sigma_gas*100:.0f}%")
    print(f"   • Ingresos Gas inicial: {p.ingresos_gas_0:,.0f} M Bs")
    
    # Ejecutar simulación
    resultados = simular_modelo(p)
    res = resumen(resultados)
    
    # Imprimir resultados principales
    imprimir_resultados(p, resultados, res)
    
    # Análisis de sensibilidad
    sens = analisis_sensibilidad_subsidios([0.0, 0.10, 0.20, 0.30, 0.50])
    imprimir_sensibilidad_subsidios(sens)
    
    print("\n✅ Simulación completada\n")
