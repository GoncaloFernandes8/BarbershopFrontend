import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService, AppointmentDto } from '../../services/booking.service';
import { of, combineLatest, map, switchMap, catchError } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-success',
  imports: [CommonModule, DatePipe, RouterLink], // 👈 adiciona RouterLink
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {
  private route = inject(ActivatedRoute);
  private api = inject(BookingService);

  vm$ = this.route.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => {
      if (!id) return of({ appt: null, service: null, barber: null });
      return this.api.getAppointmentById(id).pipe(
        switchMap((appt: AppointmentDto) =>
          combineLatest([
            this.api.getServiceById(appt.serviceId),
            this.api.getBarberById(appt.barberId)
          ]).pipe(map(([service, barber]) => ({ appt, service, barber })))
        ),
        catchError(() => of({ appt: null, service: null, barber: null }))
      );
    })
  );
}
