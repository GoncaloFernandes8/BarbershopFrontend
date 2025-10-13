import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';







export type ServiceDto = {
  id: number; name: string; durationMin: number; bufferAfterMin: number;
  priceCents: number; active: boolean;
};


export type AppointmentDto = {
  id: string;                  // 👈 UUID
  barberId: number;
  serviceId: number;
  clientId: number;
  startsAt: string;            // ISO (Z ou +offset)
  endsAt?: string;
  status?: string;
  notes?: string | null;
};
export type BarberDto = {
  id: number; name: string; active: boolean; createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private API = 'https://due-constancia-goncalo-6b7726ec.koyeb.app';

  // 👇 NOVO: buscar appointment por id
  getAppointmentById(id: string) {
    return this.http.get<AppointmentDto>(`${this.API}/appointments/${id}`);
  }

  // 👇 (existe no teu backend) obter serviço por id
  getServiceById(id: number) {
    return this.http.get<ServiceDto>(`${this.API}/services/${id}`);
  }

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.API}/services`);
  }

  // 👇 não sei se tens GET /barbers/{id}; seguro: carrega todos e encontra localmente
  getBarberById(id: number) {
    return this.getBarbers().pipe(
      map(list => list.find(b => b.id === id)!)
    );
  }
  
  getBarbers(): Observable<BarberDto[]> {
    return this.http.get<BarberDto[]>(`${this.API}/barbers`);
  }
  getAvailability(barberId: number, serviceId: number, ymd: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API}/availability`, { params: { barberId, serviceId, date: ymd } });
  }
 createAppointment(payload: {
    barberId: number; serviceId: number; clientId: number; startsAt: string; notes?: string;
  }): Observable<string> {
    return this.http.post<AppointmentDto>(`${this.API}/appointments`, payload, { observe: 'response' })
      .pipe(
        map(res => {
          // 1) id no corpo (UUID)
          const bodyId = res.body?.id;
          if (typeof bodyId === 'string' && bodyId.length) return bodyId;

          // 2) tentar no Location
          const loc = res.headers.get('Location') || res.headers.get('location');
          if (loc) {
            try {
              const url = new URL(loc, this.API);
              const last = url.pathname.split('/').filter(Boolean).pop();
              if (last) return last; // pode ser UUID
            } catch {}
            const m = loc.match(/\/([^\/\?]+)(?:\?.*)?$/);
            if (m) return m[1];
          }

          throw new Error('O servidor não devolveu o ID da marcação.');
        })
      );
  }
}
