import numpy as np
from models.modelo_fiscal import Parametros, simular_modelo

def ejecutar_simulacion(parametros_usuario=None):
    if parametros_usuario is None:
        parametros = Parametros()
    else:
        parametros = Parametros(
            deuda_int0=parametros_usuario.get("deuda_interna", 69_300),
            deuda_ext0=parametros_usuario.get("deuda_externa", 82_800),
            RIN0=parametros_usuario.get("rin_inicial", 36_900),
            g_pib=parametros_usuario.get("tasa_crecimiento_pib", 0.022),
            i_ext=parametros_usuario.get("tasa_interes_deuda_externa", 0.051),
            sigma_gas=parametros_usuario.get("sigma_gas", 0.20),
            sigma_zinc=parametros_usuario.get("sigma_zinc", 0.25),
            sigma_plata=parametros_usuario.get("sigma_plata", 0.30),
            sigma_plomo=parametros_usuario.get("sigma_plomo", 0.22),
            sigma_estano=parametros_usuario.get("sigma_estano", 0.28),
            ingresos_zinc_0=parametros_usuario.get("ingresos_zinc_inicial", 2_500),
            ingresos_plata_0=parametros_usuario.get("ingresos_plata_inicial", 2_000),
            ingresos_plomo_0=parametros_usuario.get("ingresos_plomo_inicial", 1_500),
            ingresos_estano_0=parametros_usuario.get("ingresos_estano_inicial", 2_500),
            crecimiento_zinc_base=parametros_usuario.get("crecimiento_zinc", 0.012),
            crecimiento_plata_base=parametros_usuario.get("crecimiento_plata", 0.015),
            crecimiento_plomo_base=parametros_usuario.get("crecimiento_plomo", 0.010),
            crecimiento_estano_base=parametros_usuario.get("crecimiento_estano", 0.018),
            phi_deuda=parametros_usuario.get("phi_deuda", 0.02),
            n_sim=parametros_usuario.get("n_sim", 1000),
            reduccion_subsidio=parametros_usuario.get("reduccion_subsidios", 0.0),
            tipo_reduccion=parametros_usuario.get("tipo_reduccion", "gradual")
        )
    
    resultados = simular_modelo(parametros)

    # Tomar 50 trayectorias de muestra para visualización
    n_muestras = min(50, parametros.n_sim)
    indices_muestra = np.random.choice(parametros.n_sim, n_muestras, replace=False)
    
    # Datos principales (media)
    salida = {
        "deuda_media": resultados["deuda_total"].mean(axis=0).tolist(),
        "ratio_deuda_pib": resultados["ratio_deuda_pib"].mean(axis=0).tolist(),
        "rin_media": resultados["RIN"].mean(axis=0).tolist(),
        "deficit_final": resultados["deficit"].mean(axis=0).tolist(),
        "gastos": resultados["gastos"].mean(axis=0).tolist(),
        "gasto_sin_subsidio": resultados["gasto_sin_subsidio"].mean(axis=0).tolist(),
        "subsidios": resultados["subsidios"].mean(axis=0).tolist(),
        "ingresos_gas": resultados["ingresos_gas"].mean(axis=0).tolist(),
        "ingresos_zinc": resultados["ingresos_zinc"].mean(axis=0).tolist(),
        "ingresos_plata": resultados["ingresos_plata"].mean(axis=0).tolist(),
        "ingresos_plomo": resultados["ingresos_plomo"].mean(axis=0).tolist(),
        "ingresos_estano": resultados["ingresos_estano"].mean(axis=0).tolist(),
        "ingresos_minerales": resultados["ingresos_minerales_totales"].mean(axis=0).tolist(),
        
        # Trayectorias de ingresos (muestra para visualización de shocks)
        "trayectorias_gas": resultados["ingresos_gas"][indices_muestra, :].tolist(),
        "trayectorias_zinc": resultados["ingresos_zinc"][indices_muestra, :].tolist(),
        "trayectorias_plata": resultados["ingresos_plata"][indices_muestra, :].tolist(),
        "trayectorias_plomo": resultados["ingresos_plomo"][indices_muestra, :].tolist(),
        "trayectorias_estano": resultados["ingresos_estano"][indices_muestra, :].tolist(),
        
        # Trayectorias de precios (muestra para visualización)
        "trayectorias_precio_gas": resultados["precio_gas"][indices_muestra, :].tolist(),
        "trayectorias_precio_zinc": resultados["precio_zinc"][indices_muestra, :].tolist(),
        "trayectorias_precio_plata": resultados["precio_plata"][indices_muestra, :].tolist(),
        "trayectorias_precio_plomo": resultados["precio_plomo"][indices_muestra, :].tolist(),
        "trayectorias_precio_estano": resultados["precio_estano"][indices_muestra, :].tolist(),
        
        # Percentiles para análisis de riesgo (RF2)
        "ratio_deuda_pib_p05": np.percentile(resultados["ratio_deuda_pib"], 5, axis=0).tolist(),
        "ratio_deuda_pib_p25": np.percentile(resultados["ratio_deuda_pib"], 25, axis=0).tolist(),
        "ratio_deuda_pib_p75": np.percentile(resultados["ratio_deuda_pib"], 75, axis=0).tolist(),
        "ratio_deuda_pib_p95": np.percentile(resultados["ratio_deuda_pib"], 95, axis=0).tolist(),
        
        "rin_p05": np.percentile(resultados["RIN"], 5, axis=0).tolist(),
        "rin_p25": np.percentile(resultados["RIN"], 25, axis=0).tolist(),
        "rin_p75": np.percentile(resultados["RIN"], 75, axis=0).tolist(),
        "rin_p95": np.percentile(resultados["RIN"], 95, axis=0).tolist(),
        
        # Indicadores de riesgo
        "indicadores_riesgo": {
            "prob_deuda_gt_80": float((resultados["ratio_deuda_pib"][:, -1] > 0.80).mean() * 100),
            "prob_deuda_gt_90": float((resultados["ratio_deuda_pib"][:, -1] > 0.90).mean() * 100),
            "prob_rin_lt_10mil": float((resultados["RIN"][:, -1] < 10_000).mean() * 100),
        }
    }
    return salida
