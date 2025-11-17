import { Component, EventEmitter, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientAuthService } from '../data/client-auth.service';
import { AuthService } from '../../dashboard/data/auth.service';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-register.component.html',
  styleUrls: ['./client-register.component.css']
})
export class ClientRegisterComponent {
  private clientAuthService = inject(ClientAuthService);
  private authService = inject(AuthService);

  registered = output<void>();
  cancel = output<void>();

  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  surname = '';
  city = '';
  address = '';
  registerError = '';

  onSubmit(event: Event): void {
    event.preventDefault();
    this.registerError = '';

    if (this.password !== this.confirmPassword) {
      this.registerError = 'Hasła nie są identyczne.';
      return;
    }

    if (!this.email || !this.password || !this.name || !this.surname || !this.city || !this.address) {
      this.registerError = 'Wszystkie pola są wymagane.';
      return;
    }

    this.clientAuthService.register({
      email: this.email,
      password: this.password,
      name: this.name,
      surname: this.surname,
      city: this.city,
      address: this.address
    }).subscribe({
      next: (response) => {
        this.authService.saveClientToken(response.token);
        this.registerError = '';
        this.registered.emit();
        // Trigger window reload to update UI
        setTimeout(() => window.location.reload(), 100);
      },
      error: (error) => {
        console.error('Błąd rejestracji:', error);
        this.registerError = error.error?.message || 'Wystąpił błąd podczas rejestracji.';
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}

