from services.simulacion_service import ejecutar_simulacion

def obtener_resultados_simulacion(parametros_usuario=None):
    try:
        resultados = ejecutar_simulacion(parametros_usuario)
        return {
            "estado": "exito",
            "datos": resultados
        }
    except Exception as e:
        return {
            "estado": "error",
            "mensaje": str(e)
        }, 500
