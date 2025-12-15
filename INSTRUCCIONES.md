# Simulador Fiscal - Instrucciones de Ejecución

## Estructura de la aplicación

La aplicación consta de dos partes:

- **Backend**: API REST con Flask que realiza las simulaciones
- **Frontend**: Interfaz React con Vite que muestra los resultados

## Instalación y ejecución

### Backend

1. Navega a la carpeta backend:

```bash
cd backend
```

2. Asegúrate de que el entorno virtual esté activado:

```bash
.\venv\Scripts\activate  # En Windows
source venv/bin/activate  # En Linux/Mac
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
pip install flask-cors
```

4. Ejecuta la aplicación:

```bash
python app.py
```

El backend estará disponible en `http://localhost:5000`

### Frontend

1. En otra terminal, navega a la carpeta frontend:

```bash
cd frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Características del Frontend

### Página de Simulación

- **Botón "Ejecutar Simulación"**: Solicita los datos al backend
- **Dos vistas disponibles**:
  - **Gráficos**: Muestra 4 gráficos de líneas interactivos
    - Déficit Final
    - Deuda Media
    - Ratio Deuda/PIB
    - RIN Media
  - **Tabla de Datos**: Tabla con todos los valores y resumen estadístico

### Visualización de Datos

- **Gráficos interactivos** con Chart.js
- **Tabla con valores formateados** para mayor legibilidad
- **Estadísticas resumidas** (promedios de cada métrica)
- **Interfaz responsive** con Tailwind CSS
- **Tema oscuro** para mejor visualización

## Datos devueltos por el backend

La API devuelve los siguientes datos:

```json
{
  "datos": {
    "deficit_final": [array de 6 valores],
    "deuda_media": [array de 6 valores],
    "ratio_deuda_pib": [array de 6 valores],
    "rin_media": [array de 6 valores]
  },
  "estado": "exito"
}
```

## Solución de problemas

### Error CORS

Si obtienes errores de CORS, asegúrate de que el backend tiene `flask-cors` instalado y configurado correctamente.

### Puerto en uso

Si el puerto 5000 ya está en uso, modifica el puerto en `backend/app.py`:

```python
app.run(debug=True, host="0.0.0.0", port=5001)
```

Y actualiza la URL en `frontend/src/services/api.js`
