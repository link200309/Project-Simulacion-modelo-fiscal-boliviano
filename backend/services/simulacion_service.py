import numpy as np
from models.modelo_fiscal import Parametros, simular_modelo

def ejecutar_simulacion(parametros_usuario=None):
    if parametros_usuario is None:
        parametros = Parametros()
    else:
        # DEBUG: Imprimir precios base recibidos
        print("=" * 60)
        print("PRECIOS BASE RECIBIDOS:")
        print(f"  Gas: {parametros_usuario.get('precio_gas_base', 55.0)} USD/MMBTU")
        print(f"  Zinc: {parametros_usuario.get('precio_zinc_base', 2200.0)} USD/ton")
        print(f"  Plata: {parametros_usuario.get('precio_plata_base', 20.0)} USD/oz")
        print(f"  Plomo: {parametros_usuario.get('precio_plomo_base', 1850.0)} USD/ton")
        print(f"  Estaño: {parametros_usuario.get('precio_estano_base', 17000.0)} USD/ton")
        print(f"  Oro: {parametros_usuario.get('precio_oro_base', 1800.0)} USD/oz")
        print("=" * 60)
        
        parametros = Parametros(
            PIB0=parametros_usuario.get("pib_inicial", 257_600),
            deuda_int0=parametros_usuario.get("deuda_interna", 69_300),
            deuda_ext0=parametros_usuario.get("deuda_externa", 82_800),
            RIN0=parametros_usuario.get("rin_inicial", 36_900),
            g_pib=parametros_usuario.get("tasa_crecimiento_pib", 0.022),
            i_int=parametros_usuario.get("tasa_interes_deuda_interna", 0.025),
            i_ext=parametros_usuario.get("tasa_interes_deuda_externa", 0.051),
            tipo_financiamiento=parametros_usuario.get("tipo_financiamiento", "Deuda"),
            sigma_gas=parametros_usuario.get("sigma_gas", 0.20),
            sigma_zinc=parametros_usuario.get("sigma_zinc", 0.25),
            sigma_plata=parametros_usuario.get("sigma_plata", 0.30),
            sigma_plomo=parametros_usuario.get("sigma_plomo", 0.22),
            sigma_estano=parametros_usuario.get("sigma_estano", 0.28),
            sigma_oro=parametros_usuario.get("sigma_oro", 0.18),
            ingresos_zinc_0=parametros_usuario.get("ingresos_zinc_inicial", 2_500),
            ingresos_plata_0=parametros_usuario.get("ingresos_plata_inicial", 2_000),
            ingresos_plomo_0=parametros_usuario.get("ingresos_plomo_inicial", 1_500),
            ingresos_estano_0=parametros_usuario.get("ingresos_estano_inicial", 2_500),
            ingresos_oro_0=parametros_usuario.get("ingresos_oro_inicial", 3_000),
            # Ingresos tributarios iniciales
            ingresos_iva_0=parametros_usuario.get("ingresos_iva_inicial", 25_000),
            ingresos_it_0=parametros_usuario.get("ingresos_it_inicial", 8_000),
            ingresos_iue_0=parametros_usuario.get("ingresos_iue_inicial", 7_500),
            ingresos_rc_iva_0=parametros_usuario.get("ingresos_rc_iva_inicial", 6_500),
            ingresos_ice_0=parametros_usuario.get("ingresos_ice_inicial", 4_500),
            ingresos_ga_0=parametros_usuario.get("ingresos_ga_inicial", 3_000),
            ingresos_iehd_0=parametros_usuario.get("ingresos_iehd_inicial", 2_500),
            ingresos_idh_0=parametros_usuario.get("ingresos_idh_inicial", 5_500),
            # Ingresos no tributarios iniciales
            ingresos_empresas_publicas_0=parametros_usuario.get("ingresos_empresas_publicas_inicial", 1_800),
            ingresos_donaciones_0=parametros_usuario.get("ingresos_donaciones_inicial", 800),
            # Desglose de gasto corriente
            sueldos_salarios_0=parametros_usuario.get("sueldos_salarios_inicial", 28_000),
            bienes_servicios_0=parametros_usuario.get("bienes_servicios_inicial", 18_000),
            otros_gastos_corrientes_0=parametros_usuario.get("otros_gastos_corrientes_inicial", 9_000),
            # Calcular gasto_corriente_0 como suma de componentes
            gasto_corriente_0=(
                parametros_usuario.get("sueldos_salarios_inicial", 28_000) +
                parametros_usuario.get("bienes_servicios_inicial", 18_000) +
                parametros_usuario.get("otros_gastos_corrientes_inicial", 9_000)
            ),
            # Desglose de transferencias sociales
            bonos_sociales_0=parametros_usuario.get("bonos_sociales_inicial", 5_000),
            pensiones_0=parametros_usuario.get("pensiones_inicial", 8_000),
            gobiernos_subnacionales_0=parametros_usuario.get("gobiernos_subnacionales_inicial", 5_000),
            otras_transferencias_0=parametros_usuario.get("otras_transferencias_inicial", 2_000),
            # Calcular transferencias_sociales_0 como suma de componentes
            transferencias_sociales_0=(
                parametros_usuario.get("bonos_sociales_inicial", 5_000) +
                parametros_usuario.get("pensiones_inicial", 8_000) +
                parametros_usuario.get("gobiernos_subnacionales_inicial", 5_000) +
                parametros_usuario.get("otras_transferencias_inicial", 2_000)
            ),
            precio_gas_0=parametros_usuario.get("precio_gas_base", 55.0),
            precio_zinc_0=parametros_usuario.get("precio_zinc_base", 2200.0),
            precio_plata_0=parametros_usuario.get("precio_plata_base", 20.0),
            precio_plomo_0=parametros_usuario.get("precio_plomo_base", 1850.0),
            precio_estano_0=parametros_usuario.get("precio_estano_base", 17000.0),
            precio_oro_0=parametros_usuario.get("precio_oro_base", 1800.0),
            # Parámetros de habilitación de commodities
            gas_habilitado=parametros_usuario.get("gas_habilitado", True),
            zinc_habilitado=parametros_usuario.get("zinc_habilitado", True),
            plata_habilitado=parametros_usuario.get("plata_habilitado", True),
            plomo_habilitado=parametros_usuario.get("plomo_habilitado", True),
            estano_habilitado=parametros_usuario.get("estano_habilitado", True),
            oro_habilitado=parametros_usuario.get("oro_habilitado", True),
            crecimiento_zinc_base=parametros_usuario.get("crecimiento_zinc", 0.012),
            crecimiento_plata_base=parametros_usuario.get("crecimiento_plata", 0.015),
            crecimiento_plomo_base=parametros_usuario.get("crecimiento_plomo", 0.010),
            crecimiento_estano_base=parametros_usuario.get("crecimiento_estano", 0.018),
            crecimiento_oro_base=parametros_usuario.get("crecimiento_oro", 0.020),
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
        "ingresos_oro": resultados["ingresos_oro"].mean(axis=0).tolist(),
        "ingresos_minerales": resultados["ingresos_minerales_totales"].mean(axis=0).tolist(),
        
        # Trayectorias de ingresos (muestra para visualización de shocks)
        "trayectorias_gas": resultados["ingresos_gas"][indices_muestra, :].tolist(),
        "trayectorias_zinc": resultados["ingresos_zinc"][indices_muestra, :].tolist(),
        "trayectorias_plata": resultados["ingresos_plata"][indices_muestra, :].tolist(),
        "trayectorias_plomo": resultados["ingresos_plomo"][indices_muestra, :].tolist(),
        "trayectorias_estano": resultados["ingresos_estano"][indices_muestra, :].tolist(),
        "trayectorias_oro": resultados["ingresos_oro"][indices_muestra, :].tolist(),
        
        # Trayectorias de precios (muestra para visualización)
        "trayectorias_precio_gas": resultados["precio_gas"][indices_muestra, :].tolist(),
        "trayectorias_precio_zinc": resultados["precio_zinc"][indices_muestra, :].tolist(),
        "trayectorias_precio_plata": resultados["precio_plata"][indices_muestra, :].tolist(),
        "trayectorias_precio_plomo": resultados["precio_plomo"][indices_muestra, :].tolist(),
        "trayectorias_precio_estano": resultados["precio_estano"][indices_muestra, :].tolist(),
        "trayectorias_precio_oro": resultados["precio_oro"][indices_muestra, :].tolist(),
        
        # Percentiles para análisis de riesgo (RF2)
        "ratio_deuda_pib_p05": np.percentile(resultados["ratio_deuda_pib"], 5, axis=0).tolist(),
        "ratio_deuda_pib_p25": np.percentile(resultados["ratio_deuda_pib"], 25, axis=0).tolist(),
        "ratio_deuda_pib_p75": np.percentile(resultados["ratio_deuda_pib"], 75, axis=0).tolist(),
        "ratio_deuda_pib_p95": np.percentile(resultados["ratio_deuda_pib"], 95, axis=0).tolist(),
        
        "rin_p05": np.percentile(resultados["RIN"], 5, axis=0).tolist(),
        "rin_p25": np.percentile(resultados["RIN"], 25, axis=0).tolist(),
        "rin_p75": np.percentile(resultados["RIN"], 75, axis=0).tolist(),
        "rin_p95": np.percentile(resultados["RIN"], 95, axis=0).tolist(),
        
        # Distribución completa del déficit 2025 para histograma
        "deficit_2025_distribution": resultados["deficit"][:, -1].tolist(),
        
        # Indicadores de riesgo
        "indicadores_riesgo": {
            "prob_deuda_gt_80": float((resultados["ratio_deuda_pib"][:, -1] > 0.80).mean() * 100),
            "prob_deuda_gt_90": float((resultados["ratio_deuda_pib"][:, -1] > 0.90).mean() * 100),
            "prob_rin_lt_10mil": float((resultados["RIN"][:, -1] < 10_000).mean() * 100),
        },
        
        # Datos de gastos e ingresos para gráficos de composición fiscal
        "gastos": resultados["gastos"].mean(axis=0).tolist(),
        "gasto_sin_subsidio": resultados["gasto_sin_subsidio"].mean(axis=0).tolist(),
        "subsidios": resultados["subsidios"].mean(axis=0).tolist(),
        "ingresos_gas": resultados["ingresos_gas"].mean(axis=0).tolist(),
        "ingresos_zinc": resultados["ingresos_zinc"].mean(axis=0).tolist(),
        "ingresos_plata": resultados["ingresos_plata"].mean(axis=0).tolist(),
        "ingresos_plomo": resultados["ingresos_plomo"].mean(axis=0).tolist(),
        "ingresos_estano": resultados["ingresos_estano"].mean(axis=0).tolist(),
        "ingresos_oro": resultados["ingresos_oro"].mean(axis=0).tolist(),
        "ingresos_totales": resultados["ingresos_totales"].mean(axis=0).tolist(),
        
        # Desglose de ingresos tributarios y no tributarios
        "ingresos_iva": resultados["ingresos_iva"].mean(axis=0).tolist(),
        "ingresos_it": resultados["ingresos_it"].mean(axis=0).tolist(),
        "ingresos_iue": resultados["ingresos_iue"].mean(axis=0).tolist(),
        "ingresos_rc_iva": resultados["ingresos_rc_iva"].mean(axis=0).tolist(),
        "ingresos_ice": resultados["ingresos_ice"].mean(axis=0).tolist(),
        "ingresos_ga": resultados["ingresos_ga"].mean(axis=0).tolist(),
        "ingresos_iehd": resultados["ingresos_iehd"].mean(axis=0).tolist(),
        "ingresos_idh": resultados["ingresos_idh"].mean(axis=0).tolist(),
        "ingresos_otros_tributarios": resultados["ingresos_otros_tributarios"].mean(axis=0).tolist(),
        "ingresos_regalias": resultados["ingresos_regalias"].mean(axis=0).tolist(),
        "ingresos_empresas_publicas": resultados["ingresos_empresas_publicas"].mean(axis=0).tolist(),
        "ingresos_donaciones": resultados["ingresos_donaciones"].mean(axis=0).tolist(),
        "ingresos_otros_no_tributarios": resultados["ingresos_otros_no_tributarios"].mean(axis=0).tolist(),
        
        # Desglose de componentes del gasto
        "gasto_corriente": resultados["gasto_corriente"].mean(axis=0).tolist(),
        "transferencias_sociales": resultados["transferencias_sociales"].mean(axis=0).tolist(),
        "inversion_publica": resultados["inversion_publica"].mean(axis=0).tolist(),
        
        # Desglose de gasto corriente
        "sueldos_salarios": resultados["sueldos_salarios"].mean(axis=0).tolist(),
        "bienes_servicios": resultados["bienes_servicios"].mean(axis=0).tolist(),
        "otros_gastos_corrientes": resultados["otros_gastos_corrientes"].mean(axis=0).tolist(),
        
        # Desglose de transferencias sociales
        "bonos_sociales": resultados["bonos_sociales"].mean(axis=0).tolist(),
        "pensiones": resultados["pensiones"].mean(axis=0).tolist(),
        "gobiernos_subnacionales": resultados["gobiernos_subnacionales"].mean(axis=0).tolist(),
        "otras_transferencias": resultados["otras_transferencias"].mean(axis=0).tolist(),
        
        # Inflación
        "inflacion_media": resultados["inflacion"].mean(axis=0).tolist(),
        "inflacion_p05": np.percentile(resultados["inflacion"], 5, axis=0).tolist(),
        "inflacion_p25": np.percentile(resultados["inflacion"], 25, axis=0).tolist(),
        "inflacion_p75": np.percentile(resultados["inflacion"], 75, axis=0).tolist(),
        "inflacion_p95": np.percentile(resultados["inflacion"], 95, axis=0).tolist(),
    }
    return salida
