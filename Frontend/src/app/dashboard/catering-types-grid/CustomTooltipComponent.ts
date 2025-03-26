import { ITooltipAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-tooltip',
  standalone: true,
  template: `
    <div class="custom-tooltip">
      <img [src]="url" alt="Tooltip Image" class="tooltip-image" />
      <div class="tooltip-text">{{ data.text }}</div>
    </div>
  `,
  styles: [
    `
      .custom-tooltip {
        display: flex;
        align-items: center;
      }
      .tooltip-image {
        width: 250px;
        margin-right: 10px;
      }
      .tooltip-text {
        font-size: 14px;
      }
    `,
  ],
})
export class CustomTooltipComponent implements ITooltipAngularComp {
  public data: any;
  public url: string = "";

  agInit(params: any): void {
    this.data = params.data;
    this.url = params.data.url + '?' + escape(new Date().toString())
  }
}
