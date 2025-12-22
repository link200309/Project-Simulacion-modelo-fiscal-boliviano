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
  tasa_interes_deuda_interna?: number;
  pib_inicial?: number;
  tipo_financiamiento?: "RIN" | "Deuda";
  sigma_gas?: number;
  sigma_zinc?: number;
  sigma_plata?: number;
  sigma_plomo?: number;
  sigma_estano?: number;
  sigma_oro?: number;
  precio_gas_base?: number;
  precio_zinc_base?: number;
  precio_plata_base?: number;
  precio_plomo_base?: number;
  precio_estano_base?: number;
  precio_oro_base?: number;
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
    ingresos_oro: number[];
    ingresos_minerales: number[];
    ingresos_commodities: number[];
    ingresos_totales: number[];
    ingresos_iva: number[];
    ingresos_it: number[];
    ingresos_iue: number[];
    ingresos_rc_iva: number[];
    ingresos_ice: number[];
    ingresos_ga: number[];
    ingresos_iehd: number[];
    ingresos_otros_tributarios: number[];
    ingresos_regalias: number[];
    ingresos_empresas_publicas: number[];
    ingresos_donaciones: number[];
    ingresos_otros_no_tributarios: number[];
    gasto_corriente: number[];
    transferencias_sociales: number[];
    inversion_publica: number[];
    sueldos_salarios: number[];
    bienes_servicios: number[];
    otros_gastos_corrientes: number[];
    bonos_sociales: number[];
    pensiones: number[];
    gobiernos_subnacionales: number[];
    otras_transferencias: number[];
    inflacion_media: number[];
    inflacion_p05: number[];
    inflacion_p25: number[];
    inflacion_p75: number[];
    inflacion_p95: number[];
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
  // Debug: verificar datos del backend
  console.log("🔧 Datos recibidos del backend:", {
    ingresos_empresas_publicas: data.ingresos_empresas_publicas,
    ingresos_donaciones: data.ingresos_donaciones,
    ingresos_otros_no_tributarios: data.ingresos_otros_no_tributarios,
  });

  // Debug: verificar datos de desglose de gasto
  console.log("📊 Datos de desglose de gasto recibidos:", {
    sueldos_salarios: data.sueldos_salarios,
    bienes_servicios: data.bienes_servicios,
    otros_gastos_corrientes: data.otros_gastos_corrientes,
    bonos_sociales: data.bonos_sociales,
    pensiones: data.pensiones,
    gobiernos_subnacionales: data.gobiernos_subnacionales,
    otras_transferencias: data.otras_transferencias,
  });

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

  // Transform inflation data (backend sends as decimal, convert to percentage)
  const inflacion = years.map((year, index) => ({
    year,
    mean: (data.inflacion_media?.[index] || 0) * 100,
    p05: (data.inflacion_p05?.[index] || 0) * 100,
    p10: (data.inflacion_p05?.[index] || 0) * 100,
    p25: (data.inflacion_p25?.[index] || 0) * 100,
    p50: (data.inflacion_media?.[index] || 0) * 100,
    p75: (data.inflacion_p75?.[index] || 0) * 100,
    p90: (data.inflacion_p95?.[index] || 0) * 100,
    p95: (data.inflacion_p95?.[index] || 0) * 100,
  }));

  const result = {
    deudaTotal,
    deudaPIB,
    rin,
    deficitFiscal,
    inflacion,
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
    ingresosOro: years.map((year, index) => ({
      year,
      value: data.ingresos_oro?.[index] || 0,
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
    ingresosIVA: years.map((year, index) => ({
      year,
      value: data.ingresos_iva?.[index] || 0,
    })),
    ingresosIT: years.map((year, index) => ({
      year,
      value: data.ingresos_it?.[index] || 0,
    })),
    ingresosIUE: years.map((year, index) => ({
      year,
      value: data.ingresos_iue?.[index] || 0,
    })),
    ingresosRCIVA: years.map((year, index) => ({
      year,
      value: data.ingresos_rc_iva?.[index] || 0,
    })),
    ingresosICE: years.map((year, index) => ({
      year,
      value: data.ingresos_ice?.[index] || 0,
    })),
    ingresosGA: years.map((year, index) => ({
      year,
      value: data.ingresos_ga?.[index] || 0,
    })),
    ingresosIEHD: years.map((year, index) => ({
      year,
      value: data.ingresos_iehd?.[index] || 0,
    })),
    ingresosOtrosTributarios: years.map((year, index) => ({
      year,
      value: data.ingresos_otros_tributarios?.[index] || 0,
    })),
    ingresosRegalias: years.map((year, index) => ({
      year,
      value: data.ingresos_regalias?.[index] || 0,
    })),
    ingresosEmpresasPublicas: years.map((year, index) => ({
      year,
      value: data.ingresos_empresas_publicas?.[index] || 0,
    })),
    ingresosDonaciones: years.map((year, index) => ({
      year,
      value: data.ingresos_donaciones?.[index] || 0,
    })),
    ingresosOtrosNoTributarios: years.map((year, index) => ({
      year,
      value: data.ingresos_otros_no_tributarios?.[index] || 0,
    })),
    gastoCorriente: years.map((year, index) => ({
      year,
      value: data.gasto_corriente?.[index] || 0,
    })),
    transferenciasSociales: years.map((year, index) => ({
      year,
      value: data.transferencias_sociales?.[index] || 0,
    })),
    inversionPublica: years.map((year, index) => ({
      year,
      value: data.inversion_publica?.[index] || 0,
    })),
    // Desglose de gasto corriente
    sueldosSalarios: years.map((year, index) => ({
      year,
      value: data.sueldos_salarios?.[index] || 0,
    })),
    bienesServicios: years.map((year, index) => ({
      year,
      value: data.bienes_servicios?.[index] || 0,
    })),
    otrosGastosCorrientes: years.map((year, index) => ({
      year,
      value: data.otros_gastos_corrientes?.[index] || 0,
    })),
    // Desglose de transferencias sociales
    bonosSociales: years.map((year, index) => ({
      year,
      value: data.bonos_sociales?.[index] || 0,
    })),
    pensiones: years.map((year, index) => ({
      year,
      value: data.pensiones?.[index] || 0,
    })),
    gobiernosSubnacionales: years.map((year, index) => ({
      year,
      value: data.gobiernos_subnacionales?.[index] || 0,
    })),
    otrasTransferencias: years.map((year, index) => ({
      year,
      value: data.otras_transferencias?.[index] || 0,
    })),
  };

  // Debug: verificar datos transformados
  console.log("✅ Datos transformados (desglose):", {
    sueldosSalarios: result.sueldosSalarios,
    bienesServicios: result.bienesServicios,
    otrosGastosCorrientes: result.otrosGastosCorrientes,
    bonosSociales: result.bonosSociales,
    pensiones: result.pensiones,
    gobiernosSubnacionales: result.gobiernosSubnacionales,
    otrasTransferencias: result.otrasTransferencias,
  });

  return result;
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
