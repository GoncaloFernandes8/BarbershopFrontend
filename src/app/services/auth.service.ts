import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';


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

  login(data: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/auth/login`, data).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
      })
    );
  }

  register(data: RegisterPayload): Observable<RegisterResponse> {
    const payload = { name: data.name, phone: data.phone, email: data.email, password: data.password };
    return this.http.post<any>(`${this.API}/clients`, payload).pipe(
      map((client: any) => {
        const user: AuthUser = {
          id: String(client?.id ?? client?.clientId ?? ''),
          name: client?.name ?? data.name,
          email: data.email,
          status: 'PENDING'
        };
        return { user, requiresEmailVerification: false };
      }),
      tap(res => localStorage.setItem('auth_user', JSON.stringify(res.user)))
    );
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
