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

    # Precios base 2020 para commodities
    precio_gas_0: float = 3.0  # USD/MMBTU
    precio_zinc_0: float = 2200.0  # USD/tonelada
    precio_plata_0: float = 20.0  # USD/onza troy
    precio_plomo_0: float = 1850.0  # USD/tonelada
    precio_estano_0: float = 17000.0  # USD/tonelada

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
    crecimiento_zinc_base: float = 0.012  # tendencia base zinc
    crecimiento_plata_base: float = 0.015  # tendencia base plata
    crecimiento_plomo_base: float = 0.010  # tendencia base plomo
    crecimiento_estano_base: float = 0.018  # tendencia base estaño

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
    sigma_precios: float = 0.25  # Volatilidad precios internacionales combustibles

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


def shocks_precios_combustibles(T, n, sigma, rng):
    """
    Shocks sobre precios internacionales de combustibles
    Retorna matriz (n_sim, T) de factores multiplicativos
    """
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


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
    shocks_precios = shocks_precios_combustibles(p.T, p.n_sim, p.sigma_precios, rng)

    # Arrays para guardar resultados
    deuda_interna = np.zeros((p.n_sim, p.T))
    deuda_externa = np.zeros((p.n_sim, p.T))
    deuda_total = np.zeros((p.n_sim, p.T))
    deficit = np.zeros((p.n_sim, p.T))
    PIB = np.zeros((p.n_sim, p.T))
    RIN = np.zeros((p.n_sim, p.T))
    ingresos_totales = np.zeros((p.n_sim, p.T))
    ingresos_gas = np.zeros((p.n_sim, p.T))
    ingresos_zinc = np.zeros((p.n_sim, p.T))
    ingresos_plata = np.zeros((p.n_sim, p.T))
    ingresos_plomo = np.zeros((p.n_sim, p.T))
    ingresos_estano = np.zeros((p.n_sim, p.T))
    ingresos_minerales_totales = np.zeros((p.n_sim, p.T))
    gastos = np.zeros((p.n_sim, p.T))
    subsidios = np.zeros((p.n_sim, p.T))
    gasto_sin_subsidio = np.zeros((p.n_sim, p.T))
    
    # Arrays para precios de commodities
    precio_gas = np.zeros((p.n_sim, p.T))
    precio_zinc = np.zeros((p.n_sim, p.T))
    precio_plata = np.zeros((p.n_sim, p.T))
    precio_plomo = np.zeros((p.n_sim, p.T))
    precio_estano = np.zeros((p.n_sim, p.T))

    # Separar ingresos no-commodities desde el inicio (excluir gas y minerales)
    ingresos_minerales_base_0 = p.ingresos_zinc_0 + p.ingresos_plata_0 + p.ingresos_plomo_0 + p.ingresos_estano_0
    ingresos_no_commodities_0 = p.ingresos_totales_0 - p.ingresos_gas_0 - ingresos_minerales_base_0

    for s in range(p.n_sim):
        # Estados iniciales
        pib = p.PIB0
        ingresos_no_commodities = ingresos_no_commodities_0
        gasto = p.gasto_total_0 - p.subsidio_0  # Gasto sin subsidio
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
            # Ingresos no-commodities (crecen con elasticidad al PIB)
            ingresos_no_commodities *= (1 + p.elasticidad_ingresos * p.g_pib)
            
            # Ingresos del gas (tendencia + shock estocástico)
            gas_t = p.ingresos_gas_0 * ((1 + p.crecimiento_gas_base) ** (t + 1)) * shocks_gas_sim[s, t]
            
            # Ingresos de cada mineral (tendencia + shock estocástico individual)
            zinc_t = p.ingresos_zinc_0 * ((1 + p.crecimiento_zinc_base) ** (t + 1)) * shocks_zinc_sim[s, t]
            plata_t = p.ingresos_plata_0 * ((1 + p.crecimiento_plata_base) ** (t + 1)) * shocks_plata_sim[s, t]
            plomo_t = p.ingresos_plomo_0 * ((1 + p.crecimiento_plomo_base) ** (t + 1)) * shocks_plomo_sim[s, t]
            estano_t = p.ingresos_estano_0 * ((1 + p.crecimiento_estano_base) ** (t + 1)) * shocks_estano_sim[s, t]
            
            # Precios de commodities (usando los mismos shocks)
            precio_gas_t = p.precio_gas_0 * ((1 + p.crecimiento_gas_base) ** (t + 1)) * shocks_gas_sim[s, t]
            precio_zinc_t = p.precio_zinc_0 * ((1 + p.crecimiento_zinc_base) ** (t + 1)) * shocks_zinc_sim[s, t]
            precio_plata_t = p.precio_plata_0 * ((1 + p.crecimiento_plata_base) ** (t + 1)) * shocks_plata_sim[s, t]
            precio_plomo_t = p.precio_plomo_0 * ((1 + p.crecimiento_plomo_base) ** (t + 1)) * shocks_plomo_sim[s, t]
            precio_estano_t = p.precio_estano_0 * ((1 + p.crecimiento_estano_base) ** (t + 1)) * shocks_estano_sim[s, t]
            
            # Total ingresos por minerales
            minerales_t = zinc_t + plata_t + plomo_t + estano_t
            
            # Total de ingresos
            ingresos_t = ingresos_no_commodities + gas_t + minerales_t

            # ============================================
            # 3. SUBSIDIO
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
            # 4. GASTO (sin subsidio) con regla fiscal
            # ============================================
            if ratio_deuda_pib > 0.70:
                # Austeridad: gasto crece más lento
                gasto *= (1 + p.crecimiento_gasto * 0.5)
            elif ratio_deuda_pib > 0.60:
                # Moderación
                gasto *= (1 + p.crecimiento_gasto * 0.8)
            else:
                # Normal
                gasto *= (1 + p.crecimiento_gasto)

            # Gasto total (incluyendo subsidio)
            gasto_total = gasto + subsidio_t

            # ============================================
            # 5. DÉFICIT PRIMARIO
            # ============================================
            deficit_primario = gasto_total - ingresos_t

            # ============================================
            # 6. INTERESES
            # ============================================
            # Prima de riesgo (aumenta con ratio deuda/PIB)
            prima = p.phi_deuda * max(0, ratio_deuda_pib - 0.6)
            tasa_ext = p.i_ext + prima
            tasa_int = p.i_int + prima * 0.5  # Prima menor en deuda interna

            intereses_int = deuda_int * tasa_int
            intereses_ext = deuda_ext * tasa_ext
            intereses_totales = intereses_int + intereses_ext

            # ============================================
            # 7. DÉFICIT TOTAL (primario + intereses)
            # ============================================
            deficit_total = deficit_primario + intereses_totales

            # ============================================
            # 8. FINANCIAMIENTO DEL DÉFICIT
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
            # 9. ACTUALIZAR DEUDA
            # ============================================
            deuda_int += nueva_deuda_int
            deuda_ext += nueva_deuda_ext

            # ============================================
            # 10. RESERVAS INTERNACIONALES (RIN)
            # ============================================
            # Entradas: fracción de ingresos de commodities (gas + minerales)
            entrada_rin = p.tasa_ahorro_gas * (gas_t + minerales_t * 0.5)  # 50% de minerales a RIN
            
            # Salidas: pago de intereses externos + financiamiento déficit
            salida_rin = intereses_ext * 0.5 + financiamiento_rin  # Solo parte de intereses
            
            rin = max(0, rin + entrada_rin - salida_rin)

            # ============================================
            # 11. GUARDAR RESULTADOS
            # ============================================
            # 11. GUARDAR RESULTADOS
            # ============================================
            deuda_interna[s, t] = deuda_int
            deuda_externa[s, t] = deuda_ext
            deuda_total[s, t] = deuda_int + deuda_ext
            deficit[s, t] = deficit_total
            PIB[s, t] = pib
            RIN[s, t] = rin
            ingresos_totales[s, t] = ingresos_t
            ingresos_gas[s, t] = gas_t
            ingresos_zinc[s, t] = zinc_t
            ingresos_plata[s, t] = plata_t
            ingresos_plomo[s, t] = plomo_t
            ingresos_estano[s, t] = estano_t
            ingresos_minerales_totales[s, t] = minerales_t
            
            precio_gas[s, t] = precio_gas_t
            precio_zinc[s, t] = precio_zinc_t
            precio_plata[s, t] = precio_plata_t
            precio_plomo[s, t] = precio_plomo_t
            precio_estano[s, t] = precio_estano_t
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
        "ingresos_totales": ingresos_totales,
        "ingresos_gas": ingresos_gas,
        "ingresos_zinc": ingresos_zinc,
        "ingresos_plata": ingresos_plata,
        "ingresos_plomo": ingresos_plomo,
        "ingresos_estano": ingresos_estano,
        "ingresos_minerales_totales": ingresos_minerales_totales,
        "precio_gas": precio_gas,
        "precio_zinc": precio_zinc,
        "precio_plata": precio_plata,
        "precio_plomo": precio_plomo,
        "precio_estano": precio_estano,
        "gastos": gastos,
        "subsidios": subsidios,
        "gasto_sin_subsidio": gasto_sin_subsidio
    }