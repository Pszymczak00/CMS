import { Component, ViewChild, inject, Input, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCalendar, MatDatepickerModule, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CateringPrice, DataService } from '../data/data.service';
import { AuthService } from '../../dashboard/data/auth.service';
import { ClientAuthService } from '../data/client-auth.service';

export type CaloriePrice = {
  kcal: number;
  price: number;
}

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [FormsModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  @Input({required: true}) cateringName!: string
  dataService = inject(DataService)
  authService = inject(AuthService)
  clientAuthService = inject(ClientAuthService)
  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  order = {
    count: null  as CaloriePrice | null
  };

  numbers: CateringPrice[] = []

  minDate!: Date;
  maxDate!: Date;
  selectedDates: Date[] = [];
  totalPrice = 0;
  showCalendar = false;
  private isShiftPressed = false;
  private lastAnchorDate: Date | null = null;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent){
    if(event.key === 'Shift'){
      this.isShiftPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent){
    if(event.key === 'Shift'){
      this.isShiftPressed = false;
      this.lastAnchorDate = null;
    }
  }

  ngOnInit(){
    if (!this.authService.isClientAuthenticated()) {
      return;
    }

    this.dataService.httpGetCateringPrice(this.cateringName).subscribe({
      next: (prices) => {
        this.numbers = prices
      },
      error: (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      },
    });

    const today = new Date();
    this.minDate = this.getOnlyDate(new Date(today.setDate(today.getDate() + 3)));
    const max = new Date();
    max.setFullYear(max.getFullYear() + 1);
    this.maxDate = this.getOnlyDate(max);
  }

  get isAuthenticated() {
    return this.authService.isClientAuthenticated();
  }

  onSubmit() {
    if (!this.isAuthenticated) {
      alert("Musisz się zalogować, aby złożyć zamówienie.");
      return;
    }

    if(this.selectedDates.length === 0){
      alert("Dodaj przynajmniej jeden dzień dostawy");
      return;
    }

    if (!this.order.count) {
      alert("Wybierz liczbę kalorii");
      return;
    }

    this.dataService.httpAddOrder({
      Dates: this.selectedDates.map(date => this.toDateString(date)),
      CateringName: this.cateringName,
      Kcal: this.order.count.kcal,
      Price: this.totalPrice
    }).subscribe({
      next: (response) => {
        console.log('Zamówienie złożone pomyślnie:', response);
        alert('Zamówienie zostało złożone pomyślnie!');
        this.selectedDates = [];
        this.updateTotalPrice();
        this.showCalendar = false;
      },
      error: (error) => {
        console.error('Błąd podczas składania zamówienia:', error);
        if (error.status === 401) {
          alert('Musisz się zalogować, aby złożyć zamówienie.');
        } else {
          alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
        }
      }}
    )
  }

  getOnlyDate(date: Date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  dateFilter = (date: Date | null) => {
    if(!date) return false;
    if(!this.minDate || !this.maxDate) return true;
    const only = this.getOnlyDate(date);
    return only >= this.minDate && only <= this.maxDate;
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if(view === 'month'){
      const normalized = this.getOnlyDate(cellDate);
      const exists = this.selectedDates.some(d => d.getTime() === normalized.getTime());
      return exists ? 'selected-calendar-date' : '';
    }
    return '';
  };

  toggleCalendar(){
    this.showCalendar = !this.showCalendar;
  }

  closeCalendar(){
    this.showCalendar = false;
  }

  onDateSelected(date: Date | null){
    if(!date){
      return;
    }
    const normalized = this.getOnlyDate(date);

    if(this.isShiftPressed){
      if(!this.lastAnchorDate){
        this.addDate(normalized);
        this.lastAnchorDate = normalized;
      } else {
        this.toggleRangeSelection(this.lastAnchorDate, normalized);
        this.lastAnchorDate = normalized;
      }
    } else {
      this.toggleSingleDate(normalized);
      this.lastAnchorDate = null;
    }

    this.updateTotalPrice();
    this.calendar?.updateTodaysDate();
  }

  formatDate(date?: Date){
    if(!date) return '';
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  onCountChange(){
    this.updateTotalPrice();
  }

  private toDateString(date: Date){
    return date.toISOString().split('T')[0];
  }

  private updateTotalPrice(){
    this.totalPrice = this.selectedDates.length * (this.order.count?.price ?? 0);
  }

  private toggleSingleDate(date: Date){
    if(this.isSelected(date)){
      this.removeDate(date);
    } else {
      this.addDate(date);
    }
  }

  private toggleRangeSelection(start: Date, end: Date){
    const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start];
    const range: Date[] = [];
    const cursor = new Date(from);
    while(cursor.getTime() <= to.getTime()){
      if(this.dateFilter(cursor)){
        range.push(this.getOnlyDate(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    range.forEach(date => this.addDate(date));
  }

  private addDate(date: Date){
    if(this.isSelected(date)){
      return;
    }
    this.selectedDates = [...this.selectedDates, this.getOnlyDate(date)]
      .sort((a, b) => a.getTime() - b.getTime());
  }

  private removeDate(date: Date){
    this.selectedDates = this.selectedDates.filter(d => d.getTime() !== this.getOnlyDate(date).getTime());
  }

  private isSelected(date: Date){
    const compare = this.getOnlyDate(date).getTime();
    return this.selectedDates.some(d => d.getTime() === compare);
  }
}
