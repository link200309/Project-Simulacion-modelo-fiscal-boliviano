# ==============================================================
# GENERACIÓN DE SHOCKS ESTOCÁSTICOS PARA COMMODITIES
# Sistema de Simulación Fiscal - Bolivia
# ==============================================================

"""
Este módulo implementa la generación de shocks estocásticos para
los precios internacionales de commodities (Gas y Minerales) utilizando
Procesos Estocásticos Lognormales.

PROCESO ESTOCÁSTICO IMPLEMENTADO:
==================================
Se utiliza un Movimiento Browniano Geométrico (GBM) discretizado,
que es apropiado para modelar precios de commodities porque:
1. Los precios nunca son negativos
2. Los retornos son aproximadamente normales
3. La volatilidad es proporcional al nivel de precio

FORMULACIÓN MATEMÁTICA:
======================
Para el precio P_t en el tiempo t:

    dP_t = μ * P_t * dt + σ * P_t * dW_t

Donde:
- μ: tasa de crecimiento esperada (drift)
- σ: volatilidad (desviación estándar de los retornos)
- dW_t: incremento de Wiener (proceso estocástico Browniano)

DISCRETIZACIÓN:
===============
Para simulación numérica, se usa la forma discreta:

    P_{t+1} = P_t * exp((μ - σ²/2) * Δt + σ * √Δt * Z_t)

Donde:
- Z_t ~ N(0,1): variable aleatoria normal estándar
- Δt: paso de tiempo (1 año en nuestro caso)
- σ²/2: corrección de Itô para mantener E[P_{t+1}] = P_t * exp(μ*Δt)

IMPLEMENTACIÓN EN EL MODELO:
============================
En el modelo fiscal usamos factores multiplicativos estocásticos:

    Ingreso_t = Ingreso_base * Tendencia_t * Shock_t

Donde:
    Shock_t = exp(σ * Z_t - σ²/2)

La corrección -σ²/2 asegura que E[Shock_t] = 1, es decir,
en promedio los shocks no sesgan la tendencia.

PARÁMETROS DE VOLATILIDAD:
==========================
- Gas Natural (σ_gas = 0.20): Volatilidad 20%
  * Representa fluctuaciones en precio internacional del gas
  * Basado en datos históricos del mercado energético
  
- Minerales (σ_minerales = 0.30): Volatilidad 30%
  * Mayor volatilidad que el gas
  * Refleja la variabilidad de precios de zinc, plata, estaño, etc.
  * Mercados más especulativos y cíclicos

- Precios Combustibles (σ_precios = 0.25): Volatilidad 25%
  * Afecta el costo de subsidios
  * Representa fluctuaciones en precio del petróleo

INTERPRETACIÓN DE RESULTADOS:
=============================
Un shock de 1.2 significa que el precio es 20% mayor al esperado
Un shock de 0.8 significa que el precio es 20% menor al esperado

Con σ = 0.20, aproximadamente:
- 68% de los shocks estarán entre 0.82 y 1.22 (±1 desviación estándar)
- 95% de los shocks estarán entre 0.67 y 1.49 (±2 desviaciones estándar)

REFERENCIAS:
============
- Black, F., & Scholes, M. (1973). The Pricing of Options and Corporate Liabilities
- Hull, J. C. (2018). Options, Futures, and Other Derivatives
- Schwartz, E. S. (1997). The stochastic behavior of commodity prices
"""

import numpy as np
from typing import Tuple


def generar_shock_lognormal(
    T: int,
    n_sim: int,
    sigma: float,
    rng: np.random.Generator
) -> np.ndarray:
    """
    Genera shocks estocásticos lognormales para precios de commodities.
    
    Args:
        T: Número de períodos (años)
        n_sim: Número de simulaciones Monte Carlo
        sigma: Volatilidad (desviación estándar anualizada)
        rng: Generador de números aleatorios
        
    Returns:
        Matriz (n_sim, T) de factores multiplicativos estocásticos
        
    Ejemplo:
        >>> rng = np.random.default_rng(42)
        >>> shocks = generar_shock_lognormal(6, 1000, 0.20, rng)
        >>> # Media aproximadamente 1.0
        >>> print(f"Media: {shocks.mean():.3f}")
        Media: 1.000
    """
    # Generar variables aleatorias normales estándar
    Z = rng.normal(0, sigma, size=(n_sim, T))
    
    # Aplicar transformación lognormal con corrección de Itô
    # E[exp(Z)] = exp(σ²/2), por lo tanto restamos σ²/2 para que E[shock] = 1
    shocks = np.exp(Z - sigma**2 / 2)
    
    return shocks


