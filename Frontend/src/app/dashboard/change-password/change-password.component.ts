import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../data/auth.service';
import { FormsModule } from '@angular/forms';
import { API_URL } from '../../../config';


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  password = '';
  loginError = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    this.http.post<any>(`${API_URL}/api/Auth/ChangePassword`, {
      password: this.password
    }).subscribe(
      response => {
        console.log('Zmieniono hasło pomyślnie!');
        this.loginError = 'Zmieniono hasło';
      },
      error => {
        console.error('Błąd logowania:', error);
        this.loginError = 'Błąd przy zmianie hasła';
      }
    );
  }
}
