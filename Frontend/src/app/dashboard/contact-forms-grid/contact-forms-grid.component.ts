import { Component, inject } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { DataService, ContactForm } from '../data/data.service';

@Component({
  selector: 'app-contact-forms-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './contact-forms-grid.component.html',
  styleUrls: ['./contact-forms-grid.component.css']
})
export class ContactFormsGridComponent {
  dataService = inject(DataService);

  columnDefs: ColDef<ContactForm>[] = [
    { headerName: 'Id', field: 'id', width: 100 },
    { headerName: 'Imię', field: 'firstName', width: 150 },
    { headerName: 'Nazwisko', field: 'lastName', width: 150 },
    { headerName: 'Email', field: 'email', width: 250 },
    { 
      headerName: 'Treść', 
      field: 'content', 
      flex: 1,
      autoHeight: true,
      wrapText: true
    }
  ];

  rowData: ContactForm[] = [];

  ngOnInit() {
    this.dataService.httpGetContactForms().subscribe((data) => {
      this.rowData = data;
    });
  }
}
