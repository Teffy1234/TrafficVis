import { getLecturasHoras, getLecturasGeneral } from "./apiService";

export async function getLecturasPorHoras() {
  return getLecturasHoras();
}

export async function getLecturas() {
  return getLecturasGeneral();
}
