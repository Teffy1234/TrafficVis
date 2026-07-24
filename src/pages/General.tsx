import React, { useState, useEffect, useMemo } from 'react';
import ProtocolCard from '../components/dashboard/ProtocolCard';
import ProtocolChart from '../components/charts/ProtocolChart';
import { getDistribucionProtocolos } from '../services/apiService';
import { ProtocolData } from '../types';

interface GeneralProps {
  onProtocolClick: (protocol: ProtocolData) => void;
}

export default function General({ onProtocolClick }: GeneralProps) {
  const [protocolos, setProtocolos] = useState<ProtocolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTinyScreen, setIsTinyScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsTinyScreen(window.innerWidth < 400);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getDistribucionProtocolos();
        console.log('📊 Datos obtenidos de la API:', data);
        setProtocolos(data || []);
      } catch (error) {
        console.error("Error fetching protocols:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const topProtocols = useMemo(() => {
    return [...protocolos]
      .sort((a, b) => (b.total || 0) - (a.total || 0))
      .slice(0, 4);
  }, [protocolos]);

  const orderedProtocols = useMemo(() => {
    return [...protocolos].sort((a, b) => (b.total || 0) - (a.total || 0));
  }, [protocolos]);

  console.log('📊 orderedProtocols (antes de renderizar):', orderedProtocols);

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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Panel General</h1>
        <p className="text-slate-500 text-sm md:text-base mt-1">Resumen global del tráfico de red y protocolos detectados.</p>
      </header>

      {/* Top Cards Section */}
      <section className="shrink-0 lg:flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {isTinyScreen ? 'Todos los Protocolos' : 'Protocolos Principales'}
          </h2>
        </div>
        <div className={isTinyScreen ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:flex-1"}>
          {(isTinyScreen ? orderedProtocols : topProtocols).map((protocol) => (
            <ProtocolCard 
              key={protocol.id} 
              protocol={protocol} 
              onClick={onProtocolClick}
            />
          ))}
        </div>
      </section>

      {/* Chart Section */}
      {!isTinyScreen && (
        <section className="lg:flex-[0.65] min-h-[400px] lg:min-h-0">
          <ProtocolChart 
            data={orderedProtocols} 
            onBarClick={onProtocolClick}
          />
        </section>
      )}

      {/* Footer */}
      <footer className="shrink-0 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        <p>© 2026 TrafficVis - Sistema de Monitoreo de Red Profesional</p>
      </footer>
    </div>
  );
}
