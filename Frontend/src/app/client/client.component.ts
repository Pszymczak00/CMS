import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../public/header/header.component";
import { ItemCarouselComponent } from '../public/item-carousel/item-carousel.component';
import { StateService } from '../public/data/state.service';
import { PlaceOrderComponent } from "../public/place-order/place-order.component";
import { ClientOpinionsComponent } from '../public/client-opinions/client-opinions.component';
import { EditableGridComponent } from "../dashboard/editable-grid/editable-grid.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../public/footer/footer.component";
import { SiteComponent } from '../public/site/site.component';
import { DetailsComponent } from "../public/details/details.component";
import { ContactFormComponent } from "../public/contact-form/contact-form.component";
import { ClientOrdersComponent } from "../public/client-orders/client-orders.component";

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [HeaderComponent, ClientOpinionsComponent, ItemCarouselComponent, PlaceOrderComponent, FooterComponent, SiteComponent, DetailsComponent, ContactFormComponent, ClientOrdersComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  title = 'SZT';
  stateService = inject(StateService)
  
  get mainSiteVisible(){
    return this.stateService.getmainSiteVisible()
  }

  get cateringName(){
    return this.stateService.getCateringName()
  }

  get cateringDetails(){
    return this.stateService.getCateringDetails()
  }

  get siteName(){
    return this.stateService.getSiteName()
  }

  get showContactForm(){
    return this.stateService.getShowContactForm()
  }

  get showClientOrders(){
    return this.stateService.getShowClientOrders()
  }
}
