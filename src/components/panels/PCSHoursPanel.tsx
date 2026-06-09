import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROTOCOL_COLORS } from '../../constants';
import { getPCHourlyData } from '../../services/pcsService';

interface HoraData {
  hora: number;
  protocolo: string;
  cantidad: number;
}

interface PCSHoursPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pcSeleccionado: string;
}

const PROTOCOLS = ['DNS', 'FTP', 'HTTP', 'HTTPS', 'ICMP', 'SMTP', 'TCP', 'UDP'];

export default function PCSHoursPanel({ isOpen, onClose, pcSeleccionado }: PCSHoursPanelProps) {
  const [horas, setHoras] = useState<HoraData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPCHourlyData(pcSeleccionado);
        setHoras(data);
      } catch (error) {
        console.error("Error loading PC hours data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, pcSeleccionado]);

  const chartData = useMemo(() => {
    if (horas.length === 0) return [];

    // Agrupar por hora
    const grouped = horas.reduce((acc: any, curr) => {
      const horaStr = curr.hora.toString().padStart(2, '0') + ':00';
      if (!acc[curr.hora]) {
        acc[curr.hora] = { hora: horaStr, rawHora: curr.hora };
        // Inicializar todos los protocolos en 0
        PROTOCOLS.forEach(p => acc[curr.hora][p] = 0);
      }
      acc[curr.hora][curr.protocolo] = curr.cantidad;
      return acc;
    }, {});

    // Convertir a array y ordenar por hora
    return Object.values(grouped).sort((a: any, b: any) => a.rawHora - b.rawHora);
  }, [horas]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Ordenar el payload por el nombre del protocolo para asegurar consistencia
      const sortedPayload = [...payload].sort((a, b) => a.name.localeCompare(b.name));

      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl min-w-[140px]">
          <p className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs">{label}</p>
          <div className="space-y-1">
            {sortedPayload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center gap-3">
                <span className="text-[11px] font-bold" style={{ color: entry.color }}>
                  {entry.name}:
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-700">
                  {entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Timeline: {pcSeleccionado}</h2>
                  <p className="text-sm text-slate-500">Distribución horaria por protocolos</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="h-[500px] w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="hora" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36}/>
                        {PROTOCOLS.map((protocol) => (
                          <Area
                            key={protocol}
                            type="monotone"
                            dataKey={protocol}
                            stackId="1"
                            stroke={(PROTOCOL_COLORS as any)[protocol]}
                            fill={(PROTOCOL_COLORS as any)[protocol]}
                            fillOpacity={0.6}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resumen de Tráfico</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {PROTOCOLS.map(p => {
                        const total = horas.filter(h => h.protocolo === p).reduce((sum, curr) => sum + curr.cantidad, 0);
                        return (
                          <div key={p} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{p}</p>
                            <p className="text-lg font-bold text-slate-900">{total.toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cerrar Panel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
