# ==============================================================
# MODELO FISCAL ESTOCÁSTICO – BOLIVIA (2020–2025)
# --------------------------------------------------------------
# Tipo de modelo:
#  - Modelo fiscal causal y estocástico
#  - Ecuaciones en diferencias (tiempo discreto, anual)
#  - Shocks estocásticos sobre precios de commodities
#  - Simulación Monte Carlo (>= 1000 trayectorias)

import numpy as np
import pandas as pd
from dataclasses import dataclass
from typing import Dict

# ==============================================================
# PARÁMETROS DEL MODELO
# ==============================================================

@dataclass
class Parametros:
    # ==================================================
    # Horizonte de simulación
    # ==================================================
    T: int = 5                  # Años a simular (2020–2025)
    n_sim: int = 1000           # Número de trayectorias Monte Carlo

    # ==================================================
    # Condiciones iniciales – Año base 2020
    # Todas las magnitudes monetarias en millones de Bs
    # ==================================================
    deuda_int0: float = 69_300      # Deuda pública interna 2020 (millones Bs)
    deuda_ext0: float = 82_800      # Deuda pública externa 2020 (millones Bs)
    RIN0: float = 36_900            # Reservas Internacionales Netas 2020 (millones Bs)
    PIB0: float = 256_600           # PIB nominal 2020 (millones Bs)

    # ==================================================
    # Parámetros macroeconómicos estructurales
    # ==================================================
    g_pib: float = 0.022            # Crecimiento real promedio del PIB (2,2%)
    i_ext: float = 0.051            # Tasa promedio deuda externa (5,1%)

    # ==================================================
    # Ingresos fiscales estructurales
    # ==================================================
    tau_trib: float = 0.138         # Presión tributaria (13,8% del PIB)
    q_gas: float = 1.0              # Volumen base de gas (índice)
    q_min: float = 1.0              # Volumen base minero (índice)
    alpha_gas: float = 1.0          # Elasticidad ingreso gas–precio
    alpha_min: float = 1.0          # Elasticidad ingreso minero–precio

    # ==================================================
    # Gasto público (como % del PIB)
    # ==================================================
    gasto_corr0: float = 0.393      # Gasto corriente / PIB (2020)
    gasto_cap0: float = 0.065       # Gasto de capital / PIB (2020)
    subsidio_comb: float = 0.038    # Subsidios a combustibles / PIB

    # ==================================================
    # Shocks estocásticos – precios de commodities
    # ==================================================
    mu_gas: float = 0.0             # Media shock log-precio gas
    mu_min: float = 0.0             # Media shock log-precio minerales
    sigma_gas: float = 0.20         # Volatilidad gas (histórica alta)
    sigma_min: float = 0.18         # Volatilidad minerales
    rho: float = 0.35               # Correlación gas–minerales

    # ==================================================
    # Sensibilidad financiera
    # ==================================================
    phi_deuda: float = 0.03         # Prima de riesgo por Deuda/PIB

# ==============================================================
# GENERACIÓN DE SHOCKS ESTOCÁSTICOS
# ==============================================================

def shocks_precios(T: int, n: int, mu: np.ndarray, cov: np.ndarray, rng: np.random.Generator):
    """
    Genera shocks estocásticos correlacionados para precios
    usando una distribución log-normal.

    Retorna:
        Array de dimensión (n_sim, T, 2)
    """
    Z = rng.multivariate_normal(mean=mu, cov=cov, size=(n, T))
    return np.exp(Z)


# ==============================================================
# MODELO FISCAL DINÁMICO
# ==============================================================

