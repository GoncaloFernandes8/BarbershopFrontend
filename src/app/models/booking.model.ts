export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: string; // ISO
}
