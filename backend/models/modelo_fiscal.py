# ==============================================================
# MODELO FISCAL ESTOCÁSTICO – BOLIVIA (2020–2025)
# VERSIÓN CON SUBSIDIOS Y SHOCKS EN GAS Y MINERALES
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
    ingresos_zinc_0: float = 2_500  # Ingresos base zinc (millones Bs)
    ingresos_plata_0: float = 2_000  # Ingresos base plata (millones Bs)
    ingresos_plomo_0: float = 1_500  # Ingresos base plomo (millones Bs)
    ingresos_estano_0: float = 2_500  # Ingresos base estaño (millones Bs)
    ingresos_oro_0: float = 3_000  # Ingresos base oro (millones Bs)
    
    # Desglose de ingresos no-commodities (millones Bs, año 2020)
    ingresos_iva_0: float = 25_000  # IVA (Impuesto al Valor Agregado)
    ingresos_it_0: float = 8_000  # IT (Impuestos a las Transacciones)
    ingresos_iue_0: float = 7_500  # IUE (Impuesto sobre Utilidades de Empresas)
    ingresos_rc_iva_0: float = 6_500  # RC-IVA (Régimen Complementario al IVA)
    ingresos_ice_0: float = 4_500  # ICE (Impuesto a Consumos Específicos)
    ingresos_ga_0: float = 3_000  # GA (Gravamen Arancelario)
    ingresos_iehd_0: float = 2_500  # IEHD (Impuesto Especial a Hidrocarburos y Derivados)
    ingresos_otros_tributarios_0: float = 3_500  # Otros ingresos tributarios
    ingresos_regalias_0: float = 4_000  # Regalías mineras
    ingresos_otros_no_tributarios_0: float = 3_000  # Otros ingresos no tributarios

    # Precios base 2020 para commodities
    precio_gas_0: float = 3.0  # USD/MMBTU
    precio_zinc_0: float = 2200.0  # USD/tonelada
    precio_plata_0: float = 20.0  # USD/onza troy
    precio_plomo_0: float = 1850.0  # USD/tonelada
    precio_estano_0: float = 17000.0  # USD/tonelada
    precio_oro_0: float = 1800.0  # USD/onza troy

    deuda_int0: float = 69_300
    deuda_ext0: float = 82_800
    RIN0: float = 36_900
    
    # Desglose de gasto público (millones Bs, año 2020)
    gasto_corriente_0: float = 55_000  # Gasto corriente operativo
    transferencias_sociales_0: float = 20_000  # Transferencias y programas sociales
    inversion_publica_0: float = 28_000  # Inversión pública (infraestructura, capital)
    # subsidio_0 ya está definido más abajo (12,000)
    # Total gasto_total_0 = 55,000 + 20,000 + 28,000 + 12,000 = 115,000

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
    
    # Tasas de crecimiento específicas por tipo de gasto
    crecimiento_gasto_corriente: float = 0.020  # Gasto corriente crece ligeramente más rápido
    crecimiento_transferencias: float = 0.025  # Transferencias sociales expansivas
    crecimiento_inversion: float = 0.015  # Inversión pública moderada
    # crecimiento_subsidio ya está definido más abajo
    
    # Elasticidades específicas por tipo de ingreso (respecto al PIB)
    elasticidad_iva: float = 1.1  # IVA más elástico que PIB
    elasticidad_it: float = 1.0  # IT proporcional al PIB
    elasticidad_iue: float = 1.3  # IUE muy sensible a ciclo económico
    elasticidad_rc_iva: float = 1.1  # RC-IVA similar a IVA
    elasticidad_ice: float = 0.8  # ICE menos elástico
    elasticidad_ga: float = 1.0  # Aranceles con PIB
    elasticidad_iehd: float = 0.9  # IEHD moderadamente elástico
    elasticidad_otros_trib: float = 0.9  # Otros tributarios
    elasticidad_regalias: float = 1.2  # Regalías sensibles a precios
    elasticidad_otros_no_trib: float = 0.7  # Otros no tributarios
    crecimiento_gas_base: float = 0.01  # tendencia base del gas (además de shocks)
    crecimiento_zinc_base: float = 0.012  # tendencia base zinc
    crecimiento_plata_base: float = 0.015  # tendencia base plata
    crecimiento_plomo_base: float = 0.010  # tendencia base plomo
    crecimiento_estano_base: float = 0.018  # tendencia base estaño
    crecimiento_oro_base: float = 0.020  # tendencia base oro

    # ------------------------------
    # Subsidios
    # ------------------------------
    subsidio_0: float = 12_000  # Subsidio inicial 2020 (millones Bs)
    crecimiento_subsidio: float = 0.015  # Crecimiento tendencial
    elasticidad_subsidio_pib: float = 0.8  # Sensibilidad al PIB
    elasticidad_subsidio_precios: float = 1.2  # Sensibilidad a precios internacionales
    reduccion_subsidio: float = 0.0  # % de reducción del subsidio (política fiscal)
    tipo_reduccion: str = "gradual"  # "gradual" o "discreta"

    # ------------------------------
    # Shocks (gas, minerales individuales y precios combustibles)
    # ------------------------------
    sigma_gas: float = 0.20
    sigma_zinc: float = 0.25  # Volatilidad precio zinc
    sigma_plata: float = 0.30  # Volatilidad precio plata
    sigma_plomo: float = 0.22  # Volatilidad precio plomo
    sigma_estano: float = 0.28  # Volatilidad precio estaño
    sigma_oro: float = 0.18  # Volatilidad precio oro
    sigma_precios: float = 0.25  # Volatilidad precios internacionales combustibles

    # ------------------------------
    # Riesgo financiero
    # ------------------------------
    phi_deuda: float = 0.02

    # ------------------------------
    # Financiamiento del déficit
    # ------------------------------
    tipo_financiamiento: str = "Deuda"  # "RIN" o "Deuda"

    # ------------------------------
    # Dinámica RIN
    # ------------------------------
    tasa_ahorro_gas: float = 0.30  # % de ingresos gas que van a RIN
    tasa_uso_rin: float = 0.20     # % del déficit financiado con RIN

    # ------------------------------
    # Inflación (impacto PARCIAL en el modelo)
    # ------------------------------
    inflacion_0: float = 0.014  # Inflación base 2020 (1.4%)
    inflacion_objetivo: float = 0.03  # Meta del banco central (3%)
    beta_deficit: float = 0.40  # Sensibilidad a déficit/PIB
    beta_precios: float = 0.35  # Sensibilidad a shocks de precios
    persistencia_inflacion: float = 0.50  # Inercia inflacionaria
    sigma_inflacion: float = 0.012  # Volatilidad de shocks
    efecto_fisher: float = 0.60  # % del efecto Fisher aplicado (inflación → tasas)


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


