import { useState, useEffect, useMemo } from 'react';
import { getArchivos, ArchivosData, Protocolo } from '../../services/archivosService';
import { getMetricas } from '../../services/metricasService';
import { Search, Filter, ArrowUpDown, FileText, Database, Loader2 } from 'lucide-react';
import { PROTOCOL_COLORS } from '../../constants';
import FileMetricsModal from './FileMetricsModal';

export default function Individual() {
  const [data, setData] = useState<ArchivosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [selectedPC, setSelectedPC] = useState<string>('');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocolo | 'Todos'>('Todos');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Modal de Métricas
  const [selectedFileForMetrics, setSelectedFileForMetrics] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getArchivos();
        setData(result);
        
        // Estado inicial: primera PC disponible
        const pcs = Object.keys(result);
        if (pcs.length > 0) {
          setSelectedPC(pcs[0]);
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pcs = useMemo(() => (data ? Object.keys(data) : []), [data]);
  const protocolosDisponibles: Protocolo[] = ['DNS', 'FTP', 'HTTP', 'ICMP', 'SMTP', 'TCP', 'UDP'];
  const selectOptions: (Protocolo | 'Todos')[] = ['Todos', ...protocolosDisponibles];

  const filteredFiles = useMemo(() => {
    if (!data || !selectedPC || !data[selectedPC]) return [];

    const archivos = data[selectedPC].archivos;
    const result = Object.entries(archivos).map(([nombre, metricas]) => {
      // Calcular el total para el ordenamiento cuando es "Todos"
      const total = Object.values(metricas).reduce((acc, curr) => acc + (curr || 0), 0);
      
      // Valor que se usará para el ordenamiento
      const valorOrden = selectedProtocol === 'Todos' 
        ? total 
        : (metricas[selectedProtocol as Protocolo] || 0);

      return {
        nombre,
        metricas,
        total,
        valorOrden
      };
    });

    // Ordenar
    return result.sort((a, b) => {
      if (order === 'desc') {
        return b.valorOrden - a.valorOrden;
      } else {
        return a.valorOrden - b.valorOrden;
      }
    });
  }, [data, selectedPC, selectedProtocol, order]);

  const handleFileClick = (fileName: string) => {
    setSelectedFileForMetrics(fileName);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
          <Database className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Error de Conexión</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto relative">
      <header className="shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Análisis Individual</h1>
        <p className="text-slate-500 text-sm md:text-base mt-1">Explora las métricas detalladas por archivo y PC.</p>
      </header>

      {/* Filtros */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selector de PC */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-3 h-3" />
              Seleccionar PC
            </label>
            <select
              value={selectedPC}
              onChange={(e) => setSelectedPC(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              {pcs.map((pc) => (
                <option key={pc} value={pc}>{pc}</option>
              ))}
            </select>
          </div>

          {/* Selector de Protocolo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Protocolo
            </label>
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value as Protocolo | 'Todos')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              {selectOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Selector de Orden */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ArrowUpDown className="w-3 h-3" />
              Orden
            </label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="desc">Mayor cantidad</option>
              <option value="asc">Menor cantidad</option>
            </select>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Archivos de {selectedPC}
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            {filteredFiles.length} archivos encontrados
          </span>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[800px] lg:min-w-full space-y-3 pb-4">
            {/* Header de la "tabla" */}
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              <div className="w-1/4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Archivo
              </div>
              <div className="flex-1 grid grid-cols-7 gap-2 text-center">
                {selectedProtocol === 'Todos' ? (
                  protocolosDisponibles.map(p => (
                    <div key={p} style={{ color: (PROTOCOL_COLORS as any)[p] }}>{p}</div>
                  ))
                ) : (
                  <div className="col-span-7 text-right pr-4" style={{ color: (PROTOCOL_COLORS as any)[selectedProtocol] }}>
                    {selectedProtocol}
                  </div>
                )}
              </div>
            </div>

            {filteredFiles.length > 0 ? (
              filteredFiles.map((item) => (
                <div 
                  key={item.nombre}
                  onClick={() => handleFileClick(item.nombre)}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex items-center hover:border-blue-500/50 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-1/4 flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-slate-900 truncate text-sm" title={item.nombre}>
                      {item.nombre}
                    </h3>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-7 gap-2 items-center">
                    {selectedProtocol === 'Todos' ? (
                      protocolosDisponibles.map(p => {
                        const val = item.metricas[p] || 0;
                        return (
                          <div key={p} className="text-center">
                            <span className="text-sm font-bold text-slate-700">
                              {val.toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-7 text-right pr-4">
                        <span className="text-lg font-bold text-slate-900">
                          {(item.metricas[selectedProtocol as Protocolo] || 0).toLocaleString()}
                        </span>
                        <span className="ml-2 text-[10px] text-slate-400 uppercase tracking-widest">Paquetes</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <FileText className="w-12 h-12 opacity-20" />
                <p className="text-lg font-medium">No se encontraron archivos para esta PC.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="shrink-0 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        <p>© 2026 TrafficVis - Análisis Individual de Tráfico</p>
      </footer>

      {/* Modal de Métricas */}
      {selectedFileForMetrics && (
        <FileMetricsModal
          fileName={selectedFileForMetrics}
          pc={selectedPC}
          onClose={() => {
            setSelectedFileForMetrics(null);
          }}
        />
      )}
    </div>
  );
}
