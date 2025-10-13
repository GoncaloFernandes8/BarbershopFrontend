import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

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

export type LoginResponse = { token: string; user: AuthUser };
export type RegisterResponse = { user: AuthUser; requiresEmailVerification?: boolean };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private API = 'https://due-constancia-goncalo-6b7726ec.koyeb.app';

  // LOGIN normal (mantém)
  login(data: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/auth/login`, data).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
      })
    );
  }

  register(data: RegisterPayload) {
  return this.http.post<RegisterApiResponse>(`${this.API}/auth/register`, data);
}

  verifyEmail(token: string) {
  return this.http.post<{ verified: boolean; userId?: number; message?: string }>(
    `${this.API}/auth/verify`, { token }
  );
}

  // REENVIAR EMAIL DE VERIFICAÇÃO (botão no login/registo)
  resendVerification(email: string) {
    return this.http.post<void>(`${this.API}/auth/verify/resend`, { email });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  get user(): AuthUser | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  get isApproved(): boolean {
    const u = this.user;
    return !!u && (u.status ?? 'APPROVED') === 'APPROVED';
  }
}
