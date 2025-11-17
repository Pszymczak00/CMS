import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, ContactForm } from '../data/data.service';
import { StateService } from '../data/state.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  dataService = inject(DataService)
  stateService = inject(StateService)

  formData: ContactForm = {
    FirstName: '',
    LastName: '',
    Email: '',
    Content: ''
  };

  onSubmit() {
    this.dataService.httpSubmitContactForm(this.formData).subscribe({
      next: (response) => {
        console.log('Formularz kontaktowy wysłany pomyślnie:', response);
        alert('Formularz kontaktowy został wysłany pomyślnie!');
        // Reset formularza i zamknij
        this.formData = {
          FirstName: '',
          LastName: '',
          Email: '',
          Content: ''
        };
        this.stateService.setShowContactForm(false);
        this.stateService.setmainSiteVisible();
      },
      error: (error) => {
        console.error('Błąd podczas wysyłania formularza:', error);
        alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
      }
    });
  }
}
