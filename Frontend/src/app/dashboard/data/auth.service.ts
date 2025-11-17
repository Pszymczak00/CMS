import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private clientTokenKey = 'clientToken';

  // Admin methods
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Client methods
  saveClientToken(token: string): void {
    localStorage.setItem(this.clientTokenKey, token);
  }

  getClientToken(): string | null {
    return localStorage.getItem(this.clientTokenKey);
  }

  clearClientToken(): void {
    localStorage.removeItem(this.clientTokenKey);
  }

  isClientAuthenticated(): boolean {
    return !!this.getClientToken();
  }
}
