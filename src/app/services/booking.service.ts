import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, Observable, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { CacheService } from './cache.service';







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

export type WorkingHoursDto = {
  id: number;
  barberId: number;
  dayOfWeek: number; // 1=Monday ... 7=Sunday
  startTime: string;
  endTime: string;
};

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private cache = inject(CacheService);
  private API = environment.apiUrl;

  // Cache keys
  private readonly SERVICES_CACHE_KEY = 'services';
  private readonly BARBERS_CACHE_KEY = 'barbers';
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutos

  // 👇 NOVO: buscar appointment por id
  getAppointmentById(id: string): Observable<AppointmentDto> {
    return this.http.get<AppointmentDto>(`${this.API}/appointments/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }

  // 👇 (existe no teu backend) obter serviço por id
  getServiceById(id: number): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.API}/services/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }

  getServices(): Observable<ServiceDto[]> {
    return this.cache.getOrSet(
      this.SERVICES_CACHE_KEY,
      () => this.http.get<ServiceDto[]>(`${this.API}/services`).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      ),
      this.CACHE_TTL
    );
  }

  // 👇 não sei se tens GET /barbers/{id}; seguro: carrega todos e encontra localmente
  getBarberById(id: number): Observable<BarberDto> {
    return this.getBarbers().pipe(
      map(list => list.find(b => b.id === id)!)
    );
  }
  
  getBarbers(): Observable<BarberDto[]> {
    return this.cache.getOrSet(
      this.BARBERS_CACHE_KEY,
      () => this.http.get<BarberDto[]>(`${this.API}/barbers`).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
      ),
      this.CACHE_TTL
    );
  }
  
  getAvailability(barberId: number, serviceId: number, ymd: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API}/availability`, { params: { barberId, serviceId, date: ymd } }).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }

  getBarberWorkingHours(barberId: number): Observable<WorkingHoursDto[]> {
    return this.http.get<WorkingHoursDto[]>(`${this.API}/working-hours`, { params: { barberId } }).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }
 createAppointment(payload: {
    barberId: number; serviceId: number; clientId: number; startsAt: string; notes?: string;
  }): Observable<string> {
    return this.http.post<AppointmentDto>(`${this.API}/appointments`, payload, { observe: 'response' })
      .pipe(
        map(res => {
          // 1) id no corpo (UUID)
          const bodyId = res.body?.id;
          if (typeof bodyId === 'string' && bodyId.length) {
            this.errorHandler.showSuccess('Marcação realizada com sucesso!');
            return bodyId;
          }

          // 2) tentar no Location
          const loc = res.headers.get('Location') || res.headers.get('location');
          if (loc) {
            try {
              const url = new URL(loc, this.API);
              const last = url.pathname.split('/').filter(Boolean).pop();
              if (last) {
                this.errorHandler.showSuccess('Marcação realizada com sucesso!');
                return last; // pode ser UUID
              }
            } catch {}
            const m = loc.match(/\/([^\/\?]+)(?:\?.*)?$/);
            if (m) {
              this.errorHandler.showSuccess('Marcação realizada com sucesso!');
              return m[1];
            }
          }

          throw new Error('O servidor não devolveu o ID da marcação.');
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorHandler.showError('Erro ao criar marcação. Tente novamente.');
          return this.errorHandler.handleError(error);
        })
      );
  }

  // Métodos para gerenciar cache
  invalidateServicesCache(): void {
    this.cache.delete(this.SERVICES_CACHE_KEY);
  }

  invalidateBarbersCache(): void {
    this.cache.delete(this.BARBERS_CACHE_KEY);
  }

  invalidateAllCache(): void {
    this.cache.clear();
  }

  // Método para forçar refresh dos dados
  refreshServices(): Observable<ServiceDto[]> {
    this.invalidateServicesCache();
    return this.getServices();
  }

  refreshBarbers(): Observable<BarberDto[]> {
    this.invalidateBarbersCache();
    return this.getBarbers();
  }

  // Buscar histórico de marcações do usuário logado
  getUserAppointments(): Observable<AppointmentDto[]> {
    const token = localStorage.getItem('token');
    console.log('Token sendo enviado:', token ? 'Presente' : 'Ausente');
    console.log('Token completo:', token);
    console.log('User no localStorage:', localStorage.getItem('user'));
    
    return this.http.get<AppointmentDto[]>(`${this.API}/appointments/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Erro na requisição getUserAppointments:', error.status, error.message);
        return this.errorHandler.handleError(error);
      })
    );
  }
}
