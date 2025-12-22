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
    gasto_total_0: float = 115_000
    ingresos_gas_0: float = 13_394
    ingresos_zinc_0: float = 2_500
    ingresos_plata_0: float = 2_000
    ingresos_plomo_0: float = 1_500
    ingresos_estano_0: float = 2_500
    ingresos_oro_0: float = 3_000
    
    # Ingresos tributarios (millones Bs, año 2020)
    ingresos_iva_0: float = 25_000  # IVA (Impuesto al Valor Agregado)
    ingresos_it_0: float = 8_000  # IT (Impuestos a las Transacciones)
    ingresos_iue_0: float = 7_500  # IUE (Impuesto sobre Utilidades de Empresas)
    ingresos_rc_iva_0: float = 6_500  # RC-IVA (Régimen Complementario al IVA)
    ingresos_ice_0: float = 4_500  # ICE (Impuesto a Consumos Específicos)
    ingresos_ga_0: float = 3_000  # GA (Gravamen Arancelario)
    ingresos_iehd_0: float = 2_500  # IEHD (Impuesto Especial a Hidrocarburos y Derivados)
    ingresos_otros_tributarios_0: float = 3_500  # Otros ingresos tributarios
    ingresos_regalias_0: float = 4_000
    
    # Ingresos no tributarios (millones Bs, año 2020)
    ingresos_empresas_publicas_0: float = 1_800
    ingresos_donaciones_0: float = 800
    ingresos_otros_no_tributarios_0: float = 400

    # Precios base 2020 para commodities
    precio_gas_0: float = 3.0  # USD/MMBTU
    precio_zinc_0: float = 2200.0  # USD/tonelada
    precio_plata_0: float = 20.0  # USD/onza troy
    precio_plomo_0: float = 1850.0  # USD/tonelada
    precio_estano_0: float = 17000.0  # USD/tonelada
    precio_oro_0: float = 1800.0  # USD/onza troy

    # Parámetros de habilitación de commodities (si Bolivia los exporta o no)
    gas_habilitado: bool = True
    zinc_habilitado: bool = True
    plata_habilitado: bool = True
    plomo_habilitado: bool = True
    estano_habilitado: bool = True
    oro_habilitado: bool = True

    deuda_int0: float = 69_300
    deuda_ext0: float = 82_800
    RIN0: float = 36_900
    
    # Gasto público (millones Bs, año 2020)
    gasto_corriente_0: float = 55_000
    transferencias_sociales_0: float = 20_000
    inversion_publica_0: float = 28_000
    
    # Desglose de gasto corriente (millones Bs, año 2020)
    sueldos_salarios_0: float = 28_000  # ~51% del gasto corriente
    bienes_servicios_0: float = 18_000  # ~33% del gasto corriente
    otros_gastos_corrientes_0: float = 9_000  # ~16% del gasto corriente
    
    # Desglose de transferencias sociales (millones Bs, año 2020)
    bonos_sociales_0: float = 5_000  # ~25% de transferencias
    pensiones_0: float = 8_000  # ~40% de transferencias
    gobiernos_subnacionales_0: float = 5_000  # ~25% de transferencias
    otras_transferencias_0: float = 2_000  # ~10% de transferencias

    # ------------------------------
    # Parámetros macroeconómicos
    # ------------------------------
    g_pib: float = 0.022
    i_int: float = 0.025
    i_ext: float = 0.051

    # ------------------------------
    # Dinámica fiscal
    # ------------------------------
    elasticidad_ingresos: float = 1.0
    crecimiento_gasto: float = 0.018
    crecimiento_gasto_corriente: float = 0.020
    crecimiento_transferencias: float = 0.025
    crecimiento_inversion: float = 0.015
    
    # Elasticidades (respecto al PIB)
    elasticidad_iva: float = 1.1
    elasticidad_it: float = 1.0
    elasticidad_iue: float = 1.3
    elasticidad_rc_iva: float = 1.1
    elasticidad_ice: float = 0.8
    elasticidad_ga: float = 1.0
    elasticidad_iehd: float = 0.9
    elasticidad_otros_trib: float = 0.9
    elasticidad_regalias: float = 1.2
    elasticidad_empresas_publicas: float = 0.8
    elasticidad_donaciones: float = 0.5
    elasticidad_otros_no_trib: float = 0.7
    
    # Tasas de crecimiento base de commodities
    crecimiento_gas_base: float = 0.01
    crecimiento_zinc_base: float = 0.012
    crecimiento_plata_base: float = 0.015
    crecimiento_plomo_base: float = 0.010
    crecimiento_estano_base: float = 0.018
    crecimiento_oro_base: float = 0.020

    # ------------------------------
    # Subsidios
    # ------------------------------
    subsidio_0: float = 12_000
    crecimiento_subsidio: float = 0.015
    elasticidad_subsidio_pib: float = 0.8
    elasticidad_subsidio_precios: float = 1.2
    reduccion_subsidio: float = 0.0
    tipo_reduccion: str = "gradual"

    # ------------------------------
    # Volatilidades (shocks estocásticos)
    # ------------------------------
    sigma_gas: float = 0.20
    sigma_zinc: float = 0.25
    sigma_plata: float = 0.30
    sigma_plomo: float = 0.22
    sigma_estano: float = 0.28
    sigma_oro: float = 0.18
    sigma_precios: float = 0.25

    # ------------------------------
    # Riesgo y financiamiento
    # ------------------------------
    phi_deuda: float = 0.02
    tipo_financiamiento: str = "Deuda"
    tasa_ahorro_gas: float = 0.30
    tasa_uso_rin: float = 0.20

    # ------------------------------
    # Inflación
    # ------------------------------
    inflacion_0: float = 0.014
    inflacion_objetivo: float = 0.03
    beta_deficit: float = 0.40
    beta_precios: float = 0.35
    persistencia_inflacion: float = 0.50
    sigma_inflacion: float = 0.012
    efecto_fisher: float = 0.60


