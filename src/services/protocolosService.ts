import { 
  getGeneralProtocolos,
  getGeneralDns,
  getGeneralFtp,
  getGeneralHttp,
  getGeneralHttps,
  getGeneralIcmp,
  getGeneralSmtp,
  getGeneralTcp,
  getGeneralUdp,
  getGeneralVoip,
  getProtocoloDetalle,
  getPc1DnsMetricas,
  getPc1FtpMetricas,
  getPc1HttpMetricas,
  getPc1HttpsMetricas,
  getPc1IcmpMetricas,
  getPc1SmtpMetricas,
  getPc1TcpMetricas,
  getPc1UdpMetricas,
  getPc1VoipMetricas,
  getPc2DnsMetricas,
  getPc2FtpMetricas,
  getPc2HttpMetricas,
  getPc2HttpsMetricas,
  getPc2IcmpMetricas,
  getPc2SmtpMetricas,
  getPc2TcpMetricas,
  getPc2UdpMetricas,
  getPc2VoipMetricas,
  getPc3DnsMetricas,
  getPc3FtpMetricas,
  getPc3HttpMetricas,
  getPc3HttpsMetricas,
  getPc3IcmpMetricas,
  getPc3SmtpMetricas,
  getPc3TcpMetricas,
  getPc3UdpMetricas,
  getPc3VoipMetricas
} from "./apiService";
import { getProtocolColor } from "../constants";
import { ProtocolData, ProtocolDetails } from "../types";

export async function getProtocolos(): Promise<ProtocolData[]> {
  const protocolos = await getGeneralProtocolos();
  return protocolos.map((p: any) => ({
    ...p,
    id: p.protocolo,
    color: getProtocolColor(p.protocolo)
  }));
}

export async function getProtocolDetails(protocolName: string, pc?: string): Promise<ProtocolDetails | null> {
  const name = protocolName.toLowerCase();
  
  if (pc) {
    const pcId = pc.toUpperCase();
    try {
      let pcData;
      
      // Mapping to specific functions as requested
      if (pcId === 'PC1') {
        switch (name) {
          case 'dns': pcData = await getPc1DnsMetricas(); break;
          case 'ftp': pcData = await getPc1FtpMetricas(); break;
          case 'http': pcData = await getPc1HttpMetricas(); break;
          case 'https': pcData = await getPc1HttpsMetricas(); break;
          case 'icmp': pcData = await getPc1IcmpMetricas(); break;
          case 'smtp': pcData = await getPc1SmtpMetricas(); break;
          case 'tcp': pcData = await getPc1TcpMetricas(); break;
          case 'udp': pcData = await getPc1UdpMetricas(); break;
          case 'voip': pcData = await getPc1VoipMetricas(); break;
        }
      } else if (pcId === 'PC2') {
        switch (name) {
          case 'dns': pcData = await getPc2DnsMetricas(); break;
          case 'ftp': pcData = await getPc2FtpMetricas(); break;
          case 'http': pcData = await getPc2HttpMetricas(); break;
          case 'https': pcData = await getPc2HttpsMetricas(); break;
          case 'icmp': pcData = await getPc2IcmpMetricas(); break;
          case 'smtp': pcData = await getPc2SmtpMetricas(); break;
          case 'tcp': pcData = await getPc2TcpMetricas(); break;
          case 'udp': pcData = await getPc2UdpMetricas(); break;
          case 'voip': pcData = await getPc2VoipMetricas(); break;
        }
      } else if (pcId === 'PC3') {
        switch (name) {
          case 'dns': pcData = await getPc3DnsMetricas(); break;
          case 'ftp': pcData = await getPc3FtpMetricas(); break;
          case 'http': pcData = await getPc3HttpMetricas(); break;
          case 'https': pcData = await getPc3HttpsMetricas(); break;
          case 'icmp': pcData = await getPc3IcmpMetricas(); break;
          case 'smtp': pcData = await getPc3SmtpMetricas(); break;
          case 'tcp': pcData = await getPc3TcpMetricas(); break;
          case 'udp': pcData = await getPc3UdpMetricas(); break;
          case 'voip': pcData = await getPc3VoipMetricas(); break;
        }
      }

      // Fallback to generic function if not found in switch
      if (!pcData) {
        pcData = await getProtocoloDetalle(pc, name);
      }
      
      return {
        type: protocolName.toUpperCase() as any,
        data: pcData
      };
    } catch (e) {
      console.warn(`No se encontró detalle de protocolo ${protocolName} para ${pc}`);
    }
  }

  try {
    const generalData = await getProtocoloGeneral(protocolName);
    return {
      type: protocolName.toUpperCase() as any,
      data: generalData
    };
  } catch (e) {
    return null;
  }
}

export async function getProtocoloGeneral(protocolo: string) {
  const name = protocolo.toLowerCase();
  switch (name) {
    case 'dns': return getGeneralDns();
    case 'ftp': return getGeneralFtp();
    case 'http': return getGeneralHttp();
    case 'https': return getGeneralHttps();
    case 'icmp': return getGeneralIcmp();
    case 'smtp': return getGeneralSmtp();
    case 'tcp': return getGeneralTcp();
    case 'udp': return getGeneralUdp();
    case 'voip': return getGeneralVoip();
    default: return { disponible: false };
  }
}

export async function getAllProtocolosGeneral() {
  const [dns, ftp, http, https, icmp, smtp, tcp, udp, voip] = await Promise.all([
    getGeneralDns(),
    getGeneralFtp(),
    getGeneralHttp(),
    getGeneralHttps(),
    getGeneralIcmp(),
    getGeneralSmtp(),
    getGeneralTcp(),
    getGeneralUdp(),
    getGeneralVoip()
  ]);

  return { dns, ftp, http, https, icmp, smtp, tcp, udp, voip };
}
