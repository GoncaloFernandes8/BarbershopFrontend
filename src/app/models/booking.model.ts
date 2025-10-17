export interface Booking {
  id: string;
  barberId: number;
  serviceId: number;
  clientId: number;
  startsAt: string; // ISO datetime
  endsAt?: string; // ISO datetime
  status?: string;
  notes?: string | null;
  createdAt?: string; // ISO
}
