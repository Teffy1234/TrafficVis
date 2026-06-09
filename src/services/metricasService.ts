import { getProtocoloMetrica } from "./apiService";

/**
 * Servicio para obtener métricas detalladas de un protocolo específico dentro de un archivo.
 */
export async function getMetricas(pc: string, archivo: string, protocolo: string): Promise<any> {
  // El nombre del archivo viene con .csv, lo cambiamos a la carpeta correspondiente
  const folder = archivo.replace('.csv', '');
  const protocolLower = protocolo.toLowerCase();
  
  try {
    return await getProtocoloMetrica(pc, folder, protocolLower);
  } catch (error) {
    console.error(`Error al cargar métricas para ${pc}/${folder}/${protocolLower}:`, error);
    throw new Error(`Métricas no disponibles para el protocolo ${protocolo}`);
  }
}
