import React from 'react';
import { motion } from 'motion/react';
import { ProtocolData } from '../../types';
import { cn } from '../../lib/utils';

interface ProtocolCardProps {
  protocol: ProtocolData;
  onClick?: (protocol: ProtocolData) => void;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol, onClick }) => {
  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={() => onClick?.(protocol)}
      className={cn(
        "bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all h-full flex flex-col justify-between",
        onClick ? "hover:shadow-md cursor-pointer group" : ""
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {protocol.protocolo}
          </h3>
          <p className="text-xl font-black text-slate-900 leading-tight">
            {protocol.total.toLocaleString('es-ES')}
          </p>
        </div>
        <div 
          className="px-2 py-0.5 rounded-md text-[10px] font-black"
          style={{ backgroundColor: `${protocol.color}15`, color: protocol.color }}
        >
          {protocol.porcentaje_global}%
        </div>
      </div>
      
      <div className="mt-2">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${protocol.porcentaje_global}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: protocol.color }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProtocolCard;
