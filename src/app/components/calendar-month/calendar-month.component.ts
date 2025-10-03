import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

type DayCell = {
  dateStr: string; // YYYY-MM-DD
  label: number;   // day number
  inMonth: boolean;
  disabled: boolean;
  isToday: boolean;
  selected: boolean;
};

function toDateStr(d: Date): string {
  return d.toISOString().slice(0,10);
}

function parseYYYYMM(ym: string): Date {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m-1, 1);
}

@Component({
  standalone: true,
  selector: 'app-calendar-month',
  imports: [CommonModule, DatePipe],
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.css']
})
export class CalendarMonthComponent {
  /** Month in the format YYYY-MM, e.g. '2025-09' */
  @Input({ required: true }) month!: string;
  /** Selected date as YYYY-MM-DD */
  @Input() selectedDate?: string;
  /** Earliest selectable date (inclusive), default = today */
  @Input() minDate?: string;
  /** Disable Sundays (barbearia encerrada) */
  @Input() disableSundays = true;

  @Output() monthChange = new EventEmitter<string>(); // emits YYYY-MM
  @Output() selectDate = new EventEmitter<string>();  // emits YYYY-MM-DD

  get weeks(): DayCell[][] {
    const first = parseYYYYMM(this.month);
    const firstDay = new Date(first.getFullYear(), first.getMonth(), 1);
    const todayStr = toDateStr(new Date());
    const minDate = this.minDate ?? todayStr;
    const start = new Date(firstDay);
    // Start on Monday
    const jsDay = firstDay.getDay(); // 0=Sun..6=Sat
    const diffToMonday = (jsDay + 6) % 7; // Mon=0, Tue=1,... Sun=6
    start.setDate(firstDay.getDate() - diffToMonday);

    const days: DayCell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = toDateStr(d);
      const isToday = dateStr === todayStr;
      const inMonth = d.getMonth() === first.getMonth();
      const isSunday = d.getDay() === 0;
      const disabled = (this.disableSundays && isSunday) || dateStr < minDate;
      days.push({
        dateStr,
        label: d.getDate(),
        inMonth,
        disabled,
        isToday,
        selected: this.selectedDate === dateStr
      });
    }
    // group by weeks of 7
    const weeks: DayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i+7));
    }
    return weeks;
  }

  prevMonth(){
    const d = parseYYYYMM(this.month);
    d.setMonth(d.getMonth() - 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    this.monthChange.emit(ym);
  }

  nextMonth(){
    const d = parseYYYYMM(this.month);
    d.setMonth(d.getMonth() + 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    this.monthChange.emit(ym);
  }

  select(day: DayCell){
    if (day.disabled) return;
    this.selectDate.emit(day.dateStr);
  }
}
