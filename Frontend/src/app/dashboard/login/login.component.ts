import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../data/auth.service';
import { FormsModule } from '@angular/forms';
import { API_URL } from '../../../config';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    this.http.post<{ token: string }>(`${API_URL}/api/auth/login`, {
      username: this.username,
      password: this.password
    }).subscribe(
      response => {
        this.authService.saveToken(response.token);
        console.log('Zalogowano pomyślnie!');
        this.loginError = '';
      },
      error => {
        console.error('Błąd logowania:', error);
        this.loginError = 'Nieprawidłowa nazwa użytkownika lub hasło.';
      }
    );
  }
}
