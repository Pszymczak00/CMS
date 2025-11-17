import { Component, Input, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClientOrderDay } from '../data/client-auth.service';

@Component({
  selector: 'app-client-order-calendar',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './client-order-calendar.component.html',
  styleUrls: ['./client-order-calendar.component.css']
})
export class ClientOrderCalendarComponent implements OnChanges {
  @Input({required: true}) days: ClientOrderDay[] = [];
  @Input() orderId: number = 0;
  @Output() dateClick = new EventEmitter<ClientOrderDay>();
  @Output() futureDateClick = new EventEmitter<{date: Date, exists: boolean}>();

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateList: Date[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;
  dateMap = new Map<string, ClientOrderDay>();
  
  // For future date selection - allow up to 1 year from today
  get selectableMinDate(): Date {
    return new Date(); // Today
  }
  
  get selectableMaxDate(): Date {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['days']){
      this.prepareDates();
    }
  }

  prepareDates(){
    this.dateMap.clear();
    this.dateList = (this.days ?? [])
      .map(day => {
        // Parse date string in format "yyyy-MM-dd"
        const dateParts = day.date.split('-');
        const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        const dateKey = this.getDateKey(date);
        this.dateMap.set(dateKey, day);
        return this.getOnlyDate(date);
      })
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    // Set minDate to today (or earliest order day if it's in the past) for viewing
    // Set maxDate to 1 year from today for future date selection (from tomorrow)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    if(this.dateList.length){
      const earliestDate = this.dateList[0] < today ? this.dateList[0] : today;
      const latestDate = this.dateList[this.dateList.length - 1] > oneYearFromNow 
        ? this.dateList[this.dateList.length - 1] 
        : oneYearFromNow;
      this.minDate = earliestDate;
      this.maxDate = latestDate;
    } else {
      // If no dates, allow from today (to see today's date) but selection only from tomorrow
      this.minDate = today;
      this.maxDate = oneYearFromNow;
    }

    setTimeout(() => this.calendar?.updateTodaysDate());
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if(view !== 'month'){
      return '';
    }
    const target = this.getOnlyDate(cellDate);
    const dateKey = this.getDateKey(target);
    const day = this.dateMap.get(dateKey);
    
    if (!day) {
      return '';
    }
    
    let classes = 'selected-calendar-date';
    if (day.rating) {
      classes += ' rated-date';
    }
    return classes;
  };

  onSelectedChange(date: Date | null){
    if(!date) {
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = this.getOnlyDate(date);
    
    const dateKey = this.getDateKey(date);
    const day = this.dateMap.get(dateKey);
    
    // If date is today or in the past, and exists in order, emit for rating
    if (day && selectedDate <= today) {
      this.dateClick.emit(day);
    }
    // If date is in the future, emit for add/remove with validation
    else if (selectedDate > today) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const oneYearFromNow = new Date(today);
      oneYearFromNow.setFullYear(today.getFullYear() + 1);
      
      // Can add/remove from tomorrow up to 1 year
      if (selectedDate >= tomorrow && selectedDate <= oneYearFromNow) {
        this.futureDateClick.emit({
          date: selectedDate,
          exists: !!day
        });
      }
    }
    
    if(this.calendar){
      this.calendar.selected = null;
      setTimeout(() => this.calendar?.updateTodaysDate());
    }
  }

  private getOnlyDate(date: Date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private getDateKey(date: Date): string {
    const d = this.getOnlyDate(date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
}

