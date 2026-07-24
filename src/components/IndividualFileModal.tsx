import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Activity, Globe, FileText, Shield, Zap, Mail, Server, Database, Volume2, AlertCircle, Hash } from 'lucide-react';
import { getArchivoProtocolDetails } from '../services/archivosService';
import { getProtocolColor } from '../constants';

interface IndividualFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  pc: string;
  filename: string;
  initialProtocol?: string;
  availableProtocols: string[];
}

export default function IndividualFileModal({ 
  isOpen, 
  onClose, 
  pc, 
  filename, 
  initialProtocol = 'HTTP',
  availableProtocols
}: IndividualFileModalProps) {
  const [selectedProtocol, setSelectedProtocol] = useState(initialProtocol);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedProtocol) {
      setLoading(true);
      getArchivoProtocolDetails(pc, filename, selectedProtocol).then(data => {
        setDetails(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [isOpen, selectedProtocol, pc, filename]);

  // Reset selected protocol when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedProtocol(initialProtocol);
    }
  }, [isOpen, initialProtocol]);

  if (!isOpen) return null;

  const protocolColor = getProtocolColor(selectedProtocol);

  const renderMetric = (label: string, value: string | number, icon: any) => (
    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white shadow-sm text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-900">{typeof value === 'number' ? value.toLocaleString() : (value || '0')}</p>
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
          <p className="text-slate-500 font-medium">Cargando métricas de {selectedProtocol}...</p>
        </div>
      );
    }

    if (!details || !details.disponible) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-amber-50 text-amber-500">
            <AlertCircle className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sin datos detallados</h3>
            <p className="text-slate-500 max-w-xs mx-auto">No hay métricas extendidas para {selectedProtocol} en este archivo.</p>
          </div>
        </div>
      );
    }

    // Simplified rendering based on ProtocolModal logic
    switch (selectedProtocol.toUpperCase()) {
      case 'DNS':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Consultas', details.total_consultas, <Globe className="w-5 h-5" />)}
              {renderMetric('Total Respuestas', details.total_respuestas, <Activity className="w-5 h-5" />)}
              {renderMetric('Sin Respuesta', details.consultas_sin_respuesta, <AlertCircle className="w-5 h-5 text-amber-500" />)}
            </div>
            {renderList('Top Dominios', details.top_dominios || [], (domain, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{domain}</span>
                <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
              </div>
            ))}
          </div>
        );
      case 'HTTP':
      case 'HTTPS':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderMetric('Total Requests', details.total_requests, <Globe className="w-5 h-5" />)}
              {renderMetric('Total Responses', details.total_responses, <Activity className="w-5 h-5" />)}
              {renderMetric('Latencia Promedio', `${details.latencia_promedio_ms} ms`, <Activity className="w-5 h-5" />)}
              {renderMetric('P95 Latencia', `${details.latencia_p95_ms} ms`, <Shield className="w-5 h-5 text-blue-500" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {renderList('Métodos HTTP', Object.entries(details.metodos_http || {}), ([metodo, cant], idx) => (
    <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
      <span className="text-sm font-bold text-slate-700">{metodo}</span>
      <span className="text-sm font-bold text-slate-900">
        {(cant as number)?.toLocaleString('es-ES') || '0'}
      </span>
    </div>
  ))}
  {renderList('Códigos de Respuesta', Object.entries(details.codigos_respuesta || {}), ([codigo, cant], idx) => (
    <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
      <span className="text-sm font-bold text-slate-700">Status {codigo}</span>
      <span className="text-sm font-bold text-slate-900">
        {(cant as number)?.toLocaleString('es-ES') || '0'}
      </span>
    </div>
  ))}
</div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8 bg-slate-50 rounded-2xl text-slate-500 text-center border border-dashed border-slate-200">
            <Info className="w-8 h-8 mx-auto mb-3 opacity-20" />
            <p>Métricas detalladas para {selectedProtocol} se están procesando.</p>
          </div>
        );
    }
  };

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
          {/* Header */}
          <div 
            className="p-6 md:p-8 text-white flex justify-between items-start shrink-0 transition-colors duration-500"
            style={{ backgroundColor: protocolColor }}
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Análisis de Archivo: {filename}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black flex items-center gap-3">
                {selectedProtocol}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Protocol Selector - No "Todos" option */}
            <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cambiar Protocolo</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableProtocols.map(proto => (
                  <button
                    key={proto}
                    onClick={() => setSelectedProtocol(proto)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      selectedProtocol === proto 
                        ? 'bg-white shadow-md ring-2 ring-offset-2' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    style={{ 
                      color: selectedProtocol === proto ? protocolColor : undefined,
                      ringColor: selectedProtocol === proto ? protocolColor : undefined
                    }}
                  >
                    {proto}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                  <Server className="w-4 h-4 text-blue-500" />
                  Métricas Detalladas
                </h3>
                {renderDetails()}
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
            <button 
              onClick={onClose}
              className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
              Cerrar Análisis
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Simple Filter icon for the selector
function Filter({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}
