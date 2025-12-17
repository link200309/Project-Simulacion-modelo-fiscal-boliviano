/**
 * Funciones para exportar datos de simulaciones en diferentes formatos
 */

/**
 * Exportar a CSV
 */
export function exportarCSV(datos, nombreArchivo = "simulacion.csv") {
  const años = Array.from(
    { length: datos.deficit_final.length },
    (_, i) => 2020 + i
  );

  let csv =
    "Año,Déficit Final (M Bs),Deuda Media (M Bs),Ratio Deuda/PIB,RIN Media (M Bs),Gasto sin Subsidio (M Bs),Gasto Total (M Bs),Subsidios (M Bs)\n";

  for (let i = 0; i < años.length; i++) {
    csv += `${años[i]},`;
    csv += `${Math.round(datos.deficit_final[i])},`;
    csv += `${Math.round(datos.deuda_media[i])},`;
    csv += `${datos.ratio_deuda_pib[i].toFixed(4)},`;
    csv += `${Math.round(datos.rin_media[i])},`;
    csv += `${Math.round(datos.gasto_sin_subsidio[i])},`;
    csv += `${Math.round(datos.gastos[i])},`;
    csv += `${Math.round(datos.subsidios[i])}\n`;
  }

  descargarArchivo(csv, nombreArchivo, "text/csv;charset=utf-8;");
}

/**
 * Exportar a JSON
 */
export function exportarJSON(datos, nombreArchivo = "simulacion.json") {
  const años = Array.from(
    { length: datos.deficit_final.length },
    (_, i) => 2020 + i
  );

  const datosFormateados = {
    simulacion: {
      fechaExportacion: new Date().toISOString(),
      periodos: años.map((año, i) => ({
        año,
        deficit_final: Math.round(datos.deficit_final[i]),
        deuda_media: Math.round(datos.deuda_media[i]),
        ratio_deuda_pib: parseFloat(datos.ratio_deuda_pib[i].toFixed(4)),
        rin_media: Math.round(datos.rin_media[i]),
        gasto_sin_subsidio: Math.round(datos.gasto_sin_subsidio[i]),
        gasto_total: Math.round(datos.gastos[i]),
        subsidios: Math.round(datos.subsidios[i]),
      })),
    },
    indicadores_riesgo: datos.indicadores_riesgo,
  };

  const json = JSON.stringify(datosFormateados, null, 2);
  descargarArchivo(json, nombreArchivo, "application/json;charset=utf-8;");
}

/**
 * Exportar a Excel (usando formato XLSX simple con librería)
 * Nota: Para versiones futuras, integrar xlsx library
 */
export function exportarExcel(datos, nombreArchivo = "simulacion.xlsx") {
  // Por ahora, usamos CSV que es compatible con Excel
  exportarCSV(datos, nombreArchivo.replace(".xlsx", ".csv"));
}

/**
 * Función auxiliar para descargar archivos
 */
function descargarArchivo(contenido, nombreArchivo, tipoMIME) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:" + tipoMIME + "," + encodeURIComponent(contenido)
  );
  element.setAttribute("download", nombreArchivo);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Exportar datos de análisis de riesgo (RF2)
 */
export function exportarAnalisisRiesgo(
  datos,
  nombreArchivo = "analisis_riesgo.json"
) {
  const años = Array.from(
    { length: datos.ratio_deuda_pib_p05.length },
    (_, i) => 2020 + i
  );

  const datosFormateados = {
    analisis_riesgo: {
      fechaExportacion: new Date().toISOString(),
      periodos: años.map((año, i) => ({
        año,
        ratio_deuda_pib_p05: parseFloat(
          datos.ratio_deuda_pib_p05[i].toFixed(4)
        ),
        ratio_deuda_pib_p25: parseFloat(
          datos.ratio_deuda_pib_p25[i].toFixed(4)
        ),
        ratio_deuda_pib_media: parseFloat(datos.ratio_deuda_pib[i].toFixed(4)),
        ratio_deuda_pib_p75: parseFloat(
          datos.ratio_deuda_pib_p75[i].toFixed(4)
        ),
        ratio_deuda_pib_p95: parseFloat(
          datos.ratio_deuda_pib_p95[i].toFixed(4)
        ),
        rin_p05: Math.round(datos.rin_p05[i]),
        rin_p25: Math.round(datos.rin_p25[i]),
        rin_media: Math.round(datos.rin_media[i]),
        rin_p75: Math.round(datos.rin_p75[i]),
        rin_p95: Math.round(datos.rin_p95[i]),
      })),
    },
    indicadores_riesgo: datos.indicadores_riesgo,
  };

  const json = JSON.stringify(datosFormateados, null, 2);
  descargarArchivo(json, nombreArchivo, "application/json;charset=utf-8;");
}
