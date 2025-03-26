import { Component, inject } from '@angular/core';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  dataService = inject(DataService)

  get businessName(){
    return this.dataService.getbusinessBasicData().name
  }
  get numer(){
    return this.dataService.getbusinessBasicData().phoneNumber
  }
  get email(){
    return this.dataService.getbusinessBasicData().email
  }
}
