import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';
import { ProtocolData } from '../../types';

interface ProtocolChartProps {
  data: ProtocolData[];
  onBarClick?: (protocol: ProtocolData) => void;
}

// Colores predefinidos por protocolo
const COLOR_MAP: Record<string, string> = {
  'UDP': '#f97316',
  'ICMP': '#ef4444',
  'TCP': '#8b5cf6',
  'DNS': '#3b82f6',
  'FTP': '#10b981',
  'SMTP': '#14b8a6',
  'HTTP': '#f59e0b',
  'HTTPS': '#6366f1',
  'DEFAULT': '#0f172a'
};

export default function ProtocolChart({ data, onBarClick }: ProtocolChartProps) {
  // Verifica que data sea un array válido
  const chartData = Array.isArray(data) ? data : [];
  
  console.log('📊 ProtocolChart - Datos recibidos:', chartData);
  console.log('📊 ProtocolChart - Cantidad de datos:', chartData.length);

  // Si no hay datos, muestra un mensaje
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 font-medium">No hay datos disponibles</p>
          <p className="text-xs text-slate-400 mt-1">Carga los datos desde el panel de control</p>
        </div>
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const protocol = payload[0].payload as ProtocolData;
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
          <p className="font-bold text-slate-900">{protocol.protocolo}</p>
          <p className="text-sm text-slate-500">
            Cantidad: <span className="font-semibold text-slate-700">{protocol.total?.toLocaleString('es-ES') || '0'}</span>
          </p>
          <p className="text-sm text-slate-500">
            Porcentaje: <span className="font-semibold text-slate-700">{protocol.porcentaje_global || 0}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-bold text-slate-900">Distribución de Protocolos</h2>
        <p className="text-xs text-slate-500">Comparativa de tráfico por tipo de protocolo</p>
      </div>
      
      <div className="flex-1 min-h-0" style={{ minHeight: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onClick={(state) => {
              if (!onBarClick) return;
              if (state && state.activePayload && state.activePayload.length > 0) {
                onBarClick(state.activePayload[0].payload);
              } else if (state && state.activeTooltipIndex !== undefined && state.activeTooltipIndex !== -1) {
                onBarClick(data[state.activeTooltipIndex]);
              }
            }}
            style={onBarClick ? { cursor: 'pointer' } : {}}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="protocolo" 
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
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 8 }} 
            />
            <Bar 
              dataKey="total" 
              radius={[6, 6, 0, 0]} 
              barSize={50}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || COLOR_MAP[entry.protocolo] || COLOR_MAP.DEFAULT} 
                />
              ))}
              <LabelList 
                dataKey="porcentaje_global" 
                position="top" 
                formatter={(val: number) => `${val}%`}
                style={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
