export interface ServiceType {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}

export const SERVICE_TYPES: ServiceType[] = [
  { id: 'corte', name: 'Corte de Cabelo', durationMinutes: 30, price: 12, description: 'Clássico, fade ou à máquina.' },
  { id: 'barba', name: 'Barba', durationMinutes: 30, price: 8, description: 'Acerto e contornos.' },
  { id: 'corte-barba', name: 'Corte + Barba', durationMinutes: 60, price: 18, description: 'Pacote completo.' },
  { id: 'crianca', name: 'Corte Criança', durationMinutes: 30, price: 10, description: 'Até 12 anos.' },
];
