from flask import Flask
from routes.simulacion_routes import simulacion_bp

def crear_app():
    app = Flask(__name__)

    app.register_blueprint(simulacion_bp, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = crear_app()
    app.run(debug=True)
