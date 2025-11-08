import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { interval, catchError, of } from 'rxjs';

/**
 * Serviço para manter a API acordada (evitar cold starts no Koyeb)
 */
@Injectable({ providedIn: 'root' })
export class KeepAliveService {
  private http = inject(HttpClient);
  private API = environment.apiUrl;
  private pingInterval = 8 * 60 * 1000; // 8 minutos (antes dos 10min de timeout do Koyeb)

  /**
   * Inicia pings automáticos para manter a API ativa
   */
  startKeepAlive() {
    // Ping imediato ao iniciar
    this.pingAPI();

    // Ping a cada 8 minutos
    interval(this.pingInterval).subscribe(() => {
      this.pingAPI();
    });
  }

  private pingAPI() {
    this.http.get(`${this.API}/health`).pipe(
      catchError(() => {
        console.warn('Keep-alive ping falhou, mas não é crítico');
        return of(null);
      })
    ).subscribe(() => {
      console.log('✓ API keep-alive ping enviado');
    });
  }
}

