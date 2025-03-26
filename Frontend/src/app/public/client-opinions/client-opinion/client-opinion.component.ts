import { Component, inject, Input } from '@angular/core';
import { DataService } from '../../data/data.service';



@Component({
  selector: 'app-client-opinion',
  standalone: true,
  imports: [],
  templateUrl: './client-opinion.component.html',
  styleUrl: './client-opinion.component.css'
})
export class ClientOpinionComponent {
  @Input({required: true}) listId!: number
  dataService = inject(DataService)

  get clientOpinion(){
    return this.dataService.getClientOpinion(this.listId)
  }
}
