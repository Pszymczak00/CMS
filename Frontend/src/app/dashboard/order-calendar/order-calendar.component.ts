import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderDay } from '../data/data.service';

@Component({
  selector: 'app-order-calendar',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './order-calendar.component.html',
  styleUrls: ['./order-calendar.component.css']
})
export class OrderCalendarComponent implements OnChanges {
  @Input({required: true}) days: OrderDay[] = [];

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateList: Date[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['days']){
      this.prepareDates();
    }
  }

  prepareDates(){
    this.dateList = (this.days ?? [])
      .map(day => new Date(day.date))
      .filter(date => !isNaN(date.getTime()))
      .map(date => this.getOnlyDate(date))
      .sort((a, b) => a.getTime() - b.getTime());

    if(this.dateList.length){
      this.minDate = this.dateList[0];
      this.maxDate = this.dateList[this.dateList.length - 1];
    } else {
      this.minDate = null;
      this.maxDate = null;
    }

    setTimeout(() => this.calendar?.updateTodaysDate());
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if(view !== 'month'){
      return '';
    }
    const target = this.getOnlyDate(cellDate);
    return this.dateList.some(date => date.getTime() === target.getTime()) ? 'selected-calendar-date' : '';
  };

  onSelectedChange(){
    if(this.calendar){
      this.calendar.selected = null;
      setTimeout(() => this.calendar?.updateTodaysDate());
    }
  }

  private getOnlyDate(date: Date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}

