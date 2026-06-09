export interface PCData {
  pc: string;
  cantidad: number;
  porcentaje_en_protocolo: number;
}

export interface ProtocolData {
  protocolo: string;
  pcs: PCData[];
  total: number;
  porcentaje_global: number;
  color?: string;
  id?: string;
}

export interface DNSDetails {
  disponible: boolean;
  total_consultas: number;
  total_respuestas: number;
  consultas_sin_respuesta: number;
  top_dominios: string[];
  tipos_consulta: Record<string, number>;
}

export interface FTPDetails {
  disponible: boolean;
  total_paquetes: number;
  total_bytes: number;
  comandos: {
    total: number;
    por_tipo: { comando: string; cantidad: number }[];
  };
  respuestas: {
    total: number;
    exitosas_2xx: number;
    errores_4xx_5xx: number;
  };
  transferencias: {
    descargas: number;
    subidas: number;
  };
  top_ips_origen: { ip: string; cantidad: number }[];
}

export interface HTTPDetails {
  disponible: boolean;
  total_requests: number;
  total_responses: number;
  metodos_http: Record<string, number>;
  codigos_respuesta: Record<string, number>;
  top_hosts: Record<string, number>;
  latencia_promedio_ms: number;
  latencia_min_ms: number;
  latencia_max_ms: number;
  latencia_p95_ms: number;
}

export interface ICMPDetails {
  disponible: boolean;
  total_pings: number;
  rtt_promedio_ms: number;
  rtt_min_ms: number;
  rtt_max_ms: number;
  rtt_p95_ms: number;
}

export interface SMTPDetails {
  disponible: boolean;
  total_paquetes: number;
  total_bytes: number;
  comandos: {
    total: number;
  };
  respuestas: {
    total: number;
    exitosas_2xx: number;
    errores_4xx_5xx: number;
  };
  envio_correos: {
    total_mensajes: number;
  };
  top_ips_origen: { ip: string; cantidad: number }[];
}

export interface TCPDetails {
  disponible: boolean;
  total_paquetes: number;
  total_bytes: number;
  retransmisiones: {
    total: number;
  };
  top_puertos_destino: { puerto: number; cantidad: number }[];
  top_ips_origen: { ip: string; cantidad: number }[];
  tamanio_paquete: {
    promedio: number;
    minimo: number;
    maximo: number;
    p95: number;
  };
}

export interface UDPDetails {
  disponible: boolean;
  total_paquetes: number;
  total_bytes: number;
  tamanio_paquete: {
    promedio: number;
    minimo: number;
    maximo: number;
    p95: number;
  };
  top_puertos_destino: { puerto: number; cantidad: number }[];
  top_ips_origen: { ip: string; cantidad: number }[];
}

export interface VOIPDetails {
  disponible: boolean;
  jitter_promedio_ms: number;
  jitter_max_ms: number;
  jitter_p95_ms: number;
  perdida_promedio_pct: number;
  perdida_max_pct: number;
}

export type ProtocolDetails = 
  | { type: 'DNS', data: DNSDetails }
  | { type: 'FTP', data: FTPDetails }
  | { type: 'HTTPS', data: HTTPDetails }
  | { type: 'ICMP', data: ICMPDetails }
  | { type: 'SMTP', data: SMTPDetails }
  | { type: 'TCP', data: TCPDetails }
  | { type: 'UDP', data: UDPDetails }
  | { type: 'VOIP', data: VOIPDetails }
  | { type: 'HTTP', data: HTTPDetails };

export interface PCReading {
  pc: string;
  cantidad: number;
  porcentaje_en_dia: number;
}

export interface PCProtocolReading {
  pc: string;
  cantidad: number;
  porcentaje_en_protocolo_dia: number;
}

export interface ProtocolReading {
  protocolo: string;
  total_protocolo_dia: number;
  porcentaje_en_dia: number;
  pcs: PCProtocolReading[];
}

export interface Lectura {
  fecha: string;
  total_dia: number;
  porcentaje_global_dia: number;
  totales_por_pc: PCReading[];
  protocolos: ProtocolReading[];
}

export interface LecturaPCS {
  fecha: string;
  total_dia: number;
  porcentaje_global_dia: number;
  protocolos: ProtocoloPCS[];
}

export interface ProtocoloPCS {
  protocolo: string;
  total_protocolo_dia: number;
  porcentaje_en_dia: number;
}

export type Section = 'General' | 'Lecturas' | 'PCS' | 'Lecturas PCS' | 'Individual';
