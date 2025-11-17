import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderDay } from '../data/data.service';

@Component({
  selector: 'app-order-ratings-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-ratings-modal.component.html',
  styleUrls: ['./order-ratings-modal.component.css']
})
export class OrderRatingsModalComponent {
  @Input() order!: Order;
  @Output() close = new EventEmitter<void>();

  getRatings(): OrderDay[] {
    return (this.order?.orderDays || []).filter(day => day.rating !== null && day.rating !== undefined);
  }

  formatDate(dateString: string): string {
    const dateParts = dateString.split('-');
    const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    return date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  getStars(rating: number | null): string {
    if (!rating) return '';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  closeModal() {
    this.close.emit();
  }
}

