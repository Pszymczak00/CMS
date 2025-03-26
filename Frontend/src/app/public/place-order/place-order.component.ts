import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CateringPrice, DataService } from '../data/data.service';

export type CaloriePrice = {
  kcal: number;
  price: number;
}

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  @Input({required: true}) cateringName!: string
  dataService = inject(DataService)

  order = {
    email: '',
    firstName: '',
    lastName: '',
    startDate: '',
    endDate: '',
    count: null  as CaloriePrice | null,
    city: '',
    street: ''
  };

  numbers: CateringPrice[] = []

  minStartDate: string = '';
  maxDate: string = '';

  totalPrice = 0;

  ngOnInit(){
    this.dataService.httpGetCateringPrice(this.cateringName).subscribe({
      next: (prices) => {
        this.numbers = prices
      },
      error: (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      },
    });

    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 3); 

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1); 

    // Ustaw wartości w formacie 'YYYY-MM-DD'
    this.minStartDate = minDate.toISOString().split('T')[0];
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  onSubmit() {
    const start = this.getOnlyDate(new Date(this.order.startDate));
    const end = this.getOnlyDate(new Date(this.order.endDate));

    const minDate = this.getOnlyDate(new Date())
    minDate.setDate(minDate.getDate() + 3)

    const maxDate = this.getOnlyDate(new Date())
    maxDate.setDate(maxDate.getDate() + 365)

    if (end < start) {
      alert("Data końcowa musi być poźniejsza od początkowej")
      return;
    }

    if(minDate > start){
      alert("Zamówienie może się zacząć minimum 3 dni od dnia dzisiejszego")
      return;
    }

    if(maxDate < end){
      alert("Zamówienie może być złożone maksymalnie na rok do przodu")
      return;
    }

    this.dataService.httpAddOrder({
      Email: this.order.email,
      Name: this.order.firstName,
      Surname: this.order.lastName,
      DateStart: this.order.startDate,
      DateEnd: this.order.endDate,
      City: this.order.city,
      Address: this.order.street,
      Kcal: this.order.count?.kcal ?? 0,
      CateringName: this.cateringName,
      Price: this.totalPrice
    }).subscribe({
      next: (response) => {
        console.log('Zamówienie złożone pomyślnie:', response);
        alert('Zamówienie zostało złożone pomyślnie!');
      },
      error: (error) => {
        console.error('Błąd podczas składania zamówienia:', error);
        alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
      }}
    )
  }

  calculateDaysDifference(startDate: string, endDate: string, count: { kcal: number; price: number }): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    this.totalPrice = Math.max(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)), 0) * (count?.price || 0)
    return this.totalPrice; 
  }

  getOnlyDate(date: Date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
