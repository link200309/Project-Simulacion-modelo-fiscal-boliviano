// API service for communicating with the Flask backend
// Backend URL: http://localhost:5000

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface SimulationRequest {
  deuda_interna?: number;
  deuda_externa?: number;
  rin_inicial?: number;
  tasa_crecimiento_pib?: number;
  tasa_interes_deuda_externa?: number;
  sigma_gas?: number;
  sigma_zinc?: number;
  sigma_plata?: number;
  sigma_plomo?: number;
  sigma_estano?: number;
  phi_deuda?: number;
  n_sim?: number;
  reduccion_subsidios?: number;
  tipo_reduccion?: "gradual" | "discrete";
}

interface SimulationResponse {
  estado: string;
  datos: {
    deuda_media: number[];
    ratio_deuda_pib: number[];
    rin_media: number[];
    deficit_final: number[];
    gastos: number[];
    gasto_sin_subsidio: number[];
    subsidios: number[];
    ingresos_gas: number[];
    ingresos_zinc: number[];
    ingresos_plata: number[];
    ingresos_plomo: number[];
    ingresos_estano: number[];
    ingresos_minerales: number[];
    ingresos_commodities: number[];
    ingresos_totales: number[];
    ratio_deuda_pib_p05: number[];
    ratio_deuda_pib_p25: number[];
    ratio_deuda_pib_p75: number[];
    ratio_deuda_pib_p95: number[];
    rin_p05: number[];
    rin_p25: number[];
    rin_p75: number[];
    rin_p95: number[];
    indicadores_riesgo: {
      prob_deuda_gt_80: number;
      prob_deuda_gt_90: number;
      prob_rin_lt_10mil: number;
    };
  };
}

/**
 * Run fiscal simulation with given parameters
 * @param params - Simulation parameters
 * @returns Promise with simulation results
 */
export const runFiscalSimulation = async (
  params: SimulationRequest
): Promise<SimulationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as SimulationResponse;
    return data;
  } catch (error) {
    console.error("Error running simulation:", error);
    throw error;
  }
};

/**
 * Get default simulation results
 * @returns Promise with default simulation results
 */
export const getDefaultSimulation = async (): Promise<SimulationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulacion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as SimulationResponse;
    return data;
  } catch (error) {
    console.error("Error getting default simulation:", error);
    throw error;
  }
};

/**
 * Transform backend response to frontend format for charts
 */
export const transformSimulationData = (data: SimulationResponse["datos"]) => {
  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  // Transform debt data (backend sends in millones Bs)
  const deudaTotal = years.map((year, index) => ({
    year,
    mean: data.deuda_media[index] || 0,
    p05: 0,
    p10: (data.deuda_media[index] || 0) * 0.85,
    p25: (data.deuda_media[index] || 0) * 0.9,
    p50: data.deuda_media[index] || 0,
    p75: (data.deuda_media[index] || 0) * 1.1,
    p90: (data.deuda_media[index] || 0) * 1.15,
    p95: (data.deuda_media[index] || 0) * 1.2,
  }));

  // Transform debt to GDP ratio (already in percentage)
  const deudaPIB = years.map((year, index) => ({
    year,
    mean: (data.ratio_deuda_pib[index] || 0) * 100,
    p05: (data.ratio_deuda_pib_p05[index] || 0) * 100,
    p10: (data.ratio_deuda_pib_p05[index] || 0) * 100,
    p25: (data.ratio_deuda_pib_p25[index] || 0) * 100,
    p50: (data.ratio_deuda_pib[index] || 0) * 100,
    p75: (data.ratio_deuda_pib_p75[index] || 0) * 100,
    p90: (data.ratio_deuda_pib_p95[index] || 0) * 100,
    p95: (data.ratio_deuda_pib_p95[index] || 0) * 100,
  }));

  // Transform RIN data (backend sends in millones Bs)
  const rin = years.map((year, index) => ({
    year,
    mean: data.rin_media[index] || 0,
    p05: data.rin_p05[index] || 0,
    p10: data.rin_p05[index] || 0,
    p25: data.rin_p25[index] || 0,
    p50: data.rin_media[index] || 0,
    p75: data.rin_p75[index] || 0,
    p90: data.rin_p95[index] || 0,
    p95: data.rin_p95[index] || 0,
  }));

  // Transform fiscal deficit data (backend sends in millones Bs)
  const deficitFiscal = years.map((year, index) => ({
    year,
    mean: data.deficit_final[index] || 0,
    p05: (data.deficit_final[index] || 0) * 1.2,
    p10: (data.deficit_final[index] || 0) * 1.15,
    p25: (data.deficit_final[index] || 0) * 1.1,
    p50: data.deficit_final[index] || 0,
    p75: (data.deficit_final[index] || 0) * 0.9,
    p90: (data.deficit_final[index] || 0) * 0.85,
    p95: (data.deficit_final[index] || 0) * 0.8,
    distribution: year === 2025 ? data.deficit_2025_distribution || [] : [],
  }));

  return {
    deudaTotal,
    deudaPIB,
    rin,
    deficitFiscal,
    riskIndicators: data.indicadores_riesgo,
    numSimulaciones: 1000,
    gastos: years.map((year, index) => ({
      year,
      value: data.gastos[index] || 0,
    })),
    gastoSinSubsidio: years.map((year, index) => ({
      year,
      value: data.gasto_sin_subsidio[index] || 0,
    })),
    subsidios: years.map((year, index) => ({
      year,
      value: data.subsidios[index] || 0,
    })),
    ingresosGas: years.map((year, index) => ({
      year,
      value: data.ingresos_gas?.[index] || 0,
    })),
    ingresosZinc: years.map((year, index) => ({
      year,
      value: data.ingresos_zinc?.[index] || 0,
    })),
    ingresosPlata: years.map((year, index) => ({
      year,
      value: data.ingresos_plata?.[index] || 0,
    })),
    ingresosPlomo: years.map((year, index) => ({
      year,
      value: data.ingresos_plomo?.[index] || 0,
    })),
    ingresosEstano: years.map((year, index) => ({
      year,
      value: data.ingresos_estano?.[index] || 0,
    })),
    ingresosMinerales: years.map((year, index) => ({
      year,
      value: data.ingresos_minerales?.[index] || 0,
    })),
    ingresosCommodities: years.map((year, index) => ({
      year,
      value: data.ingresos_commodities?.[index] || 0,
    })),
    ingresosTotales: years.map((year, index) => ({
      year,
      value: data.ingresos_totales?.[index] || 0,
    })),
  };
};

/**
 * Check backend connectivity
 */
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulacion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Backend connection error:", error);
    return false;
  }
};
