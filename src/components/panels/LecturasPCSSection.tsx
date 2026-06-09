import { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Clock } from 'lucide-react';
import { getLecturasPCS } from '../../services/pcsService';
import { LecturaPCS } from '../../types';
import { cn } from '../../lib/utils';
import { getProtocolColor } from '../../constants';
import PCSHoursPanel from './PCSHoursPanel';

const PROTOCOLS = ['DNS', 'FTP', 'HTTP', 'HTTPS', 'ICMP', 'SMTP', 'TCP', 'UDP'];
const PCS = ['PC1', 'PC2', 'PC3'];

export default function LecturasPCSSection() {
  const [lecturas, setLecturas] = useState<LecturaPCS[]>([]);
  const [pcSeleccionado, setPcSeleccionado] = useState<string>('PC1');
  const [protocoloSeleccionado, setProtocoloSeleccionado] = useState<string | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getLecturasPCS(pcSeleccionado);
      setLecturas(data);
    }
    loadData();
  }, [pcSeleccionado]);

  // Selección automática del día con mayor valor
  const autoSelectedDay = useMemo(() => {
    if (lecturas.length === 0) return null;
    return [...lecturas].sort((a, b) => b.total_dia - a.total_dia)[0].fecha;
  }, [lecturas]);

  useEffect(() => {
    if (autoSelectedDay) {
      setDiaSeleccionado(autoSelectedDay);
    }
  }, [autoSelectedDay]);

  const chartData = useMemo(() => {
    return lecturas.map(lectura => {
      let valor = lectura.total_dia;
      let porcentaje = lectura.porcentaje_global_dia;

      if (protocoloSeleccionado) {
        const protoData = lectura.protocolos.find(p => p.protocolo === protocoloSeleccionado);
        valor = protoData ? protoData.total_protocolo_dia : 0;
        porcentaje = protoData ? protoData.porcentaje_en_dia : 0;
      }

      return {
        fecha: lectura.fecha,
        valor,
        porcentaje,
        original: lectura
      };
    });
  }, [lecturas, protocoloSeleccionado]);

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedData = data.activePayload[0].payload;
      setDiaSeleccionado(clickedData.fecha);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl text-white text-xs">
          <p className="font-bold mb-1">{data.fecha}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-4">
              <span className="text-slate-400">Cantidad:</span>
              <span className="font-mono">{data.valor.toLocaleString()}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400">Porcentaje:</span>
              <span className="font-mono text-blue-400">{data.porcentaje}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <header className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Lecturas PCS</h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">Monitoreo detallado del tráfico por estación de trabajo.</p>
        </div>
        <button
          onClick={() => setPanelAbierto(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md group"
          title="Ver timeline por horas"
        >
          <Clock className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold hidden sm:inline">Timeline Horario</span>
        </button>
      </header>

      {/* PC Selector */}
      <div className="flex flex-wrap gap-2">
        {PCS.map(pc => (
          <button
            key={pc}
            onClick={() => setPcSeleccionado(pc)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              pcSeleccionado === pc 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
            )}
          >
            {pc}
          </button>
        ))}
      </div>

      {/* Protocol Selector */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setProtocoloSeleccionado(null)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all border",
            protocoloSeleccionado === null 
              ? "text-white shadow-lg" 
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          )}
          style={protocoloSeleccionado === null ? { backgroundColor: getProtocolColor(null), borderColor: getProtocolColor(null) } : {}}
        >
          Total del día
        </button>
        {PROTOCOLS.map(proto => (
          <button
            key={proto}
            onClick={() => setProtocoloSeleccionado(proto)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all border",
              protocoloSeleccionado === proto 
                ? "text-white shadow-lg" 
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
            )}
            style={protocoloSeleccionado === proto ? { 
              backgroundColor: getProtocolColor(proto),
              borderColor: getProtocolColor(proto)
            } : {}}
          >
            {proto}
          </button>
        ))}
      </div>

      {/* Chart Section */}
      <div className="flex-1 min-h-[400px] bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Evolución de Tráfico - {pcSeleccionado}
          </h2>
          <p className="text-slate-500 text-sm">
            {protocoloSeleccionado ? `Protocolo: ${protocoloSeleccionado}` : 'Total Tráfico Diario'}
          </p>
        </div>
        
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              onClick={handlePointClick}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="fecha" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke={getProtocolColor(protocoloSeleccionado)} 
                strokeWidth={3}
                dot={{ 
                  r: 6, 
                  fill: getProtocolColor(protocoloSeleccionado), 
                  strokeWidth: 2, 
                  stroke: '#fff' 
                }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>

          
        </div>

        {diaSeleccionado && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              
            </div>
          </div>
        )}
      </div>

      <PCSHoursPanel 
        isOpen={panelAbierto} 
        onClose={() => setPanelAbierto(false)} 
        pcSeleccionado={pcSeleccionado} 
      />
    </div>
  );
}
