import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Hash, Activity, Globe, FileText, Shield, Zap, Mail, Server, Database, Volume2, AlertCircle } from 'lucide-react';
import { ProtocolData, ProtocolDetails, HTTPDetails } from '../../types';

interface ProtocolModalProps {
  protocol: ProtocolData | null;
  onClose: () => void;
  selectedPC?: string;
}

export default function ProtocolModal({ protocol, onClose, selectedPC }: ProtocolModalProps) {
  const [details, setDetails] = useState<ProtocolDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (protocol) {
      setLoading(true);
      
      console.log('📊 Protocol en ProtocolModal:', protocol);
      
      // ============================================================
      // 🔧 CORRECCIÓN: Usar datos del JSON directamente
      // ============================================================
      if (protocol.details) {
        setDetails(protocol.details);
        setLoading(false);
      } else {
        // Construir detalles a partir de los datos del protocolo
        const data = { ...protocol } as any;
        const detallesConstruidos = {
          type: protocol.protocolo,
          data: data
        } as ProtocolDetails;
        setDetails(detallesConstruidos);
        setLoading(false);
      }
    } else {
      setDetails(null);
    }
  }, [protocol, selectedPC]);

  if (!protocol) return null;

  // ============================================================
  // 📊 FUNCIONES DE RENDERIZADO
  // ============================================================

  const renderMetric = (label: string, value: string | number, icon: any) => (
    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white shadow-sm text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-900">
          {typeof value === 'number' ? value.toLocaleString('es-ES') : (value || '0')}
        </p>
      </div>
    </div>
  );

  const renderList = (title: string, items: any[], renderItem: (item: any, idx: number) => ReactNode) => (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{title}</h4>
      <div className="space-y-2">
        {items.map(renderItem)}
      </div>
    </div>
  );

  const renderDetails = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Cargando métricas...</p>
        </div>
      );
    }

    if (!details || !details.data.disponible) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-amber-50 text-amber-500">
            <AlertCircle className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sin datos disponibles</h3>
            <p className="text-slate-500 max-w-xs mx-auto">No hay datos disponibles para este protocolo en el PC seleccionado.</p>
          </div>
        </div>
      );
    }

    const { type, data } = details;

    switch (type) {
      case 'DNS':
        const dns = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Consultas', dns.total_consultas || dns.consultas, <Globe className="w-5 h-5" />)}
              {renderMetric('Total Respuestas', dns.total_respuestas || dns.respuestas, <Activity className="w-5 h-5" />)}
              {renderMetric('Sin Respuesta', dns.consultas_sin_respuesta || 0, <AlertCircle className="w-5 h-5 text-amber-500" />)}
            </div>
            {renderList('Top Dominios', dns.top_dominios || [], (domain, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{domain}</span>
                <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
              </div>
            ))}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tipos de Consulta</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(dns.tipos_consulta || {}).map(([tipo, cant], idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Tipo {tipo}</span>
                    <span className="text-sm font-bold text-slate-900">{(cant as number)?.toLocaleString('es-ES') || '0'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'FTP':
        const ftp = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', ftp.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', ftp.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Total Comandos', ftp.comandos?.total, <Zap className="w-5 h-5" />)}
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
              {renderMetric('Total Requests', http.total_requests || http.total_paquetes, <Globe className="w-5 h-5" />)}
              {renderMetric('Total Responses', http.total_responses, <Activity className="w-5 h-5" />)}
              {renderMetric('Latencia Promedio', `${http.latencia_promedio_ms || 0} ms`, <Activity className="w-5 h-5" />)}
              {renderMetric('Latencia Mínima', `${http.latencia_min_ms || 0} ms`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Latencia Máxima', `${http.latencia_max_ms || 0} ms`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('P95 Latencia', `${http.latencia_p95_ms || 0} ms`, <Shield className="w-5 h-5 text-blue-500" />)}
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

      case 'VOIP':
        const voip = data as any;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Jitter Promedio', `${voip.jitter_promedio_ms || 0} ms`, <Volume2 className="w-5 h-5" />)}
              {renderMetric('Jitter Máximo', `${voip.jitter_max_ms || 0} ms`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('Jitter P95', `${voip.jitter_p95_ms || 0} ms`, <Shield className="w-5 h-5 text-blue-500" />)}
              {renderMetric('Pérdida Promedio', `${voip.perdida_promedio_pct || 0}%`, <Activity className="w-5 h-5 text-amber-500" />)}
              {renderMetric('Pérdida Máxima', `${voip.perdida_max_pct || 0}%`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-500 text-center">
            Métricas detalladas no disponibles para este protocolo.
          </div>
        );
    }
  };

  // ============================================================
  // 📦 RENDER PRINCIPAL
  // ============================================================

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div
            className="p-6 md:p-8 text-white flex justify-between items-start shrink-0"
            style={{ backgroundColor: protocol.color || '#0f172a' }}
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Métricas de Protocolo
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black">{protocol.protocolo}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-slate-100">
              <div className="p-4 md:p-6 sm:border-r border-slate-100 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-50 text-slate-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Cantidad Total</p>
                  <p className="text-lg md:text-xl font-bold text-slate-900">
                    {protocol.total?.toLocaleString('es-ES') || '0'}
                  </p>
                </div>
              </div>
              <div className="p-4 md:p-6 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-50 text-slate-400">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Porcentaje Global</p>
                  <p className="text-lg md:text-xl font-bold text-slate-900">
                    {protocol.porcentaje_global?.toFixed(1) || '0'}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                  <Server className="w-4 h-4 text-blue-500" />
                  Detalle del Protocolo
                </h3>
                {renderDetails()}
              </section>
            </div>
          </div>

          <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
