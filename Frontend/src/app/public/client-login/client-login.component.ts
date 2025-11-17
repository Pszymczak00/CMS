import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientAuthService } from '../data/client-auth.service';
import { AuthService } from '../../dashboard/data/auth.service';
import { ClientRegisterComponent } from '../client-register/client-register.component';

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [FormsModule, ClientRegisterComponent],
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent {
  private clientAuthService = inject(ClientAuthService);
  private authService = inject(AuthService);

  email = '';
  password = '';
  loginError = '';
  showRegister = false;
  loggedIn = false;

  onSubmit(event: Event): void {
    event.preventDefault();
    this.loginError = '';

    this.clientAuthService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.authService.saveClientToken(response.token);
        this.loginError = '';
        this.showRegister = false;
        this.loggedIn = true;
        // Trigger window reload to update UI
        setTimeout(() => window.location.reload(), 100);
      },
      error: (error) => {
        console.error('Błąd logowania:', error);
        this.loginError = error.error?.message || 'Nieprawidłowy email lub hasło.';
      }
    });
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.loginError = '';
  }
}

