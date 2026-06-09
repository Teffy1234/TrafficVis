import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Monitor, ChevronDown } from 'lucide-react';
import { ProtocolData, Section } from '../../types';
import ProtocolCard from '../dashboard/ProtocolCard';
import ProtocolChart from '../charts/ProtocolChart';
import { getProtocolColor } from '../../constants';
import { cn } from '../../lib/utils';
import { getPCsData } from '../../services/pcsService';

const AVAILABLE_PCS = ['PC1', 'PC2', 'PC3'];

interface PCsSectionProps {
  selectedPC: string;
  onPCChange: (pc: string) => void;
  onProtocolClick?: (protocol: ProtocolData) => void;
}

export default function PCsSection({ selectedPC, onPCChange, onProtocolClick }: PCsSectionProps) {
  const [data, setData] = useState<ProtocolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const jsonData = await getPCsData(selectedPC);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching PC data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPC]);

  // Filtrar y formatear datos para la PC seleccionada
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: any) => {
      return {
        protocolo: item.protocolo,
        total: item.cantidad,
        porcentaje_global: Math.round(item.porcentaje * 100) / 100,
        color: getProtocolColor(item.protocolo),
        id: item.protocolo,
        pcs: [] // Satisfacer la interfaz ProtocolData aunque no se use aquí
      } as ProtocolData;
    });
  }, [data]);

  // Calcular los 4 protocolos con mayor valor en 'total'
  const topProtocols = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [filteredData]);

  // Todos los protocolos ordenados para la gráfica
  const orderedProtocols = useMemo(() => {
    return [...filteredData].sort((a, b) => b.total - a.total);
  }, [filteredData]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <header className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Estadísticas por PC</h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">Análisis detallado de protocolos para una estación específica.</p>
        </div>

        {/* PC Selector */}
        <div className="relative inline-block">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
            <Monitor className="w-4 h-4 text-blue-500" />
            <select 
              value={selectedPC}
              onChange={(e) => onPCChange(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 cursor-pointer appearance-none pr-8"
            >
              {AVAILABLE_PCS.map(pc => (
                <option key={pc} value={pc}>{pc}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Top Cards Section */}
      <section className="shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Protocolos Principales - {selectedPC}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProtocols.map((protocol) => (
            <ProtocolCard 
              key={protocol.id} 
              protocol={protocol} 
              onClick={onProtocolClick}
            />
          ))}
          {topProtocols.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              No hay datos disponibles para esta PC.
            </div>
          )}
        </div>
      </section>

      {/* Chart Section */}
      <section className="flex-1 min-h-[400px]">
        <ProtocolChart 
          data={orderedProtocols} 
          onBarClick={onProtocolClick}
        />
      </section>

      {/* Footer */}
      <footer className="shrink-0 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        <p>© 2026 TrafficVis - Sistema de Monitoreo de Red Profesional</p>
      </footer>
    </div>
  );
}
