import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CalendarMonthComponent } from '../../components/calendar-month/calendar-month.component';
import { TimeSlotsComponent } from '../../components/time-slots/time-slots.component';

import { BookingService, ServiceDto, BarberDto } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-booking',
  imports: [CommonModule, FormsModule, CalendarMonthComponent, TimeSlotsComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  private api = inject(BookingService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // dropdowns
  services = signal<ServiceDto[]>([]);
  barbers  = signal<BarberDto[]>([]);
  selectedServiceId = signal<number | null>(null);
  selectedBarberId  = signal<number | null>(null);

  // calendário
  todayYmd = toYmd(new Date());
  month = signal<string>(this.todayYmd.slice(0, 7));   // YYYY-MM
  selectedDate = signal<string | null>(this.todayYmd); // YYYY-MM-DD

  // slots
  slots = signal<string[]>([]);
  selectedSlot = signal<string | null>(null);
  loadingSlots = signal<boolean>(false);
  note = signal<string | null>(null);

  ngOnInit(): void {
    this.api.getBarbers().subscribe(list => {
      const active = list.filter(b => b.active);
      this.barbers.set(active);
      if (!this.selectedBarberId() && active.length) this.selectedBarberId.set(active[0].id);
      this.loadAvailability();
    });

    this.api.getServices().subscribe(list => {
      const active = list.filter(s => s.active);
      this.services.set(active);
      if (!this.selectedServiceId() && active.length) this.selectedServiceId.set(active[0].id);
      this.loadAvailability();
    });
  }

  onMonthChange(ym: string) {
    this.month.set(ym);
  }

  onSelectDate(ymd: string) {
    this.selectedDate.set(ymd);
    this.selectedSlot.set(null);
    this.loadAvailability();
  }

  onPickSlot(iso: string) {
    this.selectedSlot.set(iso);
    this.note.set(null);
  }

  loadAvailability() {
    const b = this.selectedBarberId(), s = this.selectedServiceId(), d = this.selectedDate();
    if (!b || !s || !d) return;

    this.loadingSlots.set(true);
    this.api.getAvailability(b, s, d).subscribe({
      next: list => { this.slots.set(list); this.loadingSlots.set(false); },
      error: () => { this.slots.set([]); this.loadingSlots.set(false); }
    });
  }

  canSubmit = computed(() => !!this.selectedBarberId() && !!this.selectedServiceId() && !!this.selectedDate() && !!this.selectedSlot());

  book() {
    if (!this.canSubmit()) return;
    const u = this.auth.user;
    if (!u?.id) { this.note.set('Tens de iniciar sessão para marcar.'); return; }

    this.api.createAppointment({
      barberId: this.selectedBarberId()!,
      serviceId: this.selectedServiceId()!,
      clientId: Number(u.id),
      startsAt: this.selectedSlot()!,   // ISO vindo do /availability (pode vir com Z)
      notes: ''
    }).subscribe({
      next: id => this.router.navigate(['/sucesso', id || 'ok']),
      error: err => this.note.set(err?.status === 409
        ? 'Esse horário ficou indisponível. Escolhe outro, por favor.'
        : 'Não foi possível criar a marcação.')
    });
  }
}

function toYmd(d: Date) {
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
