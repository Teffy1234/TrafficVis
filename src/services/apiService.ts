/**
 * src/services/apiService.ts
 * Servicio para consumir los datos JSON mediante fetch.
 */




const API_BASE = import.meta.env.VITE_API_BASE


/**
 para realizar peticiones fetch con manejo de errores.
 */
async function fetchData<T = any>(endpoint: string): Promise<T> {
  
  const url = `${API_BASE}${endpoint}`.replace(/^\/public\//, '/');
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: No se pudo cargar ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en la llamada API a ${endpoint}:`, error);
    throw error;
  }
}

// --- FUNCIONES DE CONSUMO ---

/** Obtiene el índice de archivos y su estructura */
export const getArchivos = () => fetchData('resultados/global/protocolos_por_pc_archivo.json');

/** Obtiene los datos generales de protocolos */
export const getGeneralProtocolos = () => fetchData('resultados/global/resumen/protocolos_anidado.json');

/** Obtiene el resumen de lecturas generales */
export const getLecturasGeneral = () => fetchData('resultados/global/tiempo/por_dia_protocolo_pc.json');

/** Obtiene la distribución de horas */
export const getLecturasHoras = () => fetchData('resultados/global/tiempo/por_hora.json');

/** Obtiene lecturas específicas por PC */
export const getLecturasPC1 = () => fetchData('resultados/pcs/PC1/tiempo/por_dia_protocolo_pc.json');
export const getLecturasPC2 = () => fetchData('resultados/pcs/PC2/tiempo/por_dia_protocolo_pc.json');
export const getLecturasPC3 = () => fetchData('resultados/pcs/PC3/tiempo/por_dia_protocolo_pc.json');

/** 
 * Obtiene la distribución de horas para un PC específico
 * @param pcId Ejemplo: 'pc1', 'pc2'
 */
export const getPCData = (pcId: string) => fetchData(`resultados/pcs/${pcId}/tiempo/por_hora.json`);

/**
 * Obtiene métricas específicas de un PC y una fecha
 * @param pcId ID del PC 
 * @param filename Nombre del archivo JSON 
 */
export const getMetricasArchivo = (pcId: string, filename: string) => 
  fetchData(`/data/metricas/${pcId}/${filename}`);

/**
 * Obtiene las metricas de un protocolo especifico para un pc en caso de que los fetch individuales fallen
 * @param pcId ID del PC
 * @param protocolo Nombre del protocolo (ej: 'dns')
 */
export const getProtocoloDetalle = (pcId: string, protocolo: string) =>
  fetchData(`resultados/pcs/${pcId.toUpperCase()}/metricas/${protocolo.toLowerCase()}.json`);

/**
 * Obtiene protocolos de una métrica específica de cada archivo por individual
 */
export const getProtocoloMetrica = (pcId: string, folder: string, protocolo: string) =>
  fetchData(`resultados/individual/${folder}/metricas/${protocolo.toLowerCase()}.json`);

/**
 * Obtiene detalles de un protocolo de la carpeta archivos
 */
export const getArchivoDetalle = (pcId: string, protocolo: string) =>
  fetchData(`/data/archivos/${pcId}/${protocolo.toLowerCase()}.json`);

// --- FUNCIONES PARA PROTOCOLOS GENERALES ---
export const getGeneralDns = () => fetchData('resultados/global/metricas/dns.json');
export const getGeneralFtp = () => fetchData('resultados/global/metricas/ftp.json');
export const getGeneralHttp = () => fetchData('resultados/global/metricas/http.json');
export const getGeneralHttps = () => fetchData('resultados/global/metricas/https.json');
export const getGeneralIcmp = () => fetchData('resultados/global/metricas/icmp.json');
export const getGeneralSmtp = () => fetchData('resultados/global/metricas/smtp.json');
export const getGeneralTcp = () => fetchData('resultados/global/metricas/tcp.json');
export const getGeneralUdp = () => fetchData('resultados/global/metricas/udp.json');
export const getGeneralVoip = () => fetchData('resultados/global/metricas/voip.json');

// --- FUNCIONES PARA RESUMEN GENERAL POR PC ---
export const getPc1General = () => fetchData('resultados/pcs/PC1/resumen/protocolos.json');
export const getPc2General = () => fetchData('resultados/pcs/PC2/resumen/protocolos.json');
export const getPc3General = () => fetchData('resultados/pcs/PC3/resumen/protocolos.json');

// --- FUNCIONES PARA MÉTRICAS ESPECÍFICAS POR PC Y PROTOCOLO ---
// PC1
export const getPc1DnsMetricas = () => fetchData('resultados/pcs/PC1/metricas/dns.json');
export const getPc1FtpMetricas = () => fetchData('resultados/pcs/PC1/metricas/ftp.json');
export const getPc1HttpMetricas = () => fetchData('resultados/pcs/PC1/metricas/http.json');
export const getPc1HttpsMetricas = () => fetchData('resultados/pcs/PC1/metricas/https.json');
export const getPc1IcmpMetricas = () => fetchData('resultados/pcs/PC1/metricas/icmp.json');
export const getPc1SmtpMetricas = () => fetchData('resultados/pcs/PC1/metricas/smtp.json');
export const getPc1TcpMetricas = () => fetchData('resultados/pcs/PC1/metricas/tcp.json');
export const getPc1UdpMetricas = () => fetchData('resultados/pcs/PC1/metricas/udp.json');
export const getPc1VoipMetricas = () => fetchData('resultados/pcs/PC1/metricas/voip.json');

// PC2
export const getPc2DnsMetricas = () => fetchData('resultados/pcs/PC2/metricas/dns.json');
export const getPc2FtpMetricas = () => fetchData('resultados/pcs/PC2/metricas/ftp.json');
export const getPc2HttpMetricas = () => fetchData('resultados/pcs/PC2/metricas/http.json');
export const getPc2HttpsMetricas = () => fetchData('resultados/pcs/PC2/metricas/https.json');
export const getPc2IcmpMetricas = () => fetchData('resultados/pcs/PC2/metricas/icmp.json');
export const getPc2SmtpMetricas = () => fetchData('resultados/pcs/PC2/metricas/smtp.json');
export const getPc2TcpMetricas = () => fetchData('resultados/pcs/PC2/metricas/tcp.json');
export const getPc2UdpMetricas = () => fetchData('resultados/pcs/PC2/metricas/udp.json');
export const getPc2VoipMetricas = () => fetchData('resultados/pcs/PC2/metricas/voip.json');

// PC3
export const getPc3DnsMetricas = () => fetchData('resultados/pcs/PC3/metricas/dns.json');
export const getPc3FtpMetricas = () => fetchData('resultados/pcs/PC3/metricas/ftp.json');
export const getPc3HttpMetricas = () => fetchData('resultados/pcs/PC3/metricas/http.json');
export const getPc3HttpsMetricas = () => fetchData('resultados/pcs/PC3/metricas/https.json');
export const getPc3IcmpMetricas = () => fetchData('resultados/pcs/PC3/metricas/icmp.json');
export const getPc3SmtpMetricas = () => fetchData('resultados/pcs/PC3/metricas/smtp.json');
export const getPc3TcpMetricas = () => fetchData('resultados/pcs/PC3/metricas/tcp.json');
export const getPc3UdpMetricas = () => fetchData('resultados/pcs/PC3/metricas/udp.json');
export const getPc3VoipMetricas = () => fetchData('resultados/pcs/PC3/metricas/voip.json');
