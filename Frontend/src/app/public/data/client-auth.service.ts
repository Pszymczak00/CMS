import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../dashboard/data/auth.service';
import { API_URL } from '../../../config';

export type ClientRegisterDto = {
  email: string;
  password: string;
  name: string;
  surname: string;
  city: string;
  address: string;
}

export type ClientLoginDto = {
  email: string;
  password: string;
}

export type ClientProfile = {
  id: number;
  email: string;
  name: string;
  surname: string;
  city: string;
  address: string;
}

export type ClientOrderDay = {
  id: number;
  date: string;
  rating: number | null;
  comment: string | null;
}

export type ClientOrder = {
  id: number;
  cateringName: string;
  kcal: number;
  price: number;
  orderDays: ClientOrderDay[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientAuthService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  register(dto: ClientRegisterDto) {
    return this.http.post<{ token: string }>(`${API_URL}/api/Clients/register`, dto);
  }

  login(dto: ClientLoginDto) {
    return this.http.post<{ token: string }>(`${API_URL}/api/Clients/login`, dto);
  }

  getProfile() {
    return this.http.get<ClientProfile>(`${API_URL}/api/Clients/me`);
  }

  getOrders() {
    return this.http.get<ClientOrder[]>(`${API_URL}/api/Clients/orders`);
  }

  rateOrderDay(orderDayId: number, rating: number, comment: string | null) {
    return this.http.post(`${API_URL}/api/Clients/orders/rate`, {
      orderDayId,
      rating,
      comment: comment || null
    });
  }

  addOrderDay(orderId: number, date: string) {
    return this.http.post(`${API_URL}/api/Clients/orders/days/add`, {
      orderId,
      date
    });
  }

  removeOrderDay(orderId: number, date: string) {
    return this.http.post(`${API_URL}/api/Clients/orders/days/remove`, {
      orderId,
      date
    });
  }

  logout() {
    this.authService.clearClientToken();
  }

  isAuthenticated(): boolean {
    return this.authService.isClientAuthenticated();
  }
}

