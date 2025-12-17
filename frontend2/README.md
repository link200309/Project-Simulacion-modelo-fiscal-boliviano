
  # Simulador Fiscal Boliviano - Version 2.0

  Frontend React + TypeScript integrado con el modelo fiscal del backend.

  ## Arquitectura

  Este proyecto utiliza:
  - **Frontend**: React 18 + TypeScript + Vite
  - **Backend**: Flask + NumPy + Pandas (ubicado en `../backend/`)
  - **Comunicación**: API REST con CORS habilitado

  ## Requisitos Previos

  - Node.js 18+ (para el frontend)
  - Python 3.8+ (para el backend)
  - npm o pnpm (gestor de paquetes)

  ## Pasos para Ejecutar

  ### 1. Iniciar el Backend
  
  ```bash
  cd ../backend
  pip install -r requirements.txt
  python app.py
  ```
  
  El backend estará disponible en: http://localhost:5000

  ### 2. Iniciar el Frontend

  ```bash
  npm install
  npm run dev
  ```
  
  El frontend estará disponible en: http://localhost:5173

  ### 3. Acceder a la Aplicación

  Abra su navegador en http://localhost:5173

  ## Archivos Importantes

  - `src/services/api.ts` - Cliente HTTP para comunicarse con el backend
  - `src/components/FiscalSimulationSection.tsx` - Componente que ejecuta la simulación
  - `.env.local` - Variables de entorno (URL del backend)

  ## Documentación Completa

  Para más detalles sobre la integración, consulte: `../INTEGRACION_FRONTEND_BACKEND.md`
  