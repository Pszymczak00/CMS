import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientAuthService, ClientOrderDay } from '../data/client-auth.service';

@Component({
  selector: 'app-order-day-rating',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order-day-rating.component.html',
  styleUrls: ['./order-day-rating.component.css']
})
export class OrderDayRatingComponent {
  @Input() orderDay!: ClientOrderDay;
  @Output() rated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private clientAuthService = inject(ClientAuthService);

  rating = 0;
  comment = '';
  hoveredRating = 0;
  saving = false;
  error = '';

  ngOnInit() {
    this.rating = this.orderDay.rating || 0;
    this.comment = this.orderDay.comment || '';
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  setHoveredRating(rating: number) {
    this.hoveredRating = rating;
  }

  clearHover() {
    this.hoveredRating = 0;
  }

  canRate(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Parse date string in format "yyyy-MM-dd"
    const dateParts = this.orderDay.date.split('-');
    const orderDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    orderDate.setHours(0, 0, 0, 0);
    return orderDate <= today;
  }

  onSubmit() {
    if (this.rating < 1 || this.rating > 5) {
      this.error = 'Wybierz ocenę od 1 do 5 gwiazdek.';
      return;
    }

    this.saving = true;
    this.error = '';

    this.clientAuthService.rateOrderDay(
      this.orderDay.id,
      this.rating,
      this.comment.trim() || null
    ).subscribe({
      next: () => {
        this.saving = false;
        this.rated.emit();
      },
      error: (error) => {
        this.saving = false;
        this.error = error.error?.message || 'Wystąpił błąd podczas zapisywania oceny.';
      }
    });
  }

  onCancel() {
    this.cancelled.emit();
  }

  formatDate(dateString: string): string {
    // Parse date string in format "yyyy-MM-dd"
    const dateParts = dateString.split('-');
    const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    return date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
}

