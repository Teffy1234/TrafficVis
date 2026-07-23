// ============================================================
// apiService.ts - LEE JSON LOCAL (resultados_completos.json)
// ============================================================

// Función para leer archivos JSON locales
const fetchLocalJson = async (filename: string) => {
    const response = await fetch(`/resultados/${filename}`);
    if (!response.ok) {
        throw new Error(`Error al cargar ${filename}: ${response.status}`);
    }
    return response.json();
};

// Obtiene TODOS los datos del archivo completo
export const getResultadosCompletos = async () => {
    return fetchLocalJson('resultados_completos.json');
};

// Funciones que extraen partes específicas del archivo completo
export const getDistribucionProtocolos = async () => {
    const data = await getResultadosCompletos();
    return data.distribucion_protocolos;
};

export const getVariacionHora = async () => {
    const data = await getResultadosCompletos();
    return data.variacion_por_hora || [];
};

export const getVariacionDia = async () => {
    const data = await getResultadosCompletos();
    return data.variacion_por_dia || [];
};

export const getICMP = async () => {
    const data = await getResultadosCompletos();
    return data.icmp;
};

export const getDNS = async () => {
    const data = await getResultadosCompletos();
    return data.dns;
};

export const getFTP = async () => {
    const data = await getResultadosCompletos();
    return data.ftp;
};

export const getSMTP = async () => {
    const data = await getResultadosCompletos();
    return data.smtp;
};

export const getUDP = async () => {
    const data = await getResultadosCompletos();
    return data.udp;
};

export const getTCP = async () => {
    const data = await getResultadosCompletos();
    return data.tcp;
};

export const getHTTP = async () => {
    const data = await getResultadosCompletos();
    return data.http;
};

export const getHTTPS = async () => {
    const data = await getResultadosCompletos();
    return data.https;
};

// Lista de archivos disponibles
export const getArchivos = async () => {
    return {
        files: [
            'resultados_completos.json'
        ]
    };
};

// Mantén compatibilidad con funciones existentes
export const getGeneralProtocolos = getDistribucionProtocolos;
export const getLecturasGeneral = getVariacionHora;
export const getLecturasHoras = getVariacionDia;

export const getLecturasPC1 = async () => {
    const data = await getResultadosCompletos();
    return data.por_dia_protocolo_pc || [];
};

export const getLecturasPC2 = getLecturasPC1;
export const getLecturasPC3 = getLecturasPC1;

export const getPCData = async (pcId: string) => {
    const data = await getResultadosCompletos();
    return data.protocolos_anidado || [];
};
