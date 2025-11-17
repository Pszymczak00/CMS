import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Order } from '../data/data.service';

type RatingsRendererParams = ICellRendererParams & {
  onOpen?: (order: Order, event: MouseEvent) => void;
};

@Component({
  selector: 'app-ratings-button-renderer',
  standalone: true,
  template: `
    <button class="ratings-btn" type="button" (click)="handleClick($event)">
      Opinie
    </button>
  `,
  styles: [`
    .ratings-btn{
      padding: 4px 10px;
      border: 1px solid #3f51b5;
      background: #fff;
      border-radius: 4px;
      color: #3f51b5;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }
    .ratings-btn:hover{
      background: #3f51b5;
      color: #fff;
    }
  `]
})
export class RatingsButtonRendererComponent implements ICellRendererAngularComp {
  params!: RatingsRendererParams;

  agInit(params: RatingsRendererParams): void {
    this.params = params;
  }

  refresh(params: RatingsRendererParams): boolean {
    this.params = params;
    return true;
  }

  handleClick(event: MouseEvent){
    if(this.params.onOpen && this.params.data){
      this.params.onOpen(this.params.data as Order, event);
    }
  }
}

