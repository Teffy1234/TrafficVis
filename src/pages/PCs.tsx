import React from 'react';
import PCsSection from '../components/panels/PCsSection';
import { ProtocolData } from '../types';

interface PCsPageProps {
  selectedPC: string;
  onPCChange: (pc: string) => void;
  onProtocolClick: (protocol: ProtocolData) => void;
}

export default function PCsPage({ selectedPC, onPCChange, onProtocolClick }: PCsPageProps) {
  return (
    <PCsSection 
      selectedPC={selectedPC} 
      onPCChange={onPCChange} 
      onProtocolClick={onProtocolClick}
    />
  );
}
