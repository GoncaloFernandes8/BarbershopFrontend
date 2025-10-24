import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, map, finalize } from 'rxjs';
import { BookingService, AppointmentDto, ServiceDto, BarberDto } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected lang = inject(LanguageService);

  // Estados
  loading = signal(true);
  appointments = signal<AppointmentDto[]>([]);
  services = signal<ServiceDto[]>([]);
  barbers = signal<BarberDto[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    // Carregar dados em paralelo
    const appointments$ = this.bookingService.getUserAppointments();
    const services$ = this.bookingService.getServices();
    const barbers$ = this.bookingService.getBarbers();

    appointments$.pipe(
      finalize(() => this.loading.set(false))
    ).subscribe(appointments => {
      this.appointments.set(appointments);
    });

    services$.subscribe(services => {
      this.services.set(services);
    });

    barbers$.subscribe(barbers => {
      this.barbers.set(barbers);
    });
  }

  // Helper methods
  getServiceById(id: number): ServiceDto | undefined {
    return this.services().find(s => s.id === id);
  }

  getBarberById(id: number): BarberDto | undefined {
    return this.barbers().find(b => b.id === id);
  }

  getStatusText(status?: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirmada';
      case 'COMPLETED': return 'Concluída';
      case 'CANCELLED': return 'Cancelada';
      case 'NO_SHOW': return 'Não compareceu';
      default: return 'Pendente';
    }
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      case 'NO_SHOW': return 'status-no-show';
      default: return 'status-pending';
    }
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(priceCents: number): string {
    return (priceCents / 100).toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  // Actions
  newAppointment(): void {
    this.router.navigate(['/marcacao']);
  }

  refresh(): void {
    this.loadData();
  }

  trackByAppointmentId(index: number, appointment: AppointmentDto): string {
    return appointment.id;
  }

  // Computed properties for statistics
  get totalAppointments(): number {
    return this.appointments().length;
  }

  get completedAppointments(): number {
    return this.appointments().filter(a => a.status === 'COMPLETED').length;
  }

  get confirmedAppointments(): number {
    return this.appointments().filter(a => a.status === 'CONFIRMED').length;
  }
}
