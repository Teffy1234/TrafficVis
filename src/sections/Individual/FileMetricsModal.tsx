import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Hash, Activity, Globe, FileText, Shield, Zap, Mail, Server, Database, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { Protocolo } from '../../services/archivosService';
import { PROTOCOL_COLORS } from '../../constants';
import { HTTPDetails } from '../../types';
import { getMetricas } from '../../services/metricasService';

interface FileMetricsModalProps {
  fileName: string;
  pc: string;
  onClose: () => void;
}

export default function FileMetricsModal({ fileName, pc, onClose }: FileMetricsModalProps) {
  const availableProtocols: Protocolo[] = ['DNS', 'FTP', 'HTTP', 'ICMP', 'SMTP', 'TCP', 'UDP'];
  const [selectedProtocol, setSelectedProtocol] = useState<Protocolo>(availableProtocols[0]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtocolMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMetricas(pc, fileName, selectedProtocol);
        setMetrics(data);
      } catch (err) {
        console.error(`Error al cargar métricas de ${selectedProtocol}:`, err);
        setError(`No se pudieron cargar las métricas de ${selectedProtocol}`);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocolMetrics();
  }, [pc, fileName, selectedProtocol]);

  const renderMetric = (label: string, value: string | number, icon: any) => (
    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white shadow-sm text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-900">{typeof value === 'number' ? value.toLocaleString('es-ES') : value}</p>
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
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Cargando datos de {selectedProtocol}...</p>
        </div>
      );
    }

    if (error || !metrics || !metrics.disponible) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-amber-50 text-amber-500">
            <AlertCircle className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{error ? 'Error de carga' : 'Sin datos disponibles'}</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              {error || `No hay datos disponibles para el protocolo ${selectedProtocol} en este archivo.`}
            </p>
          </div>
        </div>
      );
    }

    const data = metrics;

    switch (selectedProtocol) {
      case 'DNS':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Consultas', data.total_consultas, <Globe className="w-5 h-5" />)}
              {renderMetric('Total Respuestas', data.total_respuestas, <Activity className="w-5 h-5" />)}
              {renderMetric('Sin Respuesta', data.consultas_sin_respuesta, <AlertCircle className="w-5 h-5 text-amber-500" />)}
            </div>
            {renderList('Top Dominios', data.top_dominios || [], (domain, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{domain}</span>
                <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
              </div>
            ))}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tipos de Consulta</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(data.tipos_consulta || {}).map(([tipo, cant], idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Tipo {tipo}</span>
                    <span className="text-sm font-bold text-slate-900">{(cant as number).toLocaleString('es-ES')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'FTP':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', data.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', data.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Total Comandos', data.comandos?.total, <Zap className="w-5 h-5" />)}
              {renderMetric('Respuestas Exitosas', data.respuestas?.exitosas_2xx, <Activity className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Respuestas Error', data.respuestas?.errores_4xx_5xx, <AlertCircle className="w-5 h-5 text-rose-500" />)}
            </div>
            {renderList('Comandos por Tipo', data.comandos?.por_tipo || [], (cmd, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">{cmd.comando}</span>
                <span className="text-sm font-bold text-slate-900">{cmd.cantidad.toLocaleString('es-ES')}</span>
              </div>
            ))}
            {renderList('Top IPs Origen', data.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad.toLocaleString('es-ES')}</span>
              </div>
            ))}
          </div>
        );

      case 'HTTP':
        const http = data as HTTPDetails;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Requests', http.total_requests, <Globe className="w-5 h-5" />)}
              {renderMetric('Total Responses', http.total_responses, <Activity className="w-5 h-5" />)}
              {renderMetric('Latencia Promedio', `${http.latencia_promedio_ms} ms`, <Activity className="w-5 h-5" />)}
              {renderMetric('Latencia Mínima', `${http.latencia_min_ms} ms`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Latencia Máxima', `${http.latencia_max_ms} ms`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('P95 Latencia', `${http.latencia_p95_ms} ms`, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderList('Métodos HTTP', Object.entries(http.metodos_http || {}), ([metodo, cant], idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">{metodo}</span>
                  <span className="text-sm font-bold text-slate-900">{(cant as number).toLocaleString('es-ES')}</span>
                </div>
              ))}
              {renderList('Códigos de Respuesta', Object.entries(http.codigos_respuesta || {}), ([codigo, cant], idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Status {codigo}</span>
                  <span className="text-sm font-bold text-slate-900">{(cant as number).toLocaleString('es-ES')}</span>
                </div>
              ))}
            </div>
            {renderList('Top Hosts', Object.entries(http.top_hosts || {}), ([host, cant], idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{host}</span>
                <span className="text-sm font-bold text-slate-900">{(cant as number).toLocaleString('es-ES')}</span>
              </div>
            ))}
          </div>
        );

      case 'ICMP':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Pings', data.total_pings, <Activity className="w-5 h-5" />)}
              {renderMetric('RTT Promedio', `${data.rtt_promedio_ms} ms`, <Zap className="w-5 h-5" />)}
              {renderMetric('RTT Mínimo', `${data.rtt_min_ms} ms`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('RTT Máximo', `${data.rtt_max_ms} ms`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('RTT P95', `${data.rtt_p95_ms} ms`, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
          </div>
        );

      case 'SMTP':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', data.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', data.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Total Comandos', data.comandos?.total, <Zap className="w-5 h-5" />)}
              {renderMetric('Respuestas Exitosas', data.respuestas?.exitosas_2xx, <Activity className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Respuestas Error', data.respuestas?.errores_4xx_5xx, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('Mensajes Enviados', data.envio_correos?.total_mensajes, <Mail className="w-5 h-5 text-blue-500" />)}
            </div>
            {renderList('Top IPs Origen', data.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad.toLocaleString('es-ES')}</span>
              </div>
            ))}
          </div>
        );

      case 'TCP':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', data.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', data.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Retransmisiones', data.retransmisiones?.total, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('Tamaño Promedio', `${data.tamanio_paquete?.promedio} B`, <FileText className="w-5 h-5" />)}
              {renderMetric('Tamaño Mínimo', `${data.tamanio_paquete?.minimo} B`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Tamaño Máximo', `${data.tamanio_paquete?.maximo} B`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
            </div>
            {renderList('Top Puertos Destino', data.top_puertos_destino || [], (p, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Puerto {p.puerto}</span>
                <span className="text-sm font-bold text-slate-900">{p.cantidad.toLocaleString('es-ES')}</span>
              </div>
            ))}
            {renderList('Top IPs Origen', data.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad.toLocaleString('es-ES')}</span>
              </div>
            ))}
          </div>
        );

      case 'UDP':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Paquetes', data.total_paquetes, <Hash className="w-5 h-5" />)}
              {renderMetric('Total Bytes', data.total_bytes, <Database className="w-5 h-5" />)}
              {renderMetric('Tamaño Promedio', `${data.tamanio_paquete?.promedio} B`, <FileText className="w-5 h-5" />)}
              {renderMetric('Tamaño Mínimo', `${data.tamanio_paquete?.minimo} B`, <Zap className="w-5 h-5 text-emerald-500" />)}
              {renderMetric('Tamaño Máximo', `${data.tamanio_paquete?.maximo} B`, <AlertCircle className="w-5 h-5 text-rose-500" />)}
              {renderMetric('P95 Tamaño', `${data.tamanio_paquete?.p95} B`, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
            {renderList('Top Puertos Destino', data.top_puertos_destino || [], (p, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Puerto {p.puerto}</span>
                <span className="text-sm font-bold text-slate-900">{p.cantidad.toLocaleString('es-ES')}</span>
              </div>
            ))}
            {renderList('Top IPs Origen', data.top_ips_origen || [], (ip, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ip.ip}</span>
                <span className="text-sm font-bold text-slate-900">{ip.cantidad.toLocaleString('es-ES')}</span>
              </div>
            ))}
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

  const protocolColor = (PROTOCOL_COLORS as any)[selectedProtocol] || PROTOCOL_COLORS.DEFAULT;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div 
            className="p-6 md:p-8 text-white flex justify-between items-start shrink-0 transition-colors duration-300"
            style={{ backgroundColor: protocolColor }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Métricas de Archivo: {pc}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black truncate max-w-[400px]" title={fileName}>
                {fileName}
              </h2>
              
              {/* Protocol Selector within Header */}
              <div className="mt-6 flex items-center gap-3">
                <div className="relative group">
                  <select
                    value={selectedProtocol}
                    onChange={(e) => setSelectedProtocol(e.target.value as Protocolo)}
                    className="appearance-none bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 pr-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/30 transition-all cursor-pointer"
                  >
                    {availableProtocols.map(p => (
                      <option key={p} value={p} className="text-slate-900">{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Seleccionar Protocolo
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Body - Protocol Specific Metrics */}
            <div className="p-6 md:p-8">
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                  <Server className="w-4 h-4" style={{ color: protocolColor }} />
                  Detalle de {selectedProtocol}
                </h3>
                {renderDetails()}
              </section>
            </div>
          </div>

          {/* Footer */}
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
