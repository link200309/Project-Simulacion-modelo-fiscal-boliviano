import numpy as np
from models.modelo_fiscal import Parametros, simular_modelo

def ejecutar_simulacion():
    parametros = Parametros()
    resultados = simular_modelo(parametros)

    salida = {
        "deuda_media": resultados["deuda_total"].mean(axis=0).tolist(),
        "ratio_deuda_pib": resultados["ratio_deuda_pib"].mean(axis=0).tolist(),
        "rin_media": resultados["RIN"].mean(axis=0).tolist(),
        "deficit_final": resultados["deficit"].mean(axis=0).tolist()
    }
    return salida
