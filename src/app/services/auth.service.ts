import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

export type VerifyEmailResponse = { verified: boolean; message?: string };
export type RegisterApiResponse = { sent: boolean };

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; phone: string; email: string; password: string };

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  status?: 'APPROVED' | 'PENDING';
};

export type LoginResponse = { token: string; refreshToken: string; user: AuthUser };
export type RegisterResponse = { user: AuthUser; requiresEmailVerification?: boolean };
export type RefreshResponse = { token: string; refreshToken: string; user: AuthUser };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private API = environment.apiUrl;

  // LOGIN normal (mantém)
  login(data: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/auth/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.errorHandler.showSuccess('Login realizado com sucesso!');
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.showError('Erro ao fazer login. Verifique suas credenciais.');
        return this.errorHandler.handleError(error);
      })
    );
  }

  register(data: RegisterPayload): Observable<RegisterApiResponse> {
    return this.http.post<RegisterApiResponse>(`${this.API}/auth/register`, data).pipe(
      tap(() => {
        this.errorHandler.showSuccess('Conta criada com sucesso! Verifique seu email.');
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.showError('Erro ao criar conta. Tente novamente.');
        return this.errorHandler.handleError(error);
      })
    );
  }

  verifyEmail(token: string): Observable<{ verified: boolean; userId?: number; message?: string }> {
    return this.http.post<{ verified: boolean; userId?: number; message?: string }>(
      `${this.API}/auth/verify`, { token }
    ).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }

  // REENVIAR EMAIL DE VERIFICAÇÃO (botão no login/registo)
  resendVerification(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/auth/verify/resend`, { email }).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error))
    );
  }

  // REFRESH TOKEN
  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    return this.http.post<RefreshResponse>(`${this.API}/auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));
      }),
      catchError((error: HttpErrorResponse) => {
        // Se o refresh falhar, limpar tokens e redirecionar para login
        this.logout();
        return this.errorHandler.handleError(error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.errorHandler.showInfo('Sessão encerrada com sucesso.');
  }

  get user(): AuthUser | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  get isApproved(): boolean {
    const u = this.user;
    return !!u && (u.status ?? 'APPROVED') === 'APPROVED';
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !!this.user;
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      // Decodificar o JWT para verificar a expiração
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true; // Se não conseguir decodificar, considerar expirado
    }
  }

  // Método para limpar dados de autenticação (usado pelo ErrorHandler)
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}