def generar_trayectoria_precios(
    precio_inicial: float,
    T: int,
    n_sim: int,
    mu: float,
    sigma: float,
    rng: np.random.Generator
) -> np.ndarray:
    """
    Genera trayectorias completas de precios usando Movimiento Browniano Geométrico.
    
    Args:
        precio_inicial: Precio en t=0
        T: Número de períodos
        n_sim: Número de simulaciones
        mu: Tasa de crecimiento esperada (drift)
        sigma: Volatilidad
        rng: Generador de números aleatorios
        
    Returns:
        Matriz (n_sim, T+1) con trayectorias de precios (incluye t=0)
        
    Ejemplo:
        >>> rng = np.random.default_rng(42)
        >>> precios = generar_trayectoria_precios(100, 6, 1000, 0.02, 0.20, rng)
        >>> print(f"Precio inicial: {precios[0, 0]:.2f}")
        Precio inicial: 100.00
        >>> print(f"Precio final promedio: {precios[:, -1].mean():.2f}")
        Precio final promedio: 112.75
    """
    # Inicializar matriz de precios
    precios = np.zeros((n_sim, T + 1))
    precios[:, 0] = precio_inicial
    
    # Generar shocks para cada período
    for t in range(1, T + 1):
        Z = rng.normal(0, 1, size=n_sim)
        precios[:, t] = precios[:, t-1] * np.exp((mu - sigma**2/2) + sigma * Z)
    
    return precios


def estadisticas_shocks(shocks: np.ndarray) -> dict:
    """
    Calcula estadísticas descriptivas de los shocks generados.
    
    Args:
        shocks: Matriz (n_sim, T) de shocks estocásticos
        
    Returns:
        Diccionario con estadísticas por período
    """
    T = shocks.shape[1]
    stats = {}
    
    for t in range(T):
        shocks_t = shocks[:, t]
        stats[f"periodo_{t+1}"] = {
            "media": float(shocks_t.mean()),
            "mediana": float(np.median(shocks_t)),
            "std": float(shocks_t.std()),
            "min": float(shocks_t.min()),
            "max": float(shocks_t.max()),
            "p05": float(np.percentile(shocks_t, 5)),
            "p95": float(np.percentile(shocks_t, 95))
        }
    
    return stats


# ==============================================================
# EJEMPLO DE USO
# ==============================================================

if __name__ == "__main__":
    print("=" * 70)
    print("GENERACIÓN DE SHOCKS ESTOCÁSTICOS PARA COMMODITIES")
    print("=" * 70)
    
    # Parámetros
    T = 6  # 2020-2025
    n_sim = 1000
    sigma_gas = 0.20
    sigma_minerales = 0.30
    
    # Generar shocks
    rng = np.random.default_rng(42)
    shocks_gas = generar_shock_lognormal(T, n_sim, sigma_gas, rng)
    shocks_minerales = generar_shock_lognormal(T, n_sim, sigma_minerales, rng)
    
    print("\n📊 ESTADÍSTICAS DE SHOCKS - GAS (σ = 0.20)")
    print("-" * 70)
    stats_gas = estadisticas_shocks(shocks_gas)
    for periodo, valores in stats_gas.items():
        print(f"\n{periodo}:")
        print(f"  Media: {valores['media']:.3f}")
        print(f"  P05-P95: [{valores['p05']:.3f}, {valores['p95']:.3f}]")
        print(f"  Rango: [{valores['min']:.3f}, {valores['max']:.3f}]")
    
    print("\n📊 ESTADÍSTICAS DE SHOCKS - MINERALES (σ = 0.30)")
    print("-" * 70)
    stats_minerales = estadisticas_shocks(shocks_minerales)
    for periodo, valores in stats_minerales.items():
        print(f"\n{periodo}:")
        print(f"  Media: {valores['media']:.3f}")
        print(f"  P05-P95: [{valores['p05']:.3f}, {valores['p95']:.3f}]")
        print(f"  Rango: [{valores['min']:.3f}, {valores['max']:.3f}]")
    
    print("\n" + "=" * 70)
    print("✅ Generación de shocks completada")
    print("=" * 70)
    
    # Ejemplo de trayectorias de precios
    print("\n📈 EJEMPLO: TRAYECTORIAS DE PRECIOS")
    print("-" * 70)
    
    precio_gas_inicial = 4.5  # USD/MMBTU
    precio_minerales_inicial = 1800  # USD/tonelada (ej: zinc)
    
    trayectorias_gas = generar_trayectoria_precios(
        precio_gas_inicial, T, n_sim, 0.01, sigma_gas, rng
    )
    
    trayectorias_minerales = generar_trayectoria_precios(
        precio_minerales_inicial, T, n_sim, 0.015, sigma_minerales, rng
    )
    
    print(f"\nGas Natural:")
    print(f"  Precio inicial: ${precio_gas_inicial:.2f}/MMBTU")
    print(f"  Precio final esperado: ${trayectorias_gas[:, -1].mean():.2f}/MMBTU")
    print(f"  Rango final (P05-P95): [${np.percentile(trayectorias_gas[:, -1], 5):.2f}, "
          f"${np.percentile(trayectorias_gas[:, -1], 95):.2f}]")
    
    print(f"\nMinerales:")
    print(f"  Precio inicial: ${precio_minerales_inicial:.2f}/ton")
    print(f"  Precio final esperado: ${trayectorias_minerales[:, -1].mean():.2f}/ton")
    print(f"  Rango final (P05-P95): [${np.percentile(trayectorias_minerales[:, -1], 5):.2f}, "
          f"${np.percentile(trayectorias_minerales[:, -1], 95):.2f}]")
    
    print("\n✅ Ejemplo completado\n")
