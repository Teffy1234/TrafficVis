// Constants file
export const PROTOCOL_COLORS = {
  DNS: '#3b82f6',
  FTP: '#10b981',
  HTTP: '#f59e0b',
  HTTPS: '#6366f1',
  ICMP: '#ef4444',
  SMTP: '#14b8a6',
  TCP: '#8b5cf6',
  UDP: '#f97316',
  DEFAULT: '#0f172a' // Color base para "Total del día"
};

export const getProtocolColor = (protocol: string | null): string => {
  if (!protocol) return PROTOCOL_COLORS.DEFAULT;
  return (PROTOCOL_COLORS as any)[protocol] || PROTOCOL_COLORS.DEFAULT;
};