def simular_modelo(p: Parametros, reduccion_subsidio: float = 0.0, seed: int = 42) -> Dict[str, np.ndarray]:
    rng = np.random.default_rng(seed)

    # Matriz de covarianza de shocks
    cov = np.array([
        [p.sigma_gas**2, p.rho * p.sigma_gas * p.sigma_min],
        [p.rho * p.sigma_gas * p.sigma_min, p.sigma_min**2]
    ])
    mu = np.array([p.mu_gas, p.mu_min])

    # Generar shocks para todas las trayectorias
    P = shocks_precios(p.T, p.n_sim, mu, cov, rng)
    P_gas = P[:, :, 0]
    P_min = P[:, :, 1]

    # Inicialización de resultados
    deuda = np.zeros((p.n_sim, p.T))
    deficit = np.zeros((p.n_sim, p.T))
    RIN = np.zeros((p.n_sim, p.T))
    PIB = np.zeros((p.n_sim, p.T))

    B0 = p.deuda_int0 + p.deuda_ext0

    # Simulación Monte Carlo
    for s in range(p.n_sim):
        B = B0
        rin = p.RIN0
        pib_t = p.PIB0

        for t in range(p.T):
            # Evolución del PIB
            pib_t = pib_t * (1 + p.g_pib)

            # Ingresos fiscales
            I_trib = p.tau_trib * pib_t
            I_gas = (P_gas[s, t] ** p.alpha_gas) * p.q_gas * pib_t * 0.05
            I_min = (P_min[s, t] ** p.alpha_min) * p.q_min * pib_t * 0.03
            I_total = I_trib + I_gas + I_min

            # Gasto público
            gasto_corr = p.gasto_corr0 * pib_t
            gasto_cap = p.gasto_cap0 * pib_t
            subsidio = p.subsidio_comb * (1 - reduccion_subsidio) * pib_t
            G_total = gasto_corr + gasto_cap + subsidio

            # Déficit fiscal
            D = G_total - I_total

            # Tasa de interés endógena
            prima = p.phi_deuda * (B / max(pib_t, 1e-6))
            tasa = p.i_ext + prima

            # Dinámica de deuda
            B = B * (1 + tasa) + D

            # Dinámica simplificada de RIN
            rin = rin + 0.2 * (I_gas + I_min) - tasa * p.deuda_ext0

            # Guardar resultados
            deuda[s, t] = B
            deficit[s, t] = D
            RIN[s, t] = rin
            PIB[s, t] = pib_t

    return {
        "deuda": deuda,
        "ratio_deuda_pib": deuda / np.maximum(PIB, 1e-6),
        "RIN": RIN,
        "deficit": deficit
    }


# ==============================================================
# RESÚMENES ESTADÍSTICOS
# ==============================================================

def resumen(resultados: Dict[str, np.ndarray]) -> Dict[str, pd.DataFrame]:
    salida = {}
    for nombre, matriz in resultados.items():
        salida[nombre] = pd.DataFrame({
            "media": matriz.mean(axis=0),
            "p05": np.percentile(matriz, 5, axis=0),
            "p95": np.percentile(matriz, 95, axis=0)
        })
    return salida


# ==============================================================
# EJECUCIÓN DE EJEMPLO (IMPRESIÓN POR CONSOLA)
# ==============================================================

if __name__ == "__main__":

    parametros = Parametros(
        deuda_int0=30.0,   # millones Bs
        deuda_ext0=20.0,   # millones Bs
        RIN0=15.0,         # millones
        PIB0=100.0         # millones Bs
    )

    resultados = simular_modelo(parametros, reduccion_subsidio=0.3)
    resumenes = resumen(resultados)

    print("\n=== TRAYECTORIA DE DEUDA PÚBLICA TOTAL ===")
    print(resumenes["deuda"])

    print("\n=== RATIO DEUDA / PIB ===")
    print(resumenes["ratio_deuda_pib"])

    print("\n=== EVOLUCIÓN DE LAS RIN ===")
    print(resumenes["RIN"])

    print("\n=== DISTRIBUCIÓN FINAL DEL DÉFICIT FISCAL (AÑO T) ===")
    deficit_final = resultados["deficit"][:, -1]
    print(pd.Series(deficit_final).describe(percentiles=[0.05, 0.5, 0.95]))
