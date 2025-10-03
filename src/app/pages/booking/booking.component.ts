import { Component, signal, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { SERVICE_TYPES } from '../../models/service-type.model';
import { CalendarMonthComponent } from '../../components/calendar-month/calendar-month.component';
import { TimeSlotsComponent } from '../../components/time-slots/time-slots.component';

function toYYYYMM(d: Date){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
function todayStr(){ return new Date().toISOString().slice(0,10); }

@Component({
  standalone: true,
  selector: 'app-booking',
  imports: [CommonModule, ReactiveFormsModule, CalendarMonthComponent, TimeSlotsComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  private booking = inject(BookingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  minDate = todayStr();
  // Calendar state
  month = signal<string>(toYYYYMM(new Date()));
  date = signal<string>(todayStr());
  slots = computed(() => this.booking.getAvailableSlots(this.date()));
  time = signal<string>('');

  serviceTypes = SERVICE_TYPES;
  submitting = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d[\d\s]{6,}$/)]],
    email: ['', [Validators.email]],
    serviceId: [SERVICE_TYPES[0].id, Validators.required],
    date: [this.date(), Validators.required],
    time: [this.time(), Validators.required],
    note: ['']
  });

  syncEffect = effect(() => {
    // keep reactive form in sync with calendar/time selections
    const d = this.date();
    const t = this.time();
    if (this.form.controls.date.value !== d) this.form.controls.date.setValue(d);
    if (this.form.controls.time.value !== t) this.form.controls.time.setValue(t);
  });

  get f() { return this.form.controls; }

  onSelectDate(d: string){
    this.date.set(d);
    this.time.set(''); // reset time when date changes
  }

  onSelectTime(t: string){
    this.time.set(t);
  }

  onSubmit(){
    if (this.form.invalid || !this.time()) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (!this.booking.isSlotAvailable(value.date!, value.time!)) {
      alert('Esse horário acabou de ficar indisponível. Escolhe outro, por favor.');
      this.time.set('');
      return;
    }
    this.submitting.set(true);
    const created = this.booking.add({
      name: value.name!, phone: value.phone!, email: value.email ?? undefined,
      serviceId: value.serviceId!, date: value.date!, time: value.time!
    });
    this.router.navigate(['/sucesso', created.id]);
  }
}
