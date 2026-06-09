import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Dot
} from 'recharts';
import { motion } from 'motion/react';
import { Activity, Monitor, ArrowRight, Calendar, Clock } from 'lucide-react';
import { Lectura, Section } from '../../types';
import { cn } from '../../lib/utils';
import { getProtocolColor } from '../../constants';
import { getLecturas } from '../../services/lecturasService';
import HoursPanel from './HoursPanel';

const PROTOCOLS = ['DNS', 'FTP', 'HTTP', 'HTTPS', 'ICMP', 'SMTP', 'TCP', 'UDP'];

interface LecturasSectionProps {
  onNavigateToPCS?: (pc: string) => void;
}

export default function LecturasSection({ onNavigateToPCS }: LecturasSectionProps) {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [protocoloSeleccionado, setProtocoloSeleccionado] = useState<string | null>(null);
  const [isHoursPanelOpen, setIsHoursPanelOpen] = useState(false);

  useEffect(() => {
    const fetchLecturas = async () => {
      try {
        const data = await getLecturas();
        setLecturas(data);
      } catch (error) {
        console.error("Error fetching lecturas:", error);
      }
    };

    fetchLecturas();
  }, []);

  // Seleccionar automáticamente el día con mayor total_dia
  const diaInicial = useMemo(() => {
    if (lecturas.length === 0) return null;
    return [...lecturas].sort((a, b) => b.total_dia - a.total_dia)[0].fecha;
  }, [lecturas]);

  useEffect(() => {
    if (diaInicial && !diaSeleccionado) {
      setDiaSeleccionado(diaInicial);
    }
  }, [diaInicial, diaSeleccionado]);

  const lecturaActual = useMemo(() => {
    return lecturas.find(l => l.fecha === diaSeleccionado) || null;
  }, [lecturas, diaSeleccionado]);

  const chartData = useMemo(() => {
    return lecturas.map(l => {
      const protocolData = l.protocolos.find(p => p.protocolo === protocoloSeleccionado);
      return {
        fecha: l.fecha,
        valor: protocoloSeleccionado ? (protocolData?.total_protocolo_dia || 0) : l.total_dia,
        porcentaje: protocoloSeleccionado ? (protocolData?.porcentaje_en_dia || 0) : l.porcentaje_global_dia
      };
    });
  }, [lecturas, protocoloSeleccionado]);

  const cardsData = useMemo(() => {
    if (!lecturaActual) return [];
    
    if (protocoloSeleccionado) {
      const pData = lecturaActual.protocolos.find(p => p.protocolo === protocoloSeleccionado);
      if (!pData) return [];
      return pData.pcs
        .filter(pc => pc.cantidad > 0)
        .map(pc => ({
          pc: pc.pc,
          cantidad: pc.cantidad,
          porcentaje: pc.porcentaje_en_protocolo_dia
        }));
    } else {
      return lecturaActual.totales_por_pc
        .filter(pc => pc.cantidad > 0)
        .map(pc => ({
          pc: pc.pc,
          cantidad: pc.cantidad,
          porcentaje: pc.porcentaje_en_dia
        }));
    }
  }, [lecturaActual, protocoloSeleccionado]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
          <p className="font-bold text-slate-900">{data.fecha}</p>
          <p className="text-sm text-slate-500">
            Total: <span className="font-semibold text-slate-700">{data.valor.toLocaleString('es-ES')}</span>
          </p>
          <p className="text-sm text-slate-500">
            Porcentaje: <span className="font-semibold text-slate-700">{data.porcentaje}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <header className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Lecturas Diarias</h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">Evolución temporal del tráfico por estación y protocolo.</p>
        </div>
        <button
          onClick={() => setIsHoursPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md group"
        >
          <Clock className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold hidden sm:inline">Ver Timeline</span>
        </button>
      </header>

      {/* Protocol Selector */}
      <section className="shrink-0 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setProtocoloSeleccionado(null)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
              !protocoloSeleccionado 
                ? "text-white shadow-lg" 
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
            )}
            style={!protocoloSeleccionado ? { backgroundColor: getProtocolColor(null) } : {}}
          >
            Total del día
          </button>
          {PROTOCOLS.map(p => (
            <button
              key={p}
              onClick={() => setProtocoloSeleccionado(p)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                protocoloSeleccionado === p 
                  ? "text-white shadow-lg" 
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              )}
              style={protocoloSeleccionado === p ? { backgroundColor: getProtocolColor(p) } : {}}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* Chart Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[350px] flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {protocoloSeleccionado ? `Evolución Protocolo: ${protocoloSeleccionado}` : 'Evolución Tráfico Total'}
            </h2>
            <p className="text-xs text-slate-500">Haz clic en un punto para ver el detalle de ese día</p>
          </div>
          <div 
            className="flex items-center gap-2 px-3 py-1 rounded-lg"
            style={{ 
              backgroundColor: `${getProtocolColor(protocoloSeleccionado)}15`,
              color: getProtocolColor(protocoloSeleccionado)
            }}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold">{diaSeleccionado}</span>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state) => {
                if (state && state.activeLabel) {
                  setDiaSeleccionado(state.activeLabel);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="fecha" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke={getProtocolColor(protocoloSeleccionado)} 
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isSelected = payload.fecha === diaSeleccionado;
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={isSelected ? 6 : 4} 
                      fill={isSelected ? getProtocolColor(protocoloSeleccionado) : "#fff"} 
                      stroke={getProtocolColor(protocoloSeleccionado)}
                      strokeWidth={2}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* PCs Cards Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Distribución por PC - {diaSeleccionado}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardsData.map((pc, idx) => (
            <motion.div
              key={pc.pc}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ 
                      backgroundColor: `${getProtocolColor(protocoloSeleccionado)}10`,
                      color: getProtocolColor(protocoloSeleccionado)
                    }}
                  >
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{pc.pc}</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estación de Trabajo</p>
                  </div>
                </div>
                <div 
                  className="px-2 py-1 rounded-lg text-[10px] font-black"
                  style={{ 
                    backgroundColor: `${getProtocolColor(protocoloSeleccionado)}15`,
                    color: getProtocolColor(protocoloSeleccionado)
                  }}
                >
                  {pc.porcentaje}%
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Cantidad</span>
                    <span className="font-bold text-slate-900">{pc.cantidad.toLocaleString('es-ES')}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pc.porcentaje}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getProtocolColor(protocoloSeleccionado) }}
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => onNavigateToPCS?.(pc.pc)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  Detalle del PC
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="shrink-0 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        <p>© 2026 TrafficVis - Sistema de Monitoreo de Red Profesional</p>
      </footer>

      <HoursPanel isOpen={isHoursPanelOpen} onClose={() => setIsHoursPanelOpen(false)} />
    </div>
  );
}
