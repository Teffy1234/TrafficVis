import { useState } from 'react';
import { LayoutDashboard, Activity, X, Monitor, FileText, LogOut, ChevronUp, ChevronDown } from 'lucide-react';
import { Section } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen?: boolean;
  onClose?: () => void;
  user: User | null;
  onLogout: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose, user, onLogout }: SidebarProps) {
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    { id: 'General', icon: LayoutDashboard, label: 'General' },
    { id: 'Lecturas', icon: Activity, label: 'Lecturas' },
    { id: 'PCS', icon: Monitor, label: 'PCS' },
    { id: 'Lecturas PCS', icon: Activity, label: 'Lecturas PCS' },
    { id: 'Individual', icon: FileText, label: 'Individual' },
  ] as const;

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  const sidebarContent = (
    <aside className={cn(
      "h-screen w-64 bg-slate-900 text-white flex flex-col z-50",
      "lg:fixed lg:left-0 lg:top-0",
      !isOpen && "hidden lg:flex"
    )}>
      <div className="p-8 border-b border-slate-800 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="text-blue-400" />
          TrafficVis
        </h1>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              activeSection === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeSection === item.id ? "text-white" : "text-slate-500 group-hover:text-blue-400"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 relative">
        <AnimatePresence>
          {showLogout && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
            >
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold">Cerrar Sesión</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowLogout(!showLogout)}
          className={cn(
            "w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
            showLogout ? "bg-slate-800" : "hover:bg-slate-800"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium truncate">Usuario</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          {showLogout ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
