import { Component, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { BusinessBasicData, DataService } from '../data/data.service';
import { toottipText, validateCellStyle } from '../data/grid-commons';

@Component({
  selector: 'app-basic-business-data-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './basic-business-data-grid.component.html',
  styleUrls: ['./basic-business-data-grid.component.css']
})
export class BasicBusinessDataGridComponent {
  dataService = inject(DataService);

  columnDefs: ColDef<BusinessBasicData>[] = [
    { headerName: 'Nazwa firmy', field: 'name', editable: true },
    { headerName: 'Numer telefonu', field: 'phoneNumber', editable: true },
    {
      headerName: 'Email',
      field: 'email',
      editable: true,
      cellStyle: params => validateCellStyle(this.isValidEmail, params.value),
      tooltipValueGetter: params => toottipText(this.isValidEmail, params.value)
  }
  ];

  rowData: BusinessBasicData[] = [];
  ngOnInit() {
    this.dataService.httpGetBusinessBasicData().subscribe((data) => {
      this.rowData = [data];
    });
  }

  sendData() {
    const invalidRows = this.rowData.filter((row) => {
      return !this.isValidEmail(row.email);
    });

    if (invalidRows.length > 0) {
      alert(`Znaleziono ${invalidRows.length} niepoprawnych wierszy. Proszę poprawić dane.`);
      console.error('Niepoprawne dane:', invalidRows);
      return;
    }

    this.dataService.httpPostBusinessBasicData(this.rowData[0]).subscribe(
      (response) => {
        console.log('Dane zostały zaktualizowane:', response);
        alert('Dane zostały zaktualizowane!');
      },
      (error) => {
        console.error('Błąd aktualizacji:', error);
        alert('Wystąpił błąd podczas aktualizacji danych.');
      }
    );
  }

  // Funkcja sprawdzająca poprawność adresu e-mail
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
