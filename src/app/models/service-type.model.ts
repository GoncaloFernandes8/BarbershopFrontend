export interface ServiceType {
  id: number;
  name: string;
  durationMin: number;
  bufferAfterMin: number;
  priceCents: number;
  active: boolean;
}

// Mantém os tipos estáticos para fallback/desenvolvimento
export const SERVICE_TYPES_STATIC: ServiceType[] = [
  { id: 1, name: 'Corte de Cabelo', durationMin: 30, bufferAfterMin: 0, priceCents: 1200, active: true },
  { id: 2, name: 'Barba', durationMin: 30, bufferAfterMin: 0, priceCents: 800, active: true },
  { id: 3, name: 'Corte + Barba', durationMin: 60, bufferAfterMin: 0, priceCents: 1800, active: true },
  { id: 4, name: 'Corte Criança', durationMin: 30, bufferAfterMin: 0, priceCents: 1000, active: true },
];
