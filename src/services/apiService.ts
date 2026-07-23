const fetchLocalJson = async (filename: string) => {
    const response = await fetch(`/resultados/${filename}`);
    if (!response.ok) {
        throw new Error(`Error al cargar ${filename}: ${response.status}`);
    }
    return response.json();
};

export const getResultadosCompletos = async () => {
    return fetchLocalJson('resultados_completos.json');
};

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

export const getArchivos = async () => {
    return {
        files: ['resultados_completos.json']
    };
};

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

export const getGeneralDns = async () => {
    const data = await getResultadosCompletos();
    return data.dns || {};
};

export const getGeneralFtp = async () => {
    const data = await getResultadosCompletos();
    return data.ftp || {};
};

export const getGeneralHttp = async () => {
    const data = await getResultadosCompletos();
    return data.http || {};
};

export const getGeneralHttps = async () => {
    const data = await getResultadosCompletos();
    return data.https || {};
};

export const getGeneralIcmp = async () => {
    const data = await getResultadosCompletos();
    return data.icmp || {};
};

export const getGeneralSmtp = async () => {
    const data = await getResultadosCompletos();
    return data.smtp || {};
};

export const getGeneralTcp = async () => {
    const data = await getResultadosCompletos();
    return data.tcp || {};
};

export const getGeneralUdp = async () => {
    const data = await getResultadosCompletos();
    return data.udp || {};
};

export const getGeneralVoip = async () => {
    const data = await getResultadosCompletos();
    return data.voip || {};
};

export const getProtocoloDetalle = async (protocolo: string) => {
    const data = await getResultadosCompletos();
    const encontrado = data.distribucion_protocolos?.find(
        (p: any) => p.protocolo === protocolo
    );
    return encontrado || { protocolo, cantidad: 0, porcentaje: 0 };
};

export const getPc1DnsMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.dns || {};
};

export const getPc1FtpMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.ftp || {};
};

export const getPc1HttpMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.http || {};
};

export const getPc1HttpsMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.https || {};
};

export const getPc1IcmpMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.icmp || {};
};

export const getPc1SmtpMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.smtp || {};
};

export const getPc1TcpMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.tcp || {};
};

export const getPc1UdpMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.udp || {};
};

export const getPc1VoipMetricas = async () => {
    const data = await getResultadosCompletos();
    return data.voip || {};
};

export const getPc2DnsMetricas = getPc1DnsMetricas;
export const getPc2FtpMetricas = getPc1FtpMetricas;
export const getPc2HttpMetricas = getPc1HttpMetricas;
export const getPc2HttpsMetricas = getPc1HttpsMetricas;
export const getPc2IcmpMetricas = getPc1IcmpMetricas;
export const getPc2SmtpMetricas = getPc1SmtpMetricas;
export const getPc2TcpMetricas = getPc1TcpMetricas;
export const getPc2UdpMetricas = getPc1UdpMetricas;
export const getPc2VoipMetricas = getPc1VoipMetricas;

export const getPc3DnsMetricas = getPc1DnsMetricas;
export const getPc3FtpMetricas = getPc1FtpMetricas;
export const getPc3HttpMetricas = getPc1HttpMetricas;
export const getPc3HttpsMetricas = getPc1HttpsMetricas;
export const getPc3IcmpMetricas = getPc1IcmpMetricas;
export const getPc3SmtpMetricas = getPc1SmtpMetricas;
export const getPc3TcpMetricas = getPc1TcpMetricas;
export const getPc3UdpMetricas = getPc1UdpMetricas;
export const getPc3VoipMetricas = getPc1VoipMetricas;
