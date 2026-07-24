import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import ProtocolCard from '../dashboard/ProtocolCard';
import { getPCData } from '../../services/pcsService';
import { ProtocolData } from '../../types';

interface PCsSectionProps {
  selectedPC: string;
  onPCChange: (pc: string) => void;
  onProtocolClick: (protocol: ProtocolData) => void;
}

export default function PCsSection({ selectedPC, onPCChange, onProtocolClick }: PCsSectionProps) {
  const [protocolos, setProtocolos] = useState<ProtocolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'total' | 'porcentaje_global'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getPCData(selectedPC);
        setProtocolos(data || []);
      } catch (error) {
        console.error("Error fetching PC data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedPC]);

  const filteredProtocols = useMemo(() => {
    let filtered = [...protocolos];
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.protocolo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return filtered;
  }, [protocolos, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <header className="shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Análisis por PC</h1>
        <p className="text-slate-500 text-sm md:text-base mt-1">
          Visualización detallada del tráfico generado por {selectedPC}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar protocolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-900 flex-1"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          Ordenar por {sortBy === 'total' ? 'Cantidad' : 'Porcentaje'}
        </button>
      </div>

      <section className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProtocols.map((protocol) => (
            <ProtocolCard
              key={protocol.id}
              protocol={protocol}
              onClick={onProtocolClick}
            />
          ))}
        </div>
        {filteredProtocols.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No se encontraron protocolos para {selectedPC}
          </div>
        )}
      </section>

      <footer className="shrink-0 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        <p>© 2026 TrafficVis - Sistema de Monitoreo de Red Profesional</p>
      </footer>
    </div>
  );
}
