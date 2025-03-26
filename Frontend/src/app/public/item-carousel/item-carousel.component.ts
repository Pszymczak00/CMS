import { Component, HostListener, inject } from '@angular/core';
import { DataService } from '../data/data.service';
import { StateService } from '../data/state.service';

@Component({
  selector: 'app-item-carousel',
  standalone: true,
  imports: [],
  templateUrl: './item-carousel.component.html',
  styleUrls: ['./item-carousel.component.css']
})
export class ItemCarouselComponent {
  dataService = inject(DataService)
  stateService = inject(StateService)
  get items(){
    return this.dataService.getCateringTypes()
  } 
  currentIndex = 0;
  itemsPerPage = 4;

  onClick(name: string){
    this.stateService.setCateringType(name)
  }

  onDetailsClick(name: string){
    this.stateService.setCateringDetails(name)
  }

  get currentItems() {
    return getElements(this.items, this.currentIndex, this.itemsPerPage)
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
    else
      this.currentIndex = this.items.length - 1
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex += 1;
    }
    else
      this.currentIndex = 0;
  }

  ngOnInit(){
    this.updateItemsPerPage();
    this.dataService.httpGetCateringTypes().subscribe(
      (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateItemsPerPage();
  }

  updateItemsPerPage() {
    const width = window.innerWidth;

    if (width < 600) {
      this.itemsPerPage = 1; // Małe ekrany (np. telefony)
    } else if (width < 900) {
      this.itemsPerPage = 2; // Średnie ekrany (np. małe tablety)
    } else if (width < 1200) {
      this.itemsPerPage = 3; // Średnie ekrany (np. małe tablety)
    } else if (width < 1500) {
      this.itemsPerPage = 4; // Średnie ekrany (np. małe tablety)
    } else {
      this.itemsPerPage = 5; // Duże ekrany
    }
  }

}

function getElements<T>(array: T[], x: number, y: number): T[] {
  if (!array || array.length === 0) return [];

  const result: T[] = [];

  // Pobierz elementy od indeksu x
  const sliced = array.slice(x, x + y);
  result.push(...sliced);

  // Jeśli brakuje elementów, pobierz z początku tablicy
  const missingCount = y - sliced.length;
  if (missingCount > 0) {
    const fromStart = array.slice(0, missingCount);
    result.push(...fromStart);
  }

  return result;
}
