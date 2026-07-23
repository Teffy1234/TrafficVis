const API_BASE = import.meta.env.VITE_API_BASE;

const fetchData = async (endpoint: string) => {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Error al cargar ${endpoint}: ${response.status}`);
    }
    return response.json();
};

export const getGeneralProtocolos = async () => {
    return fetchData('/json/general_protocolos.json');
};

export const getLecturasGeneral = async () => {
    return fetchData('/json/lecturas_general.json');
};

export const getLecturasHoras = async () => {
    return fetchData('/json/lecturas_horas.json');
};

export const getLecturasPC1 = async () => {
    return fetchData('/json/lecturas_pc1.json');
};

export const getLecturasPC2 = async () => {
    return fetchData('/json/lecturas_pc2.json');
};

export const getLecturasPC3 = async () => {
    return fetchData('/json/lecturas_pc3.json');
};

export const getPCData = async (pcId: string) => {
    return fetchData(`/json/pc_${pcId}.json`);
};

export const getGeneralDns = async () => {
    return fetchData('/json/general_dns.json');
};

export const getGeneralFtp = async () => {
    return fetchData('/json/general_ftp.json');
};

export const getGeneralVoip = async () => {
    return fetchData('/json/general_voip.json');
};

export const getProtocoloDetalle = async (protocolo: string) => {
    return fetchData(`/json/protocolo_${protocolo}.json`);
};

export const getPc1DnsMetricas = async () => {
    return fetchData('/json/pc1_dns.json');
};

export const getPc1FtpMetricas = async () => {
    return fetchData('/json/pc1_ftp.json');
};

export const getPc1HttpMetricas = async () => {
    return fetchData('/json/pc1_http.json');
};

export const getPc1HttpsMetricas = async () => {
    return fetchData('/json/pc1_https.json');
};

export const getPc1IcmpMetricas = async () => {
    return fetchData('/json/pc1_icmp.json');
};

export const getPc1SmtpMetricas = async () => {
    return fetchData('/json/pc1_smtp.json');
};

export const getPc1TcpMetricas = async () => {
    return fetchData('/json/pc1_tcp.json');
};

export const getPc1UdpMetricas = async () => {
    return fetchData('/json/pc1_udp.json');
};

export const getPc1VoipMetricas = async () => {
    return fetchData('/json/pc1_voip.json');
};

export const getPc2DnsMetricas = async () => {
    return fetchData('/json/pc2_dns.json');
};

export const getPc2FtpMetricas = async () => {
    return fetchData('/json/pc2_ftp.json');
};

export const getPc2HttpMetricas = async () => {
    return fetchData('/json/pc2_http.json');
};

export const getPc2HttpsMetricas = async () => {
    return fetchData('/json/pc2_https.json');
};

export const getPc2IcmpMetricas = async () => {
    return fetchData('/json/pc2_icmp.json');
};

export const getPc2SmtpMetricas = async () => {
    return fetchData('/json/pc2_smtp.json');
};

export const getPc2TcpMetricas = async () => {
    return fetchData('/json/pc2_tcp.json');
};

export const getPc2UdpMetricas = async () => {
    return fetchData('/json/pc2_udp.json');
};

export const getPc2VoipMetricas = async () => {
    return fetchData('/json/pc2_voip.json');
};

export const getPc3DnsMetricas = async () => {
    return fetchData('/json/pc3_dns.json');
};

export const getPc3FtpMetricas = async () => {
    return fetchData('/json/pc3_ftp.json');
};

export const getPc3HttpMetricas = async () => {
    return fetchData('/json/pc3_http.json');
};

export const getPc3HttpsMetricas = async () => {
    return fetchData('/json/pc3_https.json');
};

export const getPc3IcmpMetricas = async () => {
    return fetchData('/json/pc3_icmp.json');
};

export const getPc3SmtpMetricas = async () => {
    return fetchData('/json/pc3_smtp.json');
};

export const getPc3TcpMetricas = async () => {
    return fetchData('/json/pc3_tcp.json');
};

export const getPc3UdpMetricas = async () => {
    return fetchData('/json/pc3_udp.json');
};

export const getPc3VoipMetricas = async () => {
    return fetchData('/json/pc3_voip.json');
};