# ==============================================================
# SHOCKS ESTOCÁSTICOS
# ==============================================================

def shocks_gas(T, n, sigma, rng):
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_zinc(T, n, sigma, rng):
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_plata(T, n, sigma, rng):
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_plomo(T, n, sigma, rng):
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_estano(T, n, sigma, rng):
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_oro(T, n, sigma, rng):
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_precios_combustibles(T, n, sigma, rng):
    Z = rng.normal(0, sigma, size=(n, T))
    return np.exp(Z - sigma**2 / 2)


def shocks_inflacion(T, n, sigma, rng):
    return rng.normal(0, sigma, size=(n, T))


# ==============================================================
# MODELO FISCAL DINÁMICO
# ==============================================================

def simular_modelo(p: Parametros, seed=None) -> Dict[str, np.ndarray]:
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
    ingresos_empresas_publicas = np.zeros((p.n_sim, p.T))
    ingresos_donaciones = np.zeros((p.n_sim, p.T))
    ingresos_otros_no_tributarios = np.zeros((p.n_sim, p.T))
    
    # Arrays para componentes del gasto
    gasto_corriente = np.zeros((p.n_sim, p.T))
    transferencias_sociales = np.zeros((p.n_sim, p.T))
    inversion_publica = np.zeros((p.n_sim, p.T))
    gastos = np.zeros((p.n_sim, p.T))
    subsidios = np.zeros((p.n_sim, p.T))
    gasto_sin_subsidio = np.zeros((p.n_sim, p.T))
    
    # Arrays para desglose de gasto corriente
    sueldos_salarios = np.zeros((p.n_sim, p.T))
    bienes_servicios = np.zeros((p.n_sim, p.T))
    otros_gastos_corrientes = np.zeros((p.n_sim, p.T))
    
    # Arrays para desglose de transferencias sociales
    bonos_sociales = np.zeros((p.n_sim, p.T))
    pensiones = np.zeros((p.n_sim, p.T))
    gobiernos_subnacionales = np.zeros((p.n_sim, p.T))
    otras_transferencias = np.zeros((p.n_sim, p.T))
    
    # Arrays para precios de commodities
    precio_gas = np.zeros((p.n_sim, p.T))
    precio_zinc = np.zeros((p.n_sim, p.T))
    precio_plata = np.zeros((p.n_sim, p.T))
    precio_plomo = np.zeros((p.n_sim, p.T))
    precio_estano = np.zeros((p.n_sim, p.T))
    precio_oro = np.zeros((p.n_sim, p.T))

    # Calcular cantidades físicas implícitas a partir de ingresos y precios de referencia FIJOS
    # IMPORTANTE: Usamos precios de referencia fijos para que la cantidad física sea constante
    # Cuando el usuario cambia precio_*_0, cambia el precio pero NO la producción física
    TC = 6.96  # Tipo de cambio Bs/USD (2020)
    
    # Precios de referencia fijos del año 2020 (datos históricos reales)
    # Estos NO cambian aunque el usuario modifique los precios base
    PRECIO_GAS_REF = 3.0  # USD/MMBTU (precio histórico 2020)
    PRECIO_ZINC_REF = 2200.0  # USD/tonelada
    PRECIO_PLATA_REF = 20.0  # USD/onza troy
    PRECIO_PLOMO_REF = 1850.0  # USD/tonelada
    PRECIO_ESTANO_REF = 17000.0  # USD/tonelada
    PRECIO_ORO_REF = 1800.0  # USD/onza troy
    
    # Calcular cantidades físicas usando precios de REFERENCIA
    # Cantidad física = Ingresos históricos / (Precio histórico × TC)
    # Estas cantidades representan la producción física real y NO cambian con precio_*_0
    cantidad_gas_base = p.ingresos_gas_0 / (PRECIO_GAS_REF * TC)
    cantidad_zinc_base = p.ingresos_zinc_0 / (PRECIO_ZINC_REF * TC)
    cantidad_plata_base = p.ingresos_plata_0 / (PRECIO_PLATA_REF * TC)
    cantidad_plomo_base = p.ingresos_plomo_0 / (PRECIO_PLOMO_REF * TC)
    cantidad_estano_base = p.ingresos_estano_0 / (PRECIO_ESTANO_REF * TC)
    cantidad_oro_base = p.ingresos_oro_0 / (PRECIO_ORO_REF * TC)

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
        empresas_publicas_t = p.ingresos_empresas_publicas_0
        donaciones_t = p.ingresos_donaciones_0
        otros_no_trib_t = p.ingresos_otros_no_tributarios_0
        
        # Estados iniciales de componentes del gasto
        gasto_corriente_t = p.gasto_corriente_0
        transferencias_t = p.transferencias_sociales_0
        inversion_t = p.inversion_publica_0
        
        # Estados iniciales de desglose de gasto corriente
        sueldos_salarios_t = p.sueldos_salarios_0
        bienes_servicios_t = p.bienes_servicios_0
        otros_gastos_corrientes_t = p.otros_gastos_corrientes_0
        
        # Estados iniciales de desglose de transferencias sociales
        bonos_sociales_t = p.bonos_sociales_0
        pensiones_t = p.pensiones_0
        gobiernos_subnacionales_t = p.gobiernos_subnacionales_0
        otras_transferencias_t = p.otras_transferencias_0
        
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
            empresas_publicas_t *= (1 + p.elasticidad_empresas_publicas * p.g_pib)
            donaciones_t *= (1 + p.elasticidad_donaciones * p.g_pib)
            otros_no_trib_t *= (1 + p.elasticidad_otros_no_trib * p.g_pib)
            
            # Total ingresos no-commodities
            ingresos_no_commodities = (iva_t + it_t + iue_t + rc_iva_t + ice_t + 
                                      ga_t + iehd_t + otros_trib_t + empresas_publicas_t + 
                                      donaciones_t + otros_no_trib_t + regalias_t)
            
            # Calcular precios de commodities en USD (con tendencia + shock estocástico)
            precio_gas_t = p.precio_gas_0 * ((1 + p.crecimiento_gas_base) ** (t + 1)) * shocks_gas_sim[s, t]
            precio_zinc_t = p.precio_zinc_0 * ((1 + p.crecimiento_zinc_base) ** (t + 1)) * shocks_zinc_sim[s, t]
            precio_plata_t = p.precio_plata_0 * ((1 + p.crecimiento_plata_base) ** (t + 1)) * shocks_plata_sim[s, t]
            precio_plomo_t = p.precio_plomo_0 * ((1 + p.crecimiento_plomo_base) ** (t + 1)) * shocks_plomo_sim[s, t]
            precio_estano_t = p.precio_estano_0 * ((1 + p.crecimiento_estano_base) ** (t + 1)) * shocks_estano_sim[s, t]
            precio_oro_t = p.precio_oro_0 * ((1 + p.crecimiento_oro_base) ** (t + 1)) * shocks_oro_sim[s, t]
            
            # Calcular cantidades con crecimiento de producción (más moderado que precios)
            # Asumimos crecimiento de producción = 50% del crecimiento de precios
            cantidad_gas_t = cantidad_gas_base * ((1 + p.crecimiento_gas_base * 0.5) ** (t + 1))
            cantidad_zinc_t = cantidad_zinc_base * ((1 + p.crecimiento_zinc_base * 0.5) ** (t + 1))
            cantidad_plata_t = cantidad_plata_base * ((1 + p.crecimiento_plata_base * 0.5) ** (t + 1))
            cantidad_plomo_t = cantidad_plomo_base * ((1 + p.crecimiento_plomo_base * 0.5) ** (t + 1))
            cantidad_estano_t = cantidad_estano_base * ((1 + p.crecimiento_estano_base * 0.5) ** (t + 1))
            cantidad_oro_t = cantidad_oro_base * ((1 + p.crecimiento_oro_base * 0.5) ** (t + 1))
            
            # Ingresos (Bs) = Precio (USD) × TC (Bs/USD) × Cantidad
            # Si el commodity está deshabilitado, los ingresos son 0 (Bolivia no lo exporta)
            gas_t = precio_gas_t * TC * cantidad_gas_t if p.gas_habilitado else 0
            zinc_t = precio_zinc_t * TC * cantidad_zinc_t if p.zinc_habilitado else 0
            plata_t = precio_plata_t * TC * cantidad_plata_t if p.plata_habilitado else 0
            plomo_t = precio_plomo_t * TC * cantidad_plomo_t if p.plomo_habilitado else 0
            estano_t = precio_estano_t * TC * cantidad_estano_t if p.estano_habilitado else 0
            oro_t = precio_oro_t * TC * cantidad_oro_t if p.oro_habilitado else 0
            
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
            
            # Actualizar desglose de gasto corriente (mantienen proporciones)
            sueldos_salarios_t *= (1 + p.crecimiento_gasto_corriente)
            bienes_servicios_t *= (1 + p.crecimiento_gasto_corriente)
            otros_gastos_corrientes_t *= (1 + p.crecimiento_gasto_corriente)
            
            # Actualizar desglose de transferencias sociales (mantienen proporciones)
            bonos_sociales_t *= (1 + p.crecimiento_transferencias)
            pensiones_t *= (1 + p.crecimiento_transferencias)
            gobiernos_subnacionales_t *= (1 + p.crecimiento_transferencias)
            otras_transferencias_t *= (1 + p.crecimiento_transferencias)
            
            # Aplicar regla fiscal si deuda es alta
            if ratio_deuda_pib > 0.70:
                # Austeridad: reducir crecimiento del gasto
                gasto_corriente_t /= 1.015  # Ajuste de austeridad
                transferencias_t /= 1.015
                inversion_t *= 0.95  # Mayor recorte en inversión
                # Aplicar también al desglose
                sueldos_salarios_t /= 1.015
                bienes_servicios_t /= 1.015
                otros_gastos_corrientes_t /= 1.015
                bonos_sociales_t /= 1.015
                pensiones_t /= 1.015
                gobiernos_subnacionales_t /= 1.015
                otras_transferencias_t /= 1.015
            elif ratio_deuda_pib > 0.60:
                # Moderación
                gasto_corriente_t /= 1.005
                transferencias_t /= 1.005
                inversion_t *= 0.98
                # Aplicar también al desglose
                sueldos_salarios_t /= 1.005
                bienes_servicios_t /= 1.005
                otros_gastos_corrientes_t /= 1.005
                bonos_sociales_t /= 1.005
                pensiones_t /= 1.005
                gobiernos_subnacionales_t /= 1.005
                otras_transferencias_t /= 1.005
            
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
            ingresos_empresas_publicas[s, t] = empresas_publicas_t
            ingresos_donaciones[s, t] = donaciones_t
            ingresos_otros_no_tributarios[s, t] = otros_no_trib_t
            
            # Guardar componentes del gasto
            gasto_corriente[s, t] = gasto_corriente_t
            transferencias_sociales[s, t] = transferencias_t
            inversion_publica[s, t] = inversion_t
            
            # Guardar desglose de gasto corriente
            sueldos_salarios[s, t] = sueldos_salarios_t
            bienes_servicios[s, t] = bienes_servicios_t
            otros_gastos_corrientes[s, t] = otros_gastos_corrientes_t
            
            # Guardar desglose de transferencias sociales
            bonos_sociales[s, t] = bonos_sociales_t
            pensiones[s, t] = pensiones_t
            gobiernos_subnacionales[s, t] = gobiernos_subnacionales_t
            otras_transferencias[s, t] = otras_transferencias_t
            
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
        "ingresos_empresas_publicas": ingresos_empresas_publicas,
        "ingresos_donaciones": ingresos_donaciones,
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
        "inversion_publica": inversion_publica,
        "sueldos_salarios": sueldos_salarios,
        "bienes_servicios": bienes_servicios,
        "otros_gastos_corrientes": otros_gastos_corrientes,
        "bonos_sociales": bonos_sociales,
        "pensiones": pensiones,
        "gobiernos_subnacionales": gobiernos_subnacionales,
        "otras_transferencias": otras_transferencias
    }