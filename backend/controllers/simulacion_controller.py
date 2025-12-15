from services.simulacion_service import ejecutar_simulacion

def obtener_resultados_simulacion():
    try:
        resultados = ejecutar_simulacion()
        return {
            "estado": "exito",
            "datos": resultados
        }
    except Exception as e:
        return {
            "estado": "error",
            "mensaje": str(e)
        }, 500