def shocks_zinc(T, n, sigma, rng):
    """
    Shocks multiplicativos sobre ingresos por zinc
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_plata(T, n, sigma, rng):
    """
    Shocks multiplicativos sobre ingresos por plata
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_plomo(T, n, sigma, rng):
    """
    Shocks multiplicativos sobre ingresos por plomo
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_estano(T, n, sigma, rng):
    """
    Shocks multiplicativos sobre ingresos por estaño
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_oro(T, n, sigma, rng):
    """
    Shocks multiplicativos sobre ingresos por oro
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_precios_combustibles(T, n, sigma, rng):
    """
    Shocks sobre precios internacionales de combustibles
    Retorna matriz (n_sim, T) de factores multiplicativos
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_inflacion(T, n, sigma, rng):
    """
    Shocks estocásticos sobre inflación
    Retorna matriz (n_sim, T) de shocks aditivos
    """
    return rng.normal(0, sigma, size=(n, T))


# ==============================================================
# MODELO FISCAL DINÁMICO
# ==============================================================

def simular_modelo(p: Parametros, seed=42) -> Dict[str, np.ndarray]:
    rng = np.random.default_rng(seed)
    shocks_gas_sim = shocks_gas(p.T, p.n_sim, p.sigma_gas, rng)
    shocks_zinc_sim = shocks_zinc(p.T, p.n_sim, p.sigma_zinc, rng)
    shocks_plata_sim = shocks_plata(p.T, p.n_sim, p.sigma_plata, rng)
    shocks_plomo_sim = shocks_plomo(p.T, p.n_sim, p.sigma_plomo, rng)
    shocks_estano_sim = shocks_estano(p.T, p.n_sim, p.sigma_estano, rng)
    shocks_oro_sim = shocks_oro(p.T, p.n_sim, p.sigma_oro, rng)
    shocks_precios = shocks_precios_combustibles(p.T, p.n_sim, p.sigma_precios, rng)
    shocks_inflacion_sim = shocks_inflacion(p.T, p.n_sim, p.sigma_inflacion, rng)

    # Arrays para guardar resultados
    deuda_interna = np.zeros((p.n_sim, p.T))
    deuda_externa = np.zeros((p.n_sim, p.T))
    deuda_total = np.zeros((p.n_sim, p.T))
    deficit = np.zeros((p.n_sim, p.T))
    PIB = np.zeros((p.n_sim, p.T))
    PIB_real = np.zeros((p.n_sim, p.T))
    RIN = np.zeros((p.n_sim, p.T))
    inflacion = np.zeros((p.n_sim, p.T))
    ingresos_totales = np.zeros((p.n_sim, p.T))
    ingresos_gas = np.zeros((p.n_sim, p.T))
    ingresos_zinc = np.zeros((p.n_sim, p.T))
    ingresos_plata = np.zeros((p.n_sim, p.T))
    ingresos_plomo = np.zeros((p.n_sim, p.T))
    ingresos_estano = np.zeros((p.n_sim, p.T))
    ingresos_oro = np.zeros((p.n_sim, p.T))
    ingresos_minerales_totales = np.zeros((p.n_sim, p.T))
    
    # Arrays para ingresos tributarios y no tributarios
    ingresos_iva = np.zeros((p.n_sim, p.T))
    ingresos_it = np.zeros((p.n_sim, p.T))
    ingresos_iue = np.zeros((p.n_sim, p.T))
    ingresos_rc_iva = np.zeros((p.n_sim, p.T))
    ingresos_ice = np.zeros((p.n_sim, p.T))
    ingresos_ga = np.zeros((p.n_sim, p.T))
    ingresos_iehd = np.zeros((p.n_sim, p.T))
    ingresos_otros_tributarios = np.zeros((p.n_sim, p.T))
    ingresos_regalias = np.zeros((p.n_sim, p.T))
    ingresos_otros_no_tributarios = np.zeros((p.n_sim, p.T))
    
    # Arrays para componentes del gasto
    gasto_corriente = np.zeros((p.n_sim, p.T))
    transferencias_sociales = np.zeros((p.n_sim, p.T))
    inversion_publica = np.zeros((p.n_sim, p.T))
    gastos = np.zeros((p.n_sim, p.T))
    subsidios = np.zeros((p.n_sim, p.T))
    gasto_sin_subsidio = np.zeros((p.n_sim, p.T))
    
    # Arrays para precios de commodities
    precio_gas = np.zeros((p.n_sim, p.T))
    precio_zinc = np.zeros((p.n_sim, p.T))
    precio_plata = np.zeros((p.n_sim, p.T))
    precio_plomo = np.zeros((p.n_sim, p.T))
    precio_estano = np.zeros((p.n_sim, p.T))
    precio_oro = np.zeros((p.n_sim, p.T))

    # Separar ingresos no-commodities desde el inicio (excluir gas y minerales)
    ingresos_minerales_base_0 = p.ingresos_zinc_0 + p.ingresos_plata_0 + p.ingresos_plomo_0 + p.ingresos_estano_0 + p.ingresos_oro_0

    for s in range(p.n_sim):
        # Estados iniciales
        pib_real = p.PIB0
        pib = p.PIB0
        
        # Estados iniciales de cada categoría de ingreso tributario
        iva_t = p.ingresos_iva_0
        it_t = p.ingresos_it_0
        iue_t = p.ingresos_iue_0
        rc_iva_t = p.ingresos_rc_iva_0
        ice_t = p.ingresos_ice_0
        ga_t = p.ingresos_ga_0
        iehd_t = p.ingresos_iehd_0
        otros_trib_t = p.ingresos_otros_tributarios_0
        regalias_t = p.ingresos_regalias_0
        otros_no_trib_t = p.ingresos_otros_no_tributarios_0
        
        # Estados iniciales de componentes del gasto
        gasto_corriente_t = p.gasto_corriente_0
        transferencias_t = p.transferencias_sociales_0
        inversion_t = p.inversion_publica_0
        
        gasto = p.gasto_total_0 - p.subsidio_0  # Gasto sin subsidio
        rin = p.RIN0
        deuda_int = p.deuda_int0
        deuda_ext = p.deuda_ext0
        inflacion_anterior = p.inflacion_0

        for t in range(p.T):
            # ============================================
            # 1. PIB REAL
            # ============================================
            pib_real *= (1 + p.g_pib)
            
            # ============================================
            # 2. INFLACIÓN (antes de calcular PIB nominal)
            # ============================================
            # Expectativas de inflación (inercia + convergencia a objetivo)
            inflacion_esperada = p.persistencia_inflacion * inflacion_anterior + \
                                (1 - p.persistencia_inflacion) * p.inflacion_objetivo

            # PIB nominal (para cálculos de ratio deuda/PIB)
            pib = pib_real * (1 + inflacion_esperada)
            
            # ============================================
            # 3. INGRESOS
            # ============================================
            # Ingresos tributarios y no tributarios (crecen según elasticidades específicas)
            iva_t *= (1 + p.elasticidad_iva * p.g_pib)
            it_t *= (1 + p.elasticidad_it * p.g_pib)
            iue_t *= (1 + p.elasticidad_iue * p.g_pib)
            rc_iva_t *= (1 + p.elasticidad_rc_iva * p.g_pib)
            ice_t *= (1 + p.elasticidad_ice * p.g_pib)
            ga_t *= (1 + p.elasticidad_ga * p.g_pib)
            iehd_t *= (1 + p.elasticidad_iehd * p.g_pib)
            otros_trib_t *= (1 + p.elasticidad_otros_trib * p.g_pib)
            regalias_t *= (1 + p.elasticidad_regalias * p.g_pib)
            otros_no_trib_t *= (1 + p.elasticidad_otros_no_trib * p.g_pib)
            
            # Total ingresos no-commodities
            ingresos_no_commodities = (iva_t + it_t + iue_t + rc_iva_t + ice_t + 
                                      ga_t + iehd_t + otros_trib_t + regalias_t + otros_no_trib_t)
            
            # Ingresos del gas (tendencia + shock estocástico)
            gas_t = p.ingresos_gas_0 * ((1 + p.crecimiento_gas_base) ** (t + 1)) * shocks_gas_sim[s, t]
            
            # Ingresos de cada mineral (tendencia + shock estocástico individual)
            zinc_t = p.ingresos_zinc_0 * ((1 + p.crecimiento_zinc_base) ** (t + 1)) * shocks_zinc_sim[s, t]
            plata_t = p.ingresos_plata_0 * ((1 + p.crecimiento_plata_base) ** (t + 1)) * shocks_plata_sim[s, t]
            plomo_t = p.ingresos_plomo_0 * ((1 + p.crecimiento_plomo_base) ** (t + 1)) * shocks_plomo_sim[s, t]
            estano_t = p.ingresos_estano_0 * ((1 + p.crecimiento_estano_base) ** (t + 1)) * shocks_estano_sim[s, t]
            oro_t = p.ingresos_oro_0 * ((1 + p.crecimiento_oro_base) ** (t + 1)) * shocks_oro_sim[s, t]
            
            # Precios de commodities (usando los mismos shocks)
            precio_gas_t = p.precio_gas_0 * ((1 + p.crecimiento_gas_base) ** (t + 1)) * shocks_gas_sim[s, t]
            precio_zinc_t = p.precio_zinc_0 * ((1 + p.crecimiento_zinc_base) ** (t + 1)) * shocks_zinc_sim[s, t]
            precio_plata_t = p.precio_plata_0 * ((1 + p.crecimiento_plata_base) ** (t + 1)) * shocks_plata_sim[s, t]
            precio_plomo_t = p.precio_plomo_0 * ((1 + p.crecimiento_plomo_base) ** (t + 1)) * shocks_plomo_sim[s, t]
            precio_estano_t = p.precio_estano_0 * ((1 + p.crecimiento_estano_base) ** (t + 1)) * shocks_estano_sim[s, t]
            precio_oro_t = p.precio_oro_0 * ((1 + p.crecimiento_oro_base) ** (t + 1)) * shocks_oro_sim[s, t]
            
            # Total ingresos por minerales
            minerales_t = zinc_t + plata_t + plomo_t + estano_t + oro_t
            
            # Total de ingresos
            ingresos_t = ingresos_no_commodities + gas_t + minerales_t

            # ============================================
            # 4. SUBSIDIO
            # ============================================
            # Componente tendencial
            subsidio_base = p.subsidio_0 * ((1 + p.crecimiento_subsidio) ** (t + 1))
            
            # Ajuste por PIB (mayor PIB = mayor consumo = mayor subsidio)
            factor_pib = (pib / p.PIB0) ** p.elasticidad_subsidio_pib
            
            # Ajuste por precios internacionales (shock estocástico)
            factor_precios = shocks_precios[s, t] ** p.elasticidad_subsidio_precios
            
            # Subsidio antes de política
            subsidio_t = subsidio_base * factor_pib * factor_precios
            
            # Aplicar política de reducción de subsidio
            if p.tipo_reduccion == "gradual":
                # Reducción gradual a lo largo de los años
                reduccion_aplicada = (p.reduccion_subsidio / p.T) * (t + 1)
                reduccion_aplicada = min(reduccion_aplicada, p.reduccion_subsidio)
            else:  # discreta
                # Reducción aplicada al 100% desde el primer año
                reduccion_aplicada = p.reduccion_subsidio
            
            subsidio_t *= (1 - reduccion_aplicada)
            
            # Regla fiscal: reducir subsidio si deuda es alta
            ratio_deuda_pib = (deuda_int + deuda_ext) / pib
            if ratio_deuda_pib > 0.70:
                subsidio_t *= 0.85  # Reducción adicional 15%
            elif ratio_deuda_pib > 0.60:
                subsidio_t *= 0.95  # Reducción adicional 5%

            # ============================================
            # 5. GASTO (sin subsidio) con regla fiscal
            # ============================================
            # Componentes del gasto crecen según sus tasas específicas
            gasto_corriente_t *= (1 + p.crecimiento_gasto_corriente)
            transferencias_t *= (1 + p.crecimiento_transferencias)
            inversion_t *= (1 + p.crecimiento_inversion)
            
            # Aplicar regla fiscal si deuda es alta
            if ratio_deuda_pib > 0.70:
                # Austeridad: reducir crecimiento del gasto
                gasto_corriente_t /= 1.015  # Ajuste de austeridad
                transferencias_t /= 1.015
                inversion_t *= 0.95  # Mayor recorte en inversión
            elif ratio_deuda_pib > 0.60:
                # Moderación
                gasto_corriente_t /= 1.005
                transferencias_t /= 1.005
                inversion_t *= 0.98
            
            # Gasto total sin subsidio
            gasto = gasto_corriente_t + transferencias_t + inversion_t

            # Gasto total (incluyendo subsidio)
            gasto_total = gasto + subsidio_t

            # ============================================
            # 6. DÉFICIT PRIMARIO
            # ============================================
            deficit_primario = gasto_total - ingresos_t

            # ============================================
            # 7. INTERESES (con Efecto Fisher PARCIAL)
            # ============================================
            # Prima de riesgo por deuda/PIB
            prima_deuda = p.phi_deuda * max(0, ratio_deuda_pib - 0.6)
            
            # Efecto Fisher PARCIAL: inflación esperada aumenta tasas
            # efecto_fisher=0.60 significa que 60% de inflación se traslada a tasas
            ajuste_inflacion = p.efecto_fisher * max(0, inflacion_esperada - p.inflacion_objetivo)
            
            # Tasas nominales con efecto Fisher parcial
            tasa_ext = p.i_ext + prima_deuda + ajuste_inflacion
            tasa_int = p.i_int + prima_deuda * 0.5 + ajuste_inflacion * 0.5

            intereses_int = deuda_int * tasa_int
            intereses_ext = deuda_ext * tasa_ext
            intereses_totales = intereses_int + intereses_ext

            # ============================================
            # 8. DÉFICIT TOTAL (primario + intereses)
            # ============================================
            deficit_total = deficit_primario + intereses_totales

            # ============================================
            # 9. FINANCIAMIENTO DEL DÉFICIT
            # ============================================
            if deficit_total > 0:
                if p.tipo_financiamiento == "RIN":
                    # Financiar con RIN disponible
                    financiamiento_rin = min(rin * p.tasa_uso_rin, deficit_total)
                    financiamiento_deuda = deficit_total - financiamiento_rin
                    
                    nueva_deuda_ext = financiamiento_deuda * 0.70
                    nueva_deuda_int = financiamiento_deuda * 0.30
                else:  # tipo_financiamiento == "Deuda"
                    # Financiar principalmente con deuda
                    financiamiento_rin = 0
                    financiamiento_deuda = deficit_total
                    
                    nueva_deuda_ext = financiamiento_deuda * 0.70
                    nueva_deuda_int = financiamiento_deuda * 0.30
            else:
                # Superávit: no financiamiento
                financiamiento_rin = 0
                nueva_deuda_ext = 0
                nueva_deuda_int = 0

            # ============================================
            # 10. ACTUALIZAR DEUDA
            # ============================================
            deuda_int += nueva_deuda_int
            deuda_ext += nueva_deuda_ext

            # ============================================
            # 11. RESERVAS INTERNACIONALES (RIN)
            # ============================================
            # Entradas: fracción de ingresos de commodities (gas + minerales)
            entrada_rin = p.tasa_ahorro_gas * (gas_t + minerales_t * 0.5)  # 50% de minerales a RIN
            
            # Salidas: pago de intereses externos + financiamiento déficit
            salida_rin = intereses_ext * 0.5 + financiamiento_rin  # Solo parte de intereses
            
            rin = max(0, rin + entrada_rin - salida_rin)

            # ============================================
            # 12. INFLACIÓN REALIZADA
            # ============================================
            # Componente de déficit fiscal
            componente_deficit = p.beta_deficit * (deficit_primario / pib)
            
            # Componente de precios internacionales
            componente_precios = p.beta_precios * (shocks_precios[s, t] - 1)
            
            # Inflación realizada
            inflacion_t = inflacion_esperada + componente_deficit + componente_precios + \
                         shocks_inflacion_sim[s, t]
            
            # Limitar a rangos razonables (0% a 20%)
            inflacion_t = np.clip(inflacion_t, 0.0, 0.20)
            
            # Actualizar para próximo período
            inflacion_anterior = inflacion_t

            # ============================================
            # 13. GUARDAR RESULTADOS
            # ============================================
            deuda_interna[s, t] = deuda_int
            deuda_externa[s, t] = deuda_ext
            deuda_total[s, t] = deuda_int + deuda_ext
            deficit[s, t] = deficit_total
            PIB[s, t] = pib
            PIB_real[s, t] = pib_real
            RIN[s, t] = rin
            inflacion[s, t] = inflacion_t
            ingresos_totales[s, t] = ingresos_t
            ingresos_gas[s, t] = gas_t
            ingresos_zinc[s, t] = zinc_t
            ingresos_plata[s, t] = plata_t
            ingresos_plomo[s, t] = plomo_t
            ingresos_estano[s, t] = estano_t
            ingresos_oro[s, t] = oro_t
            ingresos_minerales_totales[s, t] = minerales_t
            
            # Guardar ingresos tributarios y no tributarios
            ingresos_iva[s, t] = iva_t
            ingresos_it[s, t] = it_t
            ingresos_iue[s, t] = iue_t
            ingresos_rc_iva[s, t] = rc_iva_t
            ingresos_ice[s, t] = ice_t
            ingresos_ga[s, t] = ga_t
            ingresos_iehd[s, t] = iehd_t
            ingresos_otros_tributarios[s, t] = otros_trib_t
            ingresos_regalias[s, t] = regalias_t
            ingresos_otros_no_tributarios[s, t] = otros_no_trib_t
            
            # Guardar componentes del gasto
            gasto_corriente[s, t] = gasto_corriente_t
            transferencias_sociales[s, t] = transferencias_t
            inversion_publica[s, t] = inversion_t
            
            precio_gas[s, t] = precio_gas_t
            precio_zinc[s, t] = precio_zinc_t
            precio_plata[s, t] = precio_plata_t
            precio_plomo[s, t] = precio_plomo_t
            precio_estano[s, t] = precio_estano_t
            precio_oro[s, t] = precio_oro_t
            gastos[s, t] = gasto_total
            subsidios[s, t] = subsidio_t
            gasto_sin_subsidio[s, t] = gasto

    return {
        "deuda_total": deuda_total,
        "deuda_interna": deuda_interna,
        "deuda_externa": deuda_externa,
        "ratio_deuda_pib": deuda_total / PIB,
        "RIN": RIN,
        "deficit": deficit,
        "PIB": PIB,
        "PIB_real": PIB_real,
        "inflacion": inflacion,
        "ingresos_totales": ingresos_totales,
        "ingresos_gas": ingresos_gas,
        "ingresos_zinc": ingresos_zinc,
        "ingresos_plata": ingresos_plata,
        "ingresos_plomo": ingresos_plomo,
        "ingresos_estano": ingresos_estano,
        "ingresos_oro": ingresos_oro,
        "ingresos_minerales_totales": ingresos_minerales_totales,
        "ingresos_iva": ingresos_iva,
        "ingresos_it": ingresos_it,
        "ingresos_iue": ingresos_iue,
        "ingresos_rc_iva": ingresos_rc_iva,
        "ingresos_ice": ingresos_ice,
        "ingresos_ga": ingresos_ga,
        "ingresos_iehd": ingresos_iehd,
        "ingresos_otros_tributarios": ingresos_otros_tributarios,
        "ingresos_regalias": ingresos_regalias,
        "ingresos_otros_no_tributarios": ingresos_otros_no_tributarios,
        "precio_gas": precio_gas,
        "precio_zinc": precio_zinc,
        "precio_plata": precio_plata,
        "precio_plomo": precio_plomo,
        "precio_estano": precio_estano,
        "precio_oro": precio_oro,
        "gastos": gastos,
        "gasto_sin_subsidio": gasto_sin_subsidio,
        "subsidios": subsidios,
        "gasto_corriente": gasto_corriente,
        "transferencias_sociales": transferencias_sociales,
        "inversion_publica": inversion_publica
    }