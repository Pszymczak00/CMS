import { Component, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { DataService, Order } from '../data/data.service';
import { OrderCalendarComponent } from '../order-calendar/order-calendar.component';
import { CalendarButtonRendererComponent } from './calendar-button-renderer.component';
import { RatingsButtonRendererComponent } from './ratings-button-renderer.component';
import { OrderRatingsModalComponent } from './order-ratings-modal.component';



@Component({
  selector: 'app-orders-grid',
  standalone: true,
  imports: [AgGridModule, OrderCalendarComponent, CalendarButtonRendererComponent, RatingsButtonRendererComponent, OrderRatingsModalComponent, NgStyle],
  templateUrl: './orders-grid.component.html',
  styleUrls: ['./orders-grid.component.css'],
})
export class OrdersGridComponent {
  dataService = inject(DataService);
  overlayVisible = false;
  overlayOrder: Order | null = null;
  overlayStyle: { top: string; left: string } | null = null;
  ratingsVisible = false;
  ratingsOrder: Order | null = null;

  columnDefs: ColDef<Order>[] = [
    { headerName: 'Id', field: 'id', width: 100 },
    { headerName: 'Email', field: 'email', width: 250 },
    { headerName: 'Imię', field: 'name', width: 150 },
    { headerName: 'Nazwisko', field: 'surname', width: 150 },
    { headerName: 'Miasto', field: 'city' },
    { headerName: 'Adres', field: 'address' },
    { headerName: 'Kcal', field: 'kcal' },
    { headerName: 'Nazwa diety', field: 'cateringName' },
    { headerName: 'Cena łącznie', field: 'price' },
    {
      headerName: 'Kalendarz',
      cellRenderer: CalendarButtonRendererComponent,
      width: 140,
      cellRendererParams: {
        onOpen: (order: Order, event: MouseEvent) => this.openCalendar(order, event)
      }
    },
    {
      headerName: 'Opinie',
      cellRenderer: RatingsButtonRendererComponent,
      width: 140,
      cellRendererParams: {
        onOpen: (order: Order, event: MouseEvent) => this.openRatings(order, event)
      }
    },
  ];

  rowData : Order[] = [];

  ngOnInit() {
    this.dataService.httpGetOrders().subscribe((data) => {
      this.rowData = data;
    });
  }

  openCalendar(order: Order, event: MouseEvent){
    this.overlayOrder = order;
    this.overlayStyle = null;
    this.overlayVisible = true;
  }

  closeCalendar(){
    this.overlayVisible = false;
    this.overlayOrder = null;
  }

  openRatings(order: Order, event: MouseEvent){
    this.ratingsOrder = order;
    this.ratingsVisible = true;
  }

  closeRatings(){
    this.ratingsVisible = false;
    this.ratingsOrder = null;
  }
}
