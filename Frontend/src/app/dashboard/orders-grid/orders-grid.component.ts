import { Component, inject } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { DataService, Order } from '../data/data.service';



@Component({
  selector: 'app-orders-grid',
  standalone: true,
  imports: [AgGridModule],  // Importujemy komponent do Angulara
  templateUrl: './orders-grid.component.html',
  styleUrls: ['./orders-grid.component.css'],
})
export class OrdersGridComponent {
  dataService = inject(DataService);

  columnDefs: ColDef<Order>[] = [
    { headerName: 'Id', field: 'id', width: 100 },
    { headerName: 'Email', field: 'email', width: 250 },
    { headerName: 'Name', field: 'name', width: 150 },
    { headerName: 'Surname', field: 'surname', width: 150 },
    { headerName: 'Start Date', field: 'dateStart' },
    { headerName: 'End Date', field: 'dateEnd' },
    { headerName: 'City', field: 'city' },
    { headerName: 'Address', field: 'address' },
    { headerName: 'Kcal', field: 'kcal' },
    { headerName: 'Nazwa diety', field: 'cateringName' },
    { headerName: 'Cena łącznie', field: 'price' }
  ];

  rowData : Order[] = [];

  ngOnInit() {
    this.dataService.httpGetOrders().subscribe((data) => {
      this.rowData = data;
    });
  }

}
