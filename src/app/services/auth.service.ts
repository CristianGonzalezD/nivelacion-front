import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthSession } from '../interfaces/auth/auth-session.interface';
import { LoginRequest } from '../interfaces/auth/login-request.interface';
import { LoginResponseBody } from '../interfaces/auth/login-response-body.interface';

const TOKEN_STORAGE_KEY = 'front-app-auth-token';
const USER_STORAGE_KEY = 'front-app-auth-user';
const TOKEN_TYPE_STORAGE_KEY = 'front-app-auth-token-type';
const USER_ROLE_STORAGE_KEY = 'front-app-auth-role';
const TOKEN_EXPIRES_AT_STORAGE_KEY = 'front-app-auth-expires-at';
const LOGIN_URL = `${environment.apiBaseUrl}${environment.auth.loginPath}`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly currentUser = signal<string | null>(this.readStoredUser());
  readonly authToken = signal<string | null>(this.readStoredToken());
  readonly tokenType = signal<string | null>(this.readStoredTokenType());
  readonly currentRole = signal<string | null>(this.readStoredRole());
  readonly expiresAt = signal<number | null>(this.readStoredExpiresAt());

  login(username: string, password: string): Observable<boolean> {
    const payload: LoginRequest = {
      username: username.trim(),
      password
    };

    return this.http.post<LoginResponseBody>(LOGIN_URL, payload).pipe(
      map((response) => this.normalizeLoginResponse(response)),
      tap((session) => {
        this.currentUser.set(session.username);
        this.authToken.set(session.token);
        this.tokenType.set(session.type);
        this.currentRole.set(session.role);
        this.expiresAt.set(session.expiresAt);
        this.persistSession(session);
      }),
      map(() => true)
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.authToken.set(null);
    this.tokenType.set(null);
    this.currentRole.set(null);
    this.expiresAt.set(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
      window.localStorage.removeItem(USER_ROLE_STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_EXPIRES_AT_STORAGE_KEY);
    }
  }

  hasValidToken(): boolean {
    const token = this.authToken();
    const expiresAt = this.expiresAt();

    if (!token) {
      return false;
    }

    if (!expiresAt) {
      return true;
    }

    const isValid = Date.now() < expiresAt;
    if (!isValid) {
      this.logout();
    }

    return isValid;
  }

  private normalizeLoginResponse(response: LoginResponseBody): AuthSession {
    if (!response.token?.trim()) {
      throw new Error('El backend no devolvio un token valido.');
    }

    if (!response.username?.trim()) {
      throw new Error('El backend no devolvio un username valido.');
    }

    return {
      token: response.token.trim(),
      type: response.type?.trim() || 'Bearer',
      username: response.username.trim(),
      role: response.role?.trim() || 'USER',
      expiresAt: this.resolveExpiresAt(response.expiresIn)
    };
  }

  private readStoredUser(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(USER_STORAGE_KEY);
  }

  private readStoredToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private readStoredTokenType(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(TOKEN_TYPE_STORAGE_KEY);
  }

  private readStoredRole(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(USER_ROLE_STORAGE_KEY);
  }

  private readStoredExpiresAt(): number | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawValue = window.localStorage.getItem(TOKEN_EXPIRES_AT_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = Number(rawValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  private persistSession(session: AuthSession): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_STORAGE_KEY, session.username);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
      window.localStorage.setItem(TOKEN_TYPE_STORAGE_KEY, session.type);
      window.localStorage.setItem(USER_ROLE_STORAGE_KEY, session.role);

      if (session.expiresAt) {
        window.localStorage.setItem(TOKEN_EXPIRES_AT_STORAGE_KEY, String(session.expiresAt));
      } else {
        window.localStorage.removeItem(TOKEN_EXPIRES_AT_STORAGE_KEY);
      }
    }
  }

  private resolveExpiresAt(expiresIn: number | null | undefined): number | null {
    if (typeof expiresIn !== 'number' || !Number.isFinite(expiresIn) || expiresIn <= 0) {
      return null;
    }

    return Date.now() + expiresIn * 1000;
  }
}
