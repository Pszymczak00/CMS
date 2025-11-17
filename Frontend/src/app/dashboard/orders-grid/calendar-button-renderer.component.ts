import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Order } from '../data/data.service';

type CalendarRendererParams = ICellRendererParams & {
  onOpen?: (order: Order, event: MouseEvent) => void;
};

@Component({
  selector: 'app-calendar-button-renderer',
  standalone: true,
  template: `
    <button class="calendar-btn" type="button" (click)="handleClick($event)">
      Kalendarz
    </button>
  `,
  styles: [`
    .calendar-btn{
      padding: 4px 10px;
      border: 1px solid #3f51b5;
      background: #fff;
      border-radius: 4px;
      color: #3f51b5;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }
    .calendar-btn:hover{
      background: #3f51b5;
      color: #fff;
    }
  `]
})
export class CalendarButtonRendererComponent implements ICellRendererAngularComp {
  params!: CalendarRendererParams;

  agInit(params: CalendarRendererParams): void {
    this.params = params;
  }

  refresh(params: CalendarRendererParams): boolean {
    this.params = params;
    return true;
  }

  handleClick(event: MouseEvent){
    if(this.params.onOpen && this.params.data){
      this.params.onOpen(this.params.data as Order, event);
    }
  }
}

