from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {
        "status": "ok",
        "mensaje": "Servidor del simulador fiscal boliviano activo"
    }

if __name__ == "__main__":
    app.run(
        debug=True,      # Modo desarrollo
        host="127.0.0.1",# Localhost
        port=5000        # Puerto estándar Flask
    )
