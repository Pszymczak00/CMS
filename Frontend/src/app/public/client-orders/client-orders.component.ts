import { Component, inject, OnInit } from '@angular/core';
import { ClientAuthService, ClientOrder, ClientOrderDay } from '../data/client-auth.service';
import { ClientOrderCalendarComponent } from '../client-order-calendar/client-order-calendar.component';
import { CommonModule } from '@angular/common';
import { OrderDayRatingComponent } from '../order-day-rating/order-day-rating.component';
import { OrderDayModifyComponent } from '../order-day-modify/order-day-modify.component';
import { StateService } from '../data/state.service';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [ClientOrderCalendarComponent, CommonModule, OrderDayRatingComponent, OrderDayModifyComponent],
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.css']
})
export class ClientOrdersComponent implements OnInit {
  private clientAuthService = inject(ClientAuthService);
  private stateService = inject(StateService);

  orders: ClientOrder[] = [];
  loading = true;
  selectedOrder: ClientOrder | null = null;
  showCalendar = false;
  selectedOrderDay: ClientOrderDay | null = null;
  showRating = false;
  showModify = false;
  modifyDate: Date | null = null;
  modifyExists = false;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const selectedOrderId = this.selectedOrder?.id;
    this.clientAuthService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        // Update selectedOrder if calendar is open - create new object reference to trigger change detection
        if (selectedOrderId && this.showCalendar) {
          const updatedOrder = orders.find(o => o.id === selectedOrderId);
          if (updatedOrder) {
            // Create a new object reference with new array reference to ensure Angular detects the change
            this.selectedOrder = { 
              ...updatedOrder, 
              orderDays: [...updatedOrder.orderDays] 
            };
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania zamówień:', error);
        this.loading = false;
      }
    });
  }

  openCalendar(order: ClientOrder) {
    this.selectedOrder = order;
    this.showCalendar = true;
  }


  closeCalendar() {
    this.showCalendar = false;
    this.selectedOrder = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  getOrderDaysCount(order: ClientOrder): number {
    return order.orderDays?.length || 0;
  }

  onDateClick(orderDay: ClientOrderDay) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Parse date string in format "yyyy-MM-dd"
    const dateParts = orderDay.date.split('-');
    const orderDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    orderDate.setHours(0, 0, 0, 0);
    
    if (orderDate <= today) {
      this.selectedOrderDay = orderDay;
      this.showRating = true;
    }
  }

  closeRating() {
    this.showRating = false;
    this.selectedOrderDay = null;
  }

  onRated() {
    this.closeRating();
    this.loadOrders(); // Reload orders to get updated ratings
    // selectedOrder will be updated automatically in loadOrders()
  }

  onFutureDateClick(event: {date: Date, exists: boolean}) {
    this.modifyDate = event.date;
    this.modifyExists = event.exists;
    this.showModify = true;
  }

  closeModify() {
    this.showModify = false;
    this.modifyDate = null;
    this.modifyExists = false;
  }

  onModified() {
    this.closeModify();
    this.loadOrders(); // Reload orders to get updated data
  }

  goToMainPage() {
    this.stateService.setmainSiteVisible();
  }
}

