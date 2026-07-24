import React from 'react';
import {
  Activity,
  AlertCircle,
  Database,
  FileText,
  Hash,
  Mail,
  Shield,
  Zap,
} from 'lucide-react';

interface ProtocolModalProps {
  protocol: any;
  onClose: () => void;
  selectedPC?: string | null;
}

const renderMetric = (label: string, value: string | number, icon: any) => (
  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
    <div className="p-3 rounded-xl bg-white shadow-sm text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-slate-900">
        {typeof value === 'number' ? value.toLocaleString('es-ES') : value || '0'}
      </p>
    </div>
  </div>
);

const renderList = (title: string, items: any[], renderItem: (item: any, idx: number) => React.ReactNode) => (
  <div className="space-y-3">
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{title}</h4>
    <div className="space-y-2">{items.map(renderItem)}</div>
  </div>
);

export default function ProtocolModal({ protocol, onClose, selectedPC }: ProtocolModalProps) {
  if (!protocol) return null;

  const data = protocol.details || protocol;

  const renderContent = () => {
    switch (protocol.protocolo) {
      case 'FTP':
        const ftp = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', ftp.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', ftp.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Comandos Totales', ftp.comandos?.total, <Zap className="w-5 h-5" />)}
              {renderMetric('Respuestas Exitosas', ftp.respuestas?.exitosas_2xx, <Activity className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Respuestas Error', ftp.respuestas?.errores_4xx_5xx, <AlertCircle className="w-5 h-5 text-rose-500" />)}
            </div>
            {renderList('Comandos por Tipo', ftp.comandos?.por_tipo || [], (cmd, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">{cmd.comando}</span>
                <span className="text-sm font-bold text-slate-900">{cmd.cantidad?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
            {renderList('Top IPs Origen', ftp.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
          </div>
        );

      case 'HTTP':
        const http = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', http.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Requests', http.total_requests, <Activity className="w-5 h-5" />)}
              {renderMetric('Total Responses', http.total_responses, <Activity className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Latencia Promedio', `${http.latencia_promedio_ms || 0} ms`, <Zap className="w-5 h-5" />)}
              {renderMetric('Latencia P95', `${http.latencia_p95_ms || 0} ms`, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderList('Métodos HTTP', Object.entries(http.metodos_http || {}), ([metodo, cant], idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">{metodo}</span>
                  <span className="text-sm font-bold text-slate-900">{(cant as number)?.toLocaleString('es-ES') || '0'}</span>
                </div>
              ))}
              {renderList('Códigos de Respuesta', Object.entries(http.codigos_respuesta || {}), ([codigo, cant], idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Status {codigo}</span>
                  <span className="text-sm font-bold text-slate-900">{(cant as number)?.toLocaleString('es-ES') || '0'}</span>
                </div>
              ))}
            </div>
            {renderList('Top Hosts', Object.entries(http.top_hosts || {}), ([host, cant], idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{host}</span>
                <span className="text-sm font-bold text-slate-900">{(cant as number)?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
          </div>
        );

      case 'HTTPS':
        const https = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', https.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', https.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Handshakes', https.handshakes, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
          </div>
        );

      case 'ICMP':
        const icmp = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Pings', icmp.total_pings, <Activity className="w-5 h-5" />)}
              {renderMetric('RTT Promedio', `${icmp.rtt_promedio_ms || 0} ms`, <Zap className="w-5 h-5" />)}
              {renderMetric('RTT Mínimo', `${icmp.rtt_min_ms || 0} ms`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('RTT Máximo', `${icmp.rtt_max_ms || 0} ms`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('RTT P95', `${icmp.rtt_p95_ms || 0} ms`, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
          </div>
        );

      case 'SMTP':
        const smtp = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', smtp.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', smtp.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Total Comandos', smtp.comandos?.total, <Zap className="w-5 h-5" />)}
              {renderMetric('Respuestas Exitosas', smtp.respuestas?.exitosas_2xx, <Activity className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Respuestas Error', smtp.respuestas?.errores_4xx_5xx, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('Mensajes Enviados', smtp.envio_correos?.total_mensajes, <Mail className="w-5 h-5 text-blue-500" />)}
            </div>
            {renderList('Top IPs Origen', smtp.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
          </div>
        );

      case 'TCP':
        const tcp = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', tcp.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', tcp.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Retransmisiones', tcp.retransmisiones?.total, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('Tamaño Promedio', `${tcp.tamanio_paquete?.promedio || 0} B`, <FileText className="w-5 h-5" />)}
              {renderMetric('Tamaño Mínimo', `${tcp.tamanio_paquete?.minimo || 0} B`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Tamaño Máximo', `${tcp.tamanio_paquete?.maximo || 0} B`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
            </div>
            {renderList('Top Puertos Destino', tcp.top_puertos_destino || [], (p, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Puerto {p.puerto}</span>
                <span className="text-sm font-bold text-slate-900">{p.cantidad?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
            {renderList('Top IPs Origen', tcp.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
          </div>
        );

      case 'UDP':
        const udp = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', udp.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', udp.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Tamaño Promedio', `${udp.tamanio_paquete?.promedio || 0} B`, <FileText className="w-5 h-5" />)}
              {renderMetric('Tamaño Mínimo', `${udp.tamanio_paquete?.minimo || 0} B`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Tamaño Máximo', `${udp.tamanio_paquete?.maximo || 0} B`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('P95 Tamaño', `${udp.tamanio_paquete?.p95 || 0} B`, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
            {renderList('Top Puertos Destino', udp.top_puertos_destino || [], (p, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Puerto {p.puerto}</span>
                <span className="text-sm font-bold text-slate-900">{p.cantidad?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
            {renderList('Top IPs Origen', udp.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad?.toLocaleString('es-ES') || '0'}</span>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-center text-slate-500">No hay detalles disponibles para este protocolo</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{protocol.protocolo}</h2>
            {selectedPC && <p className="text-sm text-slate-500">PC: {selectedPC}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
