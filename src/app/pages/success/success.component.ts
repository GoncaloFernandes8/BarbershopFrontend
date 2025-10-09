import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookingService, AppointmentDto, ServiceDto, BarberDto } from '../../services/booking.service';
import { switchMap, combineLatest, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-success',
  imports: [CommonModule, DatePipe],
  template: `
    <section class="success" *ngIf="vm$ | async as vm">
      <h1>Marcação confirmada!</h1>

      <p><strong>Data e hora:</strong>
        {{ vm.appt.startsAt | date:"EEEE, d 'de' MMMM 'às' HH:mm":'Europe/Lisbon':'pt-PT' }}
      </p>

      <p><strong>Serviço:</strong> {{ vm.service.name }}</p>
      <p><strong>Barbeiro:</strong> {{ vm.barber.name }}</p>


      <p class="muted">ID da marcação: {{ vm.appt.id }}</p>
    </section>
  `
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
      ]).pipe(
        map(([service, barber]) => ({ appt, service, barber }))
      )
    )
  );
}
