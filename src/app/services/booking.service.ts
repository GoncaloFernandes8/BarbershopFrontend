import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';
import { SERVICE_TYPES } from '../models/service-type.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private STORAGE_KEY = 'bb_bookings_v1';

  getAll(): Booking[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) as Booking[] : [];
  }

  getById(id: string): Booking | undefined {
    return this.getAll().find(b => b.id === id);
  }

  add(b: Omit<Booking, 'id' | 'createdAt' | 'serviceName' | 'price'>): Booking {
    const service = SERVICE_TYPES.find(s => s.id === b.serviceId)!;
    const booking: Booking = {
      ...b,
      serviceName: service.name,
      price: service.price,
      id: (globalThis.crypto && 'randomUUID' in globalThis.crypto) ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    const all = this.getAll();
    all.push(booking);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    return booking;
  }

  delete(id: string): void {
    const all = this.getAll().filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  }

  /** 09:00–19:00 (última marcação às 18:30). Domingo fechado. */
  getDailySlots(dateStr: string): string[] {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDay(); // 0=Domingo
    if (day === 0) return [];
    const slots: string[] = [];
    const startMinutes = 9 * 60;
    const endMinutes = 19 * 60;
    for (let m = startMinutes; m <= endMinutes - 30; m += 30) {
      const hh = String(Math.floor(m/60)).padStart(2,'0');
      const mm = String(m % 60).padStart(2,'0');
      slots.push(`${hh}:${mm}`);
    }
    // Se for hoje, remove horas já passadas
    const today = new Date();
    const ymd = today.toISOString().slice(0,10);
    if (dateStr === ymd) {
      const nowMins = today.getHours()*60 + today.getMinutes();
      return slots.filter(t => {
        const [h,mi] = t.split(':').map(Number);
        const mins = h*60 + mi;
        return mins > nowMins;
      });
    }
    return slots;
  }

  /** devolve as horas livres (exclui as já ocupadas) */
  getAvailableSlots(dateStr: string): string[] {
    const taken = new Set(this.getAll().filter(b => b.date === dateStr).map(b => b.time));
    return this.getDailySlots(dateStr).filter(t => !taken.has(t));
  }

  /** verifica se um slot está livre */
  isSlotAvailable(dateStr: string, time: string): boolean {
    return this.getAvailableSlots(dateStr).includes(time);
  }
}
