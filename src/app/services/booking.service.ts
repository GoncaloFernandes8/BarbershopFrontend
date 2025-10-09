import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

const API = 'https://due-constancia-goncalo-6b7726ec.koyeb.app';

export type ServiceDto = {
  id: number; name: string; durationMin: number; bufferAfterMin: number;
  priceCents: number; active: boolean;
};


export type AppointmentDto = {
  id: number;
  barberId: number;
  serviceId: number;
  clientId: number;
  startsAt: string;   // ISO (pode vir com Z)
  endsAt?: string;
  notes?: string;
};
export type BarberDto = {
  id: number; name: string; active: boolean; createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);

  // 👇 NOVO: buscar appointment por id
  getAppointmentById(id: number) {
    return this.http.get<AppointmentDto>(`${API}/appointments/${id}`);
  }


  // 👇 (existe no teu backend) obter serviço por id
  getServiceById(id: number) {
    return this.http.get<ServiceDto>(`${API}/services/${id}`);
  }

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${API}/services`);
  }

  // 👇 não sei se tens GET /barbers/{id}; seguro: carrega todos e encontra localmente
  getBarberById(id: number) {
    return this.getBarbers().pipe(
      map(list => list.find(b => b.id === id)!)
    );
  }
  
  getBarbers(): Observable<BarberDto[]> {
    return this.http.get<BarberDto[]>(`${API}/barbers`);
  }
  getAvailability(barberId: number, serviceId: number, ymd: string): Observable<string[]> {
    return this.http.get<string[]>(`${API}/availability`, { params: { barberId, serviceId, date: ymd } });
  }
  createAppointment(payload: {
    barberId: number; serviceId: number; clientId: number; startsAt: string; notes?: string;
  }): Observable<number> {
    return this.http.post(`${API}/appointments`, payload, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        const id = res.body?.id ?? res.body?.appointmentId;
        if (id) return Number(id);
        const loc = res.headers.get('Location') || res.headers.get('location');
        const m = loc?.match(/\/(\d+)(?:\?.*)?$/);
        return m ? Number(m[1]) : 0;
      })
    );
  }
}
