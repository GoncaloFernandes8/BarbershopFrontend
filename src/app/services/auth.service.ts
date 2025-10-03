import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, map, delay } from 'rxjs/operators';


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
  private API = 'https://localhost:8080'; // substitui pelo teu backend

  /** BACKEND A EXISTIR: POST /auth/login
   *  Por agora fica um stub local só para poderes testar o UI. */
  login(data: LoginPayload): Observable<LoginResponse> {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      const user = JSON.parse(saved) as AuthUser;
      return of({ token: 'dev-token', user }).pipe(delay(300));
    }
    return throwError(() => ({ error: { message: 'Sem conta guardada. Faz registo primeiro.' } }));
  }

  /** Usa o que existe no teu backend: POST /clients { name, phone } */
  register(data: RegisterPayload): Observable<RegisterResponse> {
    const payload = { name: data.name, phone: data.phone }; // o teu Java só pede isto
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
