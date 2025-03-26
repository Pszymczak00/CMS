import { Component, inject, Input } from '@angular/core';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [],
  templateUrl: './site.component.html',
  styleUrl: './site.component.css'
})
export class SiteComponent {
  @Input({required: true}) name!: string
  dataService = inject(DataService)

  get site(){
    return this.dataService.getSite(this.name)
  }
}
