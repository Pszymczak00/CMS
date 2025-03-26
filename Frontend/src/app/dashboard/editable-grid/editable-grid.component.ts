import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

interface RowData {
  id: number;
  value: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-editable-grid',
  standalone: true,
  imports: [AgGridModule],  // Importujemy komponent do Angulara
  templateUrl: './editable-grid.component.html',
  styleUrls: ['./editable-grid.component.css'],
})
export class EditableGridComponent {
  columnDefs: ColDef<RowData>[] = [
    { headerName: 'Id', field: 'id', editable: false },
    { headerName: 'Wartość', field: 'value', editable: true },
    {
      field: 'description',
      headerName: 'Opis',
      editable: true,
      cellEditor: 'agLargeTextCellEditor', // Użycie wbudowanego edytora
      cellEditorParams: {
        maxLength: 50000, // Maksymalna liczba znaków
        rows: 30, // Liczba wierszy w polu tekstowym
        cols: 100 // Liczba kolumn w polu tekstowym
      },
      flex: 2
    },
    { headerName: 'Maksymalna data', field: 'date', editable: true },
    {
      headerName: 'Dodaj obraz', 
      cellRenderer: (params: any) => {
        return 'Dodaj';
      },
      onCellClicked: (event: any) => {
          this.deleteRow(event.node.data.id);
      }
    },
    {
      headerName: 'Edytuj warianty', 
      cellRenderer: (params: any) => {
        return 'Edytuj';
      },
      onCellClicked: (event: any) => {
          this.deleteRow(event.node.data.id);
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
        }
      }
    },
  ];

  rowData = [
    { id: 1, name: 'Keto', value: 'Keto', date: '2024-12-01',  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro commodi sint reprehenderit eveniet eum ipsa consectetur deserunt voluptas quos illo autem, soluta id sequi cumque doloremque voluptates quisquam minima nulla fugiat consequuntur. Quod commodi maiores iste deleniti hic iure soluta amet doloribus explicabo? Quidem nam ipsam cum, quibusdam qui earum.'},
    { id: 2, name: 'Klasyk', value: 'Klasyk', date: '2024-12-02', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro commodi sint reprehenderit eveniet eum ipsa consectetur deserunt voluptas quos illo autem, soluta id sequi cumque doloremque voluptates quisquam minima nulla fugiat consequuntur. Quod commodi maiores iste deleniti hic iure soluta amet doloribus explicabo? Quidem nam ipsam cum, quibusdam qui earum.'  },
    { id: 3, name: 'Premium', value: 'Premium', date: '2024-12-01',  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro commodi sint reprehenderit eveniet eum ipsa consectetur deserunt voluptas quos illo autem, soluta id sequi cumque doloremque voluptates quisquam minima nulla fugiat consequuntur. Quod commodi maiores iste deleniti hic iure soluta amet doloribus explicabo? Quidem nam ipsam cum, quibusdam qui earum.'},
    { id: 4, name: 'Item 2', value: 'Sport', date: '2024-12-02', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro commodi sint reprehenderit eveniet eum ipsa consectetur deserunt voluptas quos illo autem, soluta id sequi cumque doloremque voluptates quisquam minima nulla fugiat consequuntur. Quod commodi maiores iste deleniti hic iure soluta amet doloribus explicabo? Quidem nam ipsam cum, quibusdam qui earum.'  },
    { id: 5, name: 'Item 1', value: 'Wege', date: '2024-12-01',  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro commodi sint reprehenderit eveniet eum ipsa consectetur deserunt voluptas quos illo autem, soluta id sequi cumque doloremque voluptates quisquam minima nulla fugiat consequuntur. Quod commodi maiores iste deleniti hic iure soluta amet doloribus explicabo? Quidem nam ipsam cum, quibusdam qui earum.'},
  ];

  addRow() {
    const newRow = { id: this.rowData.length + 1, name: '', value: '', description: '', date: '' };
    this.rowData = [...this.rowData, newRow];
  }

  onCellValueChanged(event: any) {
    console.log('Zmieniono wartość:', event);
  }

  deleteRow(id: number) {
    this.rowData = this.rowData.filter(row => row.id !== id);
  }
}
