import { Component, inject, Input } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { BusinessBasicData, CateringPrice, ClientOpinion, DataService, Site } from '../data/data.service';
import { toottipText, validateCellStyle } from '../data/grid-commons';

@Component({
  selector: 'app-catering-prices-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './catering-prices-grid.component.html',
  styleUrls: ['./catering-prices-grid.component.css']
})
export class CateringPricesGridComponent {
  @Input({required: true}) id!: number
  dataService = inject(DataService);

  columnDefs: ColDef<CateringPrice>[] = [
    { headerName: 'Kalorie', field: 'kcal', editable: true, 
      filter: 'agNumberColumnFilter', 
    },
    { headerName: 'Cena', field: 'price', editable: true, 
      filter: 'agNumberColumnFilter', 
    },
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

  rowData: CateringPrice[] = [];
  deletedRows: number[] = []
  ngOnInit() {
    this.dataService.httpGetCateringPrices(this.id).subscribe((data) => {
      this.rowData = data;
    });
  }

  addRow() {
    const newRow = { id: Math.min(this.rowData.sort(x => x.id)[0].id - 1, -1), kcal: 0, price: 0};
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

    this.dataService.httpPostCateringPrices(this.rowData, this.deletedRows, this.id).subscribe(
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
