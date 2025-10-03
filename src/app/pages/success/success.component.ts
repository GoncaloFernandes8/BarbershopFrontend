import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  standalone: true,
  selector: 'app-success',
  imports: [CommonModule, RouterLink],
  templateUrl: './success.component.html'
})
export class SuccessComponent {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  id!: string;
  booking?: Booking;

  constructor(){
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.booking = this.bookingService.getById(this.id);
  }
}
