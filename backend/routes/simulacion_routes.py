from flask import Blueprint, jsonify
from controllers.simulacion_controller import obtener_resultados_simulacion

simulacion_bp = Blueprint("simulacion", __name__)

@simulacion_bp.route("/simulacion", methods=["GET"])
def ejecutar():
    resultados = obtener_resultados_simulacion()
    return jsonify(resultados)
