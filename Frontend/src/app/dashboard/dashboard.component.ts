import { Component, inject } from '@angular/core';
import { EditableGridComponent } from "./editable-grid/editable-grid.component";
import { PlaceOrderComponent } from "../public/place-order/place-order.component";
import { OrdersGridComponent } from "./orders-grid/orders-grid.component";
import { BasicBusinessDataGridComponent } from "./basic-business-data-grid/basic-business-data-grid.component";
import { ClientOpinionsGridComponent } from "./client-opinions-grid/client-opinions-grid.component";
import { SiteComponent } from "../public/site/site.component";
import { SitesGridComponent } from "./sites-grid/sites-grid.component";
import { CateringTypesGridComponent } from "./catering-types-grid/catering-types-grid.component";
import { StateService } from './data/state.service';
import { PhotoUploaderComponent } from './photo-uploader/photo-uploader.component';
import { CateringPricesGridComponent } from './catering-prices-grid/catering-prices-grid.component';
import { AuthService } from './data/auth.service';
import { LoginComponent } from "./login/login.component";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContactFormsGridComponent } from './contact-forms-grid/contact-forms-grid.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [EditableGridComponent, PlaceOrderComponent, OrdersGridComponent,
    BasicBusinessDataGridComponent, ClientOpinionsGridComponent, SiteComponent,
    SitesGridComponent, CateringTypesGridComponent, PhotoUploaderComponent, CateringPricesGridComponent,
    LoginComponent, ChangePasswordComponent, ContactFormsGridComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stateService = inject(StateService)
  authService = inject(AuthService)

  OnNavClick(name: string){
    this.stateService.setSite(name)
  }

  Logout(){
    this.authService.clearToken()
  }

  ChangePassword(){
    this.stateService.setSite("change-password")
  }

  get site(){
    return this.stateService.getSite()
  }

  get number(){
    return this.stateService.getNumber()
  }

  get isAuthorised(){
    return this.authService.getToken()
  }


  get navBar(){
    return ["Podstawowe dane", "Opinie klientów", "Podstrony", "Dostępne diety", "Zamówienia", "Formularze kontaktowe"]
  }
}
