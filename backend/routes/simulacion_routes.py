from flask import Blueprint, jsonify, request
from controllers.simulacion_controller import obtener_resultados_simulacion

simulacion_bp = Blueprint("simulacion", __name__)

@simulacion_bp.route("/simulacion", methods=["GET", "POST"])
def ejecutar():
    if request.method == "POST":
        datos = request.json
        resultados = obtener_resultados_simulacion(datos)
    else:
        resultados = obtener_resultados_simulacion()
    return jsonify(resultados)
