import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../config';

@Component({
  selector: 'app-photo-uploader',
  standalone: true,
  imports: [],
  templateUrl: './photo-uploader.component.html',
  styleUrl: './photo-uploader.component.css'
})
export class PhotoUploaderComponent {
  @Input({required: true}) id!: number

  
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  // Metoda wybierająca plik
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Metoda wysyłająca plik na serwer
  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('description', 'Opis pliku'); // Przykładowy dodatkowy parametr

      this.uploadFile(formData).subscribe(response => {
        alert('Plik wysłany:');
      }, error => {
        alert('Błąd wysyłania pliku');
      });
    }
  }

  // Funkcja do wysyłania pliku za pomocą HTTP POST
  uploadFile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    
    return this.http.post(`${API_URL}/api/Private/Upload/${this.id}`, formData, { headers });
  }
}
