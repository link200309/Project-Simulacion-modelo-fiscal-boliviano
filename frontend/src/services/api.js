const API_BASE_URL = "http://localhost:5000";

export const obtenerResultadosSimulacion = async (parametros = null) => {
  try {
    const opciones = {
      method: parametros ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (parametros) {
      opciones.body = JSON.stringify(parametros);
    }

    const response = await fetch(`${API_BASE_URL}/simulacion`, opciones);

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los resultados:", error);
    throw error;
  }
};
