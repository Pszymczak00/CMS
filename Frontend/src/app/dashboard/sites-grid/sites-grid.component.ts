import { Component, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { BusinessBasicData, ClientOpinion, DataService, Site } from '../data/data.service';
import { toottipText, validateCellStyle } from '../data/grid-commons';

@Component({
  selector: 'app-sites-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './sites-grid.component.html',
  styleUrls: ['./sites-grid.component.css']
})
export class SitesGridComponent {
  dataService = inject(DataService);

  columnDefs: ColDef<Site>[] = [
    { headerName: 'Nazwa', field: 'name', editable: true },
    { headerName: 'Tekst', field: 'text', editable: true, 
      cellEditor: 'agLargeTextCellEditor', // Użycie wbudowanego edytora
      cellEditorParams: {
        maxLength: 50000, // Maksymalna liczba znaków
        rows: 20, // Liczba wierszy w polu tekstowym
        cols: 100 // Liczba kolumn w polu tekstowym
      },
    },
    { headerName: 'Priorytet', field: 'priority', editable: true },
    {
      headerName: 'Usuń',
      cellRenderer: (params: any) => {
        return 'Usuń';
      },
      onCellClicked: (event: any) => {
        if (event.colDef.headerName === 'Usuń') {
          this.deleteRow(event.node.data.id);
          if(event.node.data.id > 0)
            this.deletedRows.push(event.node.data.id)
        }
      }
    }];

  rowData: Site[] = [];
  deletedRows: number[] = []
  ngOnInit() {
    this.dataService.httpGetSites().subscribe((data) => {
      this.rowData = data;
    });
  }

  addRow() {
    const newRow = { id: Math.min(this.rowData.sort(x => x.id)[0].id - 1, -1), name: '', text: '', priority: 1};
    this.rowData = [...this.rowData, newRow];
  }

  deleteRow(id: number){
    this.rowData = this.rowData.filter(row => row.id !== id);
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

    this.dataService.httpPostSites(this.rowData, this.deletedRows).subscribe(
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
