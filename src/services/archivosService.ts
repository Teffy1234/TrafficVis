import { getArchivos as fetchArchivos, getArchivoDetalle } from "./apiService";

export type Protocolo = "DNS" | "FTP" | "HTTP" | "ICMP" | "SMTP" | "TCP" | "UDP";

export interface MetricasArchivo {
  DNS?: number;
  FTP?: number;
  HTTP?: number;
  ICMP?: number;
  SMTP?: number;
  TCP?: number;
  UDP?: number;
}

export interface ArchivoCSV {
  [nombreArchivo: string]: MetricasArchivo;
}

export interface PCInfo {
  archivos: ArchivoCSV;
}

export interface ArchivosData {
  [pcName: string]: PCInfo;
}

/**
 * Obtiene los datos de los archivos de forma asíncrona.
 */
export async function getArchivos(): Promise<ArchivosData> {
  return fetchArchivos();
}

/**
 * Obtiene los detalles de un protocolo para un archivo específico.
 * @param {string} pc - Nombre de la PC.
 * @param {string} filename - Nombre del archivo.
 * @param {string} protocol - Nombre del protocolo (HTTP, DNS, etc).
 * @returns {Promise<any>} Detalles del protocolo.
 */
export async function getArchivoProtocolDetails(pc: string, filename: string, protocol: string): Promise<any> {
  try {
    return await getArchivoDetalle(pc, protocol);
  } catch (e) {
    console.warn(`No se encontró JSON para ${protocol} en ${pc}. Intentando fallback.`);
    try {
      // Fallback a PC1/http como estaba en el original si falla
      return await getArchivoDetalle('PC1', 'http');
    } catch (err) {
      return { disponible: false };
    }
  }
}
