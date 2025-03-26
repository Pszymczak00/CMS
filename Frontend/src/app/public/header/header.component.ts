import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { StateService } from '../data/state.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  dataService = inject(DataService)
  stateService = inject(StateService)
  get businessName(){
    return this.dataService.getbusinessBasicData().name
  }
  get numer(){
    return this.dataService.getbusinessBasicData().phoneNumber
  }
  get email(){
    return this.dataService.getbusinessBasicData().email
  }

  get navBar(){
    return this.dataService.getSites()
  }
  

  ngOnInit(){
    this.dataService.httpGetBusinessBasicData().subscribe(
      (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      })
    this.dataService.httpGetSites().subscribe(
      (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      })
  }

  OnClick(){
    this.stateService.setmainSiteVisible()
  }

  OnNavClick(name: string){
    this.stateService.setSite(name)
  }
}
