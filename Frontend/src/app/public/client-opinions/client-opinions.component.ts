import { Component, inject } from '@angular/core';
import { ClientOpinionComponent } from "./client-opinion/client-opinion.component";
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-client-opinions',
  standalone: true,
  imports: [ClientOpinionComponent],
  templateUrl: './client-opinions.component.html',
  styleUrl: './client-opinions.component.css'
})
export class ClientOpinionsComponent {
  dataService = inject(DataService)

  ngOnInit(){
    this.dataService.httpGetClientOpinions().subscribe(
      (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      })
  }
}
