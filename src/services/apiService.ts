
const RESULTADOS_PATH = '/resultados';  // Ruta de los JSON locales

// Función genérica para leer archivos JSON locales
const fetchLocalJson = async (filename: string) => {
    try {
        const response = await fetch(`${RESULTADOS_PATH}/${filename}`);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: No se pudo cargar ${filename}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al cargar archivo local:', error);
        throw error;
    }
};

// ============================================================
// FUNCIONES QUE USA TRAFFICVIS
// ============================================================

export const getResultadosCompletos = async () => {
    return fetchLocalJson('resultados_completos.json');
};

export const getDistribucionProtocolos = async () => {
    return fetchLocalJson('resultados_protocolos.json');
};

export const getVariacionHora = async () => {
    return fetchLocalJson('resultados_por_hora.json');
};

export const getVariacionDia = async () => {
    return fetchLocalJson('resultados_por_dia.json');
};

export const getArchivos = async () => {
    // Como ya no tenemos Azure, devolvemos una lista de archivos disponibles
    return {
        files: [
            'resultados_completos.json',
            'resultados_protocolos.json',
            'resultados_por_hora.json',
            'resultados_por_dia.json'
        ]
    };
};

// Mantén las funciones que ya tenías pero redirígelas a archivos locales
export const getGeneralProtocolos = getDistribucionProtocolos;
export const getLecturasGeneral = getVariacionHora;
export const getLecturasHoras = getVariacionDia;
export const getPCData = async (pcId: string) => {
    // Si tienes datos por PC, puedes cargar un archivo específico
    return fetchLocalJson(`resultados_por_pc_${pcId}.json`);
};
