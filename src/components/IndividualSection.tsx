import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { FileText, Filter, ArrowUp, ArrowDown, Search, Monitor, ExternalLink } from 'lucide-react';
import { getArchivos } from '../services/archivosService';
import IndividualFileModal from './IndividualFileModal';

type Order = 'asc' | 'desc';

export default function IndividualSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPC, setSelectedPC] = useState<string>('');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('Todos');
  const [order, setOrder] = useState<Order>('desc');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<{pc: string, filename: string} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getArchivos();
        setData(result);
        const pcs = Object.keys(result);
        if (pcs.length > 0) {
          setSelectedPC(pcs[0]);
        }
      } catch (error) {
        console.error("Error fetching archivos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pcs = useMemo(() => (data ? Object.keys(data) : []), [data]);
  
  const protocols = useMemo(() => {
    if (!data || !selectedPC) return [];
    const firstFile = Object.values(data[selectedPC].archivos)[0] as any;
    return Object.keys(firstFile);
  }, [data, selectedPC]);

  const filteredData = useMemo(() => {
    if (!data || !selectedPC) return [];

    const archivos = data[selectedPC].archivos;
    const result = Object.entries(archivos).map(([filename, metrics]: [string, any]) => {
      let value = 0;
      if (selectedProtocol === 'Todos') {
        value = Object.values(metrics).reduce((acc: number, curr: any) => acc + curr, 0) as number;
      } else {
        value = metrics[selectedProtocol] || 0;
      }
      return { filename, value, metrics };
    });

    return result.sort((a, b) => {
      return order === 'desc' ? b.value - a.value : a.value - b.value;
    });
  }, [data, selectedPC, selectedProtocol, order]);

  const handleOpenModal = (filename: string) => {
    setActiveFile({ pc: selectedPC, filename });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 animate-pulse font-medium">Cargando datos individuales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <header className="shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Análisis Individual</h1>
        <p className="text-slate-500 text-sm md:text-base mt-1">Explora métricas detalladas por archivo y PC.</p>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Monitor className="w-3 h-3" /> Seleccionar PC
          </label>
          <select 
            value={selectedPC}
            onChange={(e) => setSelectedPC(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            {pcs.map(pc => (
              <option key={pc} value={pc}>{pc}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Filter className="w-3 h-3" /> Protocolo
          </label>
          <select 
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="Todos">Todos</option>
            {protocols.map(proto => (
              <option key={proto} value={proto}>{proto}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Search className="w-3 h-3" /> Ordenar por Cantidad
          </label>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setOrder('desc')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-medium transition-all ${order === 'desc' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowDown className="w-4 h-4" /> Mayor
            </button>
            <button 
              onClick={() => setOrder('asc')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-medium transition-all ${order === 'asc' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowUp className="w-4 h-4" /> Menor
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Archivo CSV</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {selectedProtocol === 'Todos' ? 'Total Paquetes' : `Paquetes ${selectedProtocol}`}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Detalle</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.filename} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-slate-700">{item.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600">{val?.toLocaleString() || '0'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.metrics).map(([proto, val]: [string, any]) => (
                        <div key={proto} className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{proto}</span>
                          <span className="text-xs font-medium text-slate-600">{val?.toLocaleString() || '0'}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenModal(item.filename)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                    >
                      Ver más <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-400 font-medium">No se encontraron archivos para esta selección.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {activeFile && (
        <IndividualFileModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pc={activeFile.pc}
          filename={activeFile.filename}
          initialProtocol={selectedProtocol === 'Todos' ? 'HTTP' : selectedProtocol}
          availableProtocols={protocols}
        />
      )}

      <footer className="shrink-0 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        <p>© 2026 Gestionproto - Análisis Individual de Archivos</p>
      </footer>
    </div>
  );
}
