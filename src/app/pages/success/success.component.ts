import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService, AppointmentDto, ServiceDto, BarberDto } from '../../services/booking.service';
import { combineLatest, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-success',
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {
  private route = inject(ActivatedRoute);
  private api = inject(BookingService);

  vm$ = this.route.paramMap.pipe(
    map(p => Number(p.get('id'))),
    switchMap(id => this.api.getAppointmentById(id)),
    switchMap((appt: AppointmentDto) =>
      combineLatest([
        this.api.getServiceById(appt.serviceId),
        this.api.getBarberById(appt.barberId)
      ]).pipe(map(([service, barber]) => ({ appt, service, barber })))
    )
  );
}
