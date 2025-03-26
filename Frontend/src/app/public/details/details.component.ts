import { Component, inject, Input } from '@angular/core';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  @Input({required: true}) name!: string
  dataService = inject(DataService)

  get details(){
    return this.dataService.getDetails(this.name)
  }
}
