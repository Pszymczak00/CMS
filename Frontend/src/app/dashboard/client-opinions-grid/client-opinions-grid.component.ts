import { Component, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { BusinessBasicData, ClientOpinion, DataService } from '../data/data.service';
import { toottipText, validateCellStyle } from '../data/grid-commons';

@Component({
  selector: 'app-client-opinions-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './client-opinions-grid.component.html',
  styleUrls: ['./client-opinions-grid.component.css']
})
export class ClientOpinionsGridComponent {
  dataService = inject(DataService);

  columnDefs: ColDef<ClientOpinion>[] = [
    { headerName: 'Imię klienta', field: 'name', editable: true },
    { headerName: 'Nazwa diety', field: 'dietName', editable: true },
    { headerName: 'Opinia', field: 'opinion', editable: true, 
      cellEditor: 'agLargeTextCellEditor', // Użycie wbudowanego edytora
      cellEditorParams: {
        maxLength: 50000, // Maksymalna liczba znaków
        rows: 20, // Liczba wierszy w polu tekstowym
        cols: 100 // Liczba kolumn w polu tekstowym
      },
    }];

  rowData: ClientOpinion[] = [];
  ngOnInit() {
    this.dataService.httpGetClientsOpinions().subscribe((data) => {
      this.rowData = data;
    });
  }

  sendData() {
    const invalidRows = this.rowData.filter((row) => {
      return false
    });

    if (invalidRows.length > 0) {
      alert(`Znaleziono ${invalidRows.length} niepoprawnych wierszy. Proszę poprawić dane.`);
      console.error('Niepoprawne dane:', invalidRows);
      return;
    }

    this.dataService.httpPostClientOpinions(this.rowData).subscribe(
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
}
