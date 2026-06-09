import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLecturasPorHoras } from '../../services/lecturasService';
import { getProtocolColor } from '../../constants';

interface HoraData {
  fecha: string;
  hora: number;
  protocolo: string;
  cantidad: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diaSeleccionado: string | null;
}

const PROTOCOLS = ['DNS', 'FTP', 'HTTP', 'HTTPS', 'ICMP', 'SMTP', 'TCP', 'UDP'];

export default function HourDistributionPanel({ isOpen, onClose, diaSeleccionado }: Props) {
  const [data, setData] = useState<HoraData[]>([]);
  const [loading, setLoading] = useState(false);
  const [protocoloSeleccionado, setProtocoloSeleccionado] = useState<string>(PROTOCOLS[0]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getLecturasPorHoras();
        setData(result);
      } catch (error) {
        console.error("Error fetching hourly data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const filteredData = useMemo(() => {
    if (!diaSeleccionado) return [];
    return data.filter(d => d.fecha === diaSeleccionado);
  }, [data, diaSeleccionado]);

  const hours = useMemo(() => {
    const h = Array.from(new Set(filteredData.map(d => d.hora))).sort((a: number, b: number) => a - b);
    return h;
  }, [filteredData]);

  const maxCantidad = useMemo(() => {
    const protocolData = filteredData.filter(d => d.protocolo === protocoloSeleccionado);
    if (protocolData.length === 0) return 1;
    return Math.max(...protocolData.map(d => d.cantidad));
  }, [filteredData, protocoloSeleccionado]);

  const getCellData = (protocol: string, hour: number) => {
    return filteredData.find(d => d.protocolo === protocol && d.hora === hour);
  };

  // Función para convertir hex a rgba con opacidad
  const getRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Distribución por Horas</h2>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <span className="font-medium">{diaSeleccionado}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Heatmap Horario</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Cargando análisis horario...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-xs mx-auto">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                    <Clock className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Sin datos disponibles</h3>
                    <p className="text-slate-500 text-sm">No se encontraron registros de tráfico por hora para el día seleccionado.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Info Box */}
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Este heatmap muestra la intensidad del tráfico por protocolo en intervalos de una hora. 
                      Los colores más intensos representan picos de actividad.
                    </p>
                  </div>

                  {/* Protocol Selector */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleccionar Protocolo</h3>
                    <div className="flex flex-wrap gap-2">
                      {PROTOCOLS.map(p => (
                        <button
                          key={p}
                          onClick={() => setProtocoloSeleccionado(p)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                            protocoloSeleccionado === p
                              ? "text-white shadow-md"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                          )}
                          style={protocoloSeleccionado === p ? { 
                            backgroundColor: getProtocolColor(p),
                            borderColor: getProtocolColor(p)
                          } : {}}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap Container */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-x-auto">
                    <div className="min-w-[500px]">
                      <div className="grid grid-cols-[80px_1fr] gap-4">
                        {/* Empty corner */}
                        <div />
                        
                        {/* Hours Header */}
                        <div className="flex justify-between px-2">
                          {hours.map(h => (
                            <div key={h} className="w-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                              {h}h
                            </div>
                          ))}
                        </div>

                        {/* Protocol Rows */}
                        {[protocoloSeleccionado].map(protocol => (
                          <React.Fragment key={protocol}>
                            <div className="flex items-center text-[11px] font-black text-slate-500 uppercase tracking-wider">
                              {protocol}
                            </div>
                            <div className="flex justify-between gap-1">
                              {hours.map(hour => {
                                const cell = getCellData(protocol, hour);
                                const intensity = cell ? (cell.cantidad / maxCantidad) : 0;
                                const color = getProtocolColor(protocol);
                                
                                return (
                                  <div
                                    key={`${protocol}-${hour}`}
                                    className="h-12 flex-1 rounded-lg transition-all group relative cursor-help border border-transparent hover:border-slate-300 hover:scale-105 hover:z-10"
                                    style={{
                                      backgroundColor: cell ? getRgba(color, 0.1 + (intensity * 0.9)) : '#f8fafc',
                                    }}
                                  >
                                    {cell && (
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-20">
                                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl whitespace-nowrap min-w-[140px]">
                                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{protocol}</span>
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex justify-between gap-4">
                                              <span className="text-[10px] text-white/50 font-bold uppercase">Hora</span>
                                              <span className="text-xs font-bold">{hour}:00</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                              <span className="text-[10px] text-white/50 font-bold uppercase">Cantidad</span>
                                              <span className="text-xs font-bold">{cell.cantidad.toLocaleString('es-ES')}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="w-3 h-3 bg-slate-900 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Escala de Intensidad</h3>
                      <span className="text-[10px] font-bold text-slate-500">Basado en cantidad de tráfico</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded-full bg-gradient-to-r from-slate-200 via-indigo-400 to-indigo-900 shadow-inner" />
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        <span>Mínimo</span>
                        <span>Promedio</span>
                        <span>Máximo</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                Análisis de tráfico horario v1.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
