import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, finalize} from 'rxjs';

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
  private route = inject(ActivatedRoute);
  submitting = signal(false);
  notes = '';
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
  const barbers$  = this.api.getBarbers().pipe(map(list => list.filter(b => b.active)));
  const services$ = this.api.getServices().pipe(map(list => list.filter(s => s.active)));

  combineLatest([barbers$, services$]).subscribe(([barbers, services]) => {
    // guardar listas
    this.barbers.set(barbers);
    this.services.set(services);

    // ler query params (?servico=&barbeiro=)
    const qpm = this.route.snapshot.queryParamMap;
    const qpService  = Number(qpm.get('servico'));
    const qpBarber   = Number(qpm.get('barbeiro'));

    // escolher IDs válidos (fallback para o primeiro ativo)
    const svcId =
      services.find(s => s.id === qpService)?.id ??
      services[0]?.id ?? null;

    const barbId =
      barbers.find(b => b.id === qpBarber)?.id ??
      barbers[0]?.id ?? null;

    this.selectedServiceId.set(svcId);
    this.selectedBarberId.set(barbId);

    // carregar disponibilidade uma única vez
    this.selectedSlot.set(null);
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

  this.submitting.set(true);
  this.note.set(null);

  this.api.createAppointment({
    barberId: this.selectedBarberId()!,
    serviceId: this.selectedServiceId()!,
    clientId: Number(u.id),
    startsAt: this.selectedSlot()!,
    notes: this.notes.trim() || undefined
  })
  .pipe(finalize(() => this.submitting.set(false)))
  .subscribe({
    next: (id: string) => {
      this.notes = '';
      this.router.navigate(['/sucesso', id]);   // 👈 UUID
    },
    error: (err) => {
      this.note.set(
        err?.status === 409
          ? 'Esse horário ficou indisponível. Escolhe outro, por favor.'
          : (err?.message || 'Não foi possível criar a marcação.')
      );
      console.error('Falha ao criar marcação:', err);
    }
  });
}

onPickService(id: number) {
    if (this.selectedServiceId() === id) return;
    this.selectedServiceId.set(id);
    this.selectedSlot.set(null);
    this.loadAvailability();
  }

  onPickBarber(id: number) {
    if (this.selectedBarberId() === id) return;
    this.selectedBarberId.set(id);
    this.selectedSlot.set(null);
    this.loadAvailability();
  }

  // === imagens ===
  getServiceImg(s: ServiceDto): string {
    // mapeia por nome (ajusta se preferires slugs/ids)
    const name = s.name.toLowerCase();
    if (name.includes('corte e barba')) return 'assets/services/corte-barba.png';
    if (name.includes('barba'))          return 'assets/services/barba.png';
    if (name.includes('crian'))          return 'assets/services/crianca.png';
    if (name.includes('corte'))          return 'assets/services/corte.png';
    return 'assets/services/servico.png'; // fallback
  }

  getBarberImg(b: BarberDto): string {
    // tenta por id; se não existir, usa default
    return `assets/barbers/${b.id}.png`;
    // ou, se quiseres fallback robusto:
    // return this.imageExists[`assets/barbers/${b.id}.jpg`] ? `assets/barbers/${b.id}.jpg` : 'assets/barbers/default.jpg';
  }


}

function toYmd(d: Date) {
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

