from flask import Flask
from flask_cors import CORS
from routes.simulacion_routes import simulacion_bp

def crear_app():
    app = Flask(__name__)

    # Configurar CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.register_blueprint(simulacion_bp, url_prefix="")

    return app


if __name__ == "__main__":
    app = crear_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
