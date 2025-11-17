import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { StateService } from '../data/state.service';
import { AuthService } from '../../dashboard/data/auth.service';
import { ClientLoginComponent } from '../client-login/client-login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ClientLoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  dataService = inject(DataService)
  stateService = inject(StateService)
  authService = inject(AuthService)
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

  get isAuthenticated() {
    return this.authService.isClientAuthenticated();
  }

  showLogin = false;

  toggleLogin() {
    this.showLogin = !this.showLogin;
  }

  logout() {
    this.authService.clearClientToken();
    this.showLogin = false;
  }

  onLoginSuccess() {
    this.showLogin = false;
  }

  OnOrdersClick() {
    this.stateService.setShowClientOrders(true);
  }
}
