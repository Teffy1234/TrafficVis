import { 
  getPCData, 
  getLecturasPC1, 
  getLecturasPC2, 
  getLecturasPC3, 
  getGeneralProtocolos,
  getPc1General,
  getPc2General,
  getPc3General
} from "./apiService";

export async function getPCsData(pcId: string) {
  const id = pcId.toLowerCase();
  if (id === 'pc1') return getPc1General();
  if (id === 'pc2') return getPc2General();
  if (id === 'pc3') return getPc3General();
  
  // Fallback to general protocols if PC not found
  return getGeneralProtocolos();
}

export async function getPCHourlyData(pcId: string) {
  return getPCData(pcId);
}

export async function getAllPCsHourlyData() {
  const [pc1, pc2, pc3] = await Promise.all([
    getPCData('pc1'),
    getPCData('pc2'),
    getPCData('pc3')
  ]);
  
  return { pc1, pc2, pc3 };
}

export async function getLecturasPCS(pcId: string) {
  const id = pcId.toLowerCase();
  if (id === 'pc1') return getLecturasPC1();
  if (id === 'pc2') return getLecturasPC2();
  if (id === 'pc3') return getLecturasPC3();
  return [];
}
