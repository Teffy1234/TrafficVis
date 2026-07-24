/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Menu, X as CloseIcon, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import ProtocolCard from './components/dashboard/ProtocolCard';
/**import ProtocolChart from './components/charts/ProtocolChart';
*/
import ProtocolModal from './components/modals/ProtocolModal';
import LecturasSection from './components/panels/LecturasSection';
import PCsSection from './components/panels/PCsSection';
import LecturasPCSSection from './components/panels/LecturasPCSSection';
import Individual from './sections/Individual/Individual';
import Login from './components/auth/Login';
import { getProtocolos } from './services/protocolosService';
import { getProtocolColor } from './constants';
import { ProtocolData, Section } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('General');
  const [selectedPC, setSelectedPC] = useState<string>('PC1');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [protocolos, setProtocolos] = useState<ProtocolData[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const data = await getProtocolos();
        setProtocolos(data);
      } catch (error) {
        console.error("Error fetching protocols:", error);
      }
    };

    fetchData();
  }, [user]);

  const isTinyScreen = windowWidth < 400;

  // Get top 4 protocols for cards based on 'total' property
  const topProtocols = useMemo(() => {
    return [...protocolos]
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [protocolos]);

  // All protocols ordered for the chart
  const orderedProtocols = useMemo(() => {
    return [...protocolos].sort((a, b) => b.total - a.total);
  }, [protocolos]);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 lg:ml-64 flex flex-col lg:h-screen overflow-y-auto lg:overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-400 w-6 h-6" />
            <span className="font-bold tracking-tight">TrafficVis</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {activeSection === 'General' ? (
          <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <header className="shrink-0 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Panel General</h1>
                <p className="text-slate-500 text-sm md:text-base mt-1">Resumen del tráfico de red y distribución de protocolos.</p>
              </div>
            </header>

            {/* Top Cards Section */}
            <section className="lg:flex-[0.35] shrink-0 flex flex-col min-h-fit">
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
                    onClick={setSelectedProtocol}
                  />
                ))}
              </div>
            </section>

            {/* Chart Section */}
            {!isTinyScreen && (
              <section className="lg:flex-[0.65] min-h-[400px] lg:min-h-0">
                <ProtocolChart 
                  data={orderedProtocols} 
                  onBarClick={setSelectedProtocol}
                />
              </section>
            )}

            {/* Footer */}
            <footer className="shrink-0 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest">
              <p>© 2026 TrafficVis - Sistema de Monitoreo de Red Profesional</p>
            </footer>
          </div>
        ) : activeSection === 'Lecturas' ? (
          <LecturasSection 
            onNavigateToPCS={(pc) => {
              setSelectedPC(pc);
              setActiveSection('PCS');
            }} 
          />
        ) : activeSection === 'PCS' ? (
          <PCsSection 
            selectedPC={selectedPC} 
            onPCChange={setSelectedPC} 
            onProtocolClick={setSelectedProtocol}
          />
        ) : activeSection === 'Lecturas PCS' ? (
          <LecturasPCSSection />
        ) : activeSection === 'Individual' ? (
          <Individual />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-2xl font-bold">!</span>
            </div>
            <p className="text-lg font-medium">La sección "{activeSection}" está en desarrollo.</p>
            <button 
              onClick={() => setActiveSection('General')}
              className="text-blue-500 font-bold hover:underline"
            >
              Volver al Panel General
            </button>
          </div>
        )}
      </main>

      <ProtocolModal 
        protocol={selectedProtocol} 
        onClose={() => setSelectedProtocol(null)} 
        selectedPC={activeSection === 'PCS' ? selectedPC : undefined}
      />
    </div>
  );
}
