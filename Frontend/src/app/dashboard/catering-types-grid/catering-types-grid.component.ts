import { Component, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { BusinessBasicData, CateringType, DataService } from '../data/data.service';
import { CustomTooltipComponent } from './CustomTooltipComponent';
import { StateService } from '../data/state.service';


@Component({
  selector: 'catering-types-grid',
  standalone: true,
  imports: [AgGridModule, CustomTooltipComponent],
  templateUrl: './catering-types-grid.component.html',
  styleUrls: ['./catering-types-grid.component.css']
})
export class CateringTypesGridComponent {
  dataService = inject(DataService);
  stateService = inject(StateService)
  frameworkComponents = {
    customTooltip: CustomTooltipComponent,
  };

  columnDefs: ColDef<CateringType>[] = [
    { headerName: 'Nazwa', field: 'name', editable: true },
    { headerName: 'Opis', field: 'description', editable: true,       
      cellEditor: 'agLargeTextCellEditor', // Użycie wbudowanego edytora
      cellEditorParams: {
        maxLength: 50000, // Maksymalna liczba znaków
        rows: 20, // Liczba wierszy w polu tekstowym
        cols: 100 // Liczba kolumn w polu tekstowym
      },
    },
    {
      headerName: 'Obraz',
      field: 'url',
      cellRenderer: (params: any) => {
        return `<img src="${params.value}?' + Math.random()" alt="Image" style="width: 50px; object-fit: cover;">`;
      },
      tooltipField: 'url',
      tooltipComponent: 'customTooltip',
    },
    {
      headerName: 'Edytuj zdjęcie',
      cellRenderer: (params: any) => {
        return 'Edytuj zdjęcie';
      },
      onCellClicked: (event: any) => {
        if (event.colDef.headerName === 'Edytuj zdjęcie') {
          if(event.node.data.id > 0){
            this.stateService.setSite("Photo-uploader")
            this.stateService.setNumber(event.node.data.id)
          }
          else
            alert("Najpierw zapisz dane")
        }
      }
    },
    {
      headerName: 'Edytuj ceny',
      cellRenderer: (params: any) => {
        return 'Edytuj ceny';
      },
      onCellClicked: (event: any) => {
        if (event.colDef.headerName === 'Edytuj ceny') {
          if(event.node.data.id > 0){
            this.stateService.setSite("Catering-prices")
            this.stateService.setNumber(event.node.data.id)
          }
          else
            alert("Najpierw zapisz dane")
        }
      }
    },
    {
      headerName: 'Usuń',
      cellRenderer: (params: any) => {
        return 'Usuń';
      },
      onCellClicked: (event: any) => {
        if (event.colDef.headerName === 'Usuń') {
          this.deleteRow(event.node.data.id);
          if (event.node.data.id > 0) {
            this.deletedRows.push(event.node.data.id);
          }
        }
      }
    }
  ];

  rowData: CateringType[] = [];
  deletedRows: number[] = [];

  ngOnInit() {
    this.dataService.httpGetCateringTypes().subscribe((data) => {
      this.rowData = data;
    });
  }

  addRow() {
    const newRow = { id: Math.min(this.rowData.sort(x => x.id)[0].id - 1, -1), name: '', description: '', url: '' };
    this.rowData = [...this.rowData, newRow];
  }

  deleteRow(id: number) {
    this.rowData = this.rowData.filter(row => row.id !== id);
  }

  sendData() {
    const invalidRows = this.rowData.filter((row) => {
      return false;
    });

    if (invalidRows.length > 0) {
      alert(`Znaleziono ${invalidRows.length} niepoprawnych wierszy. Proszę poprawić dane.`);
      console.error('Niepoprawne dane:', invalidRows);
      return;
    }

    this.dataService.httpPostCateringTypes(this.rowData, this.deletedRows).subscribe(
      (response) => {
        console.log('Dane zostały zaktualizowane:', response);
        alert('Dane zostały zaktualizowane!');
        this.dataService.httpGetCateringTypes().subscribe((data) => {
          this.rowData = data;
        });
      },
      (error) => {
        console.error('Błąd aktualizacji:', error);
        alert('Wystąpił błąd podczas aktualizacji danych.');
      }
    );
  }
}
