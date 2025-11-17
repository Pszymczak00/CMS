import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientAuthService } from '../data/client-auth.service';

@Component({
  selector: 'app-order-day-modify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-day-modify.component.html',
  styleUrls: ['./order-day-modify.component.css']
})
export class OrderDayModifyComponent {
  @Input() orderId!: number;
  @Input() date!: Date;
  @Input() exists!: boolean;
  @Output() modified = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private clientAuthService = inject(ClientAuthService);

  processing = false;
  error = '';

  formatDate(date: Date): string {
    return date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  canAdd(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    return this.date >= tomorrow && this.date <= oneYearFromNow;
  }

  canRemove(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    return this.date >= tomorrow && this.date <= oneYearFromNow;
  }

  onSubmit() {
    this.processing = true;
    this.error = '';

    // Format date as yyyy-MM-dd using local timezone (not UTC)
    const year = this.date.getFullYear();
    const month = String(this.date.getMonth() + 1).padStart(2, '0');
    const day = String(this.date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    if (this.exists) {
      // Remove day
      if (!this.canRemove()) {
        this.error = 'Możesz usuwać tylko dni od jutra do roku w przyszłość.';
        this.processing = false;
        return;
      }

      this.clientAuthService.removeOrderDay(this.orderId, dateString).subscribe({
        next: () => {
          this.processing = false;
          this.modified.emit();
        },
        error: (error) => {
          this.processing = false;
          this.error = error.error?.message || 'Wystąpił błąd podczas usuwania dnia.';
        }
      });
    } else {
      // Add day
      if (!this.canAdd()) {
        this.error = 'Możesz dodawać tylko dni od jutra do roku w przyszłość.';
        this.processing = false;
        return;
      }

      this.clientAuthService.addOrderDay(this.orderId, dateString).subscribe({
        next: () => {
          this.processing = false;
          this.modified.emit();
        },
        error: (error) => {
          this.processing = false;
          this.error = error.error?.message || 'Wystąpił błąd podczas dodawania dnia.';
        }
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}

