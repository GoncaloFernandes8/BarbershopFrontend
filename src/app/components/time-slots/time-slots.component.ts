import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

type SlotItem = { iso: string; date: Date };

@Component({
  standalone: true,
  selector: 'app-time-slots',
  imports: [CommonModule, DatePipe],
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.css']
})
export class TimeSlotsComponent implements OnChanges {
  /** Dia selecionado no formato YYYY-MM-DD */
  @Input({ required: true }) date!: string;

  /**
   * Lista de inícios vindos do backend.
   * Aceita ISO completo (ex.: "2025-10-17T09:00:00+01:00")
   * ou apenas "HH:mm" (ex.: "09:00").
   */
  @Input({ required: true }) slots!: string[];

  @Input() loading = false;

  /** Valor selecionado (ISO original) */
  @Input() selected?: string;

  /** Locale e timezone */
  @Input() locale = 'pt-PT';
  @Input() timezone = 'Europe/Lisbon';

  @Output() select = new EventEmitter<string>();

  /** Items prontos para render: Date válido + o ISO original */
  slotItems: SlotItem[] = [];

  /** Date seguro para o cabeçalho (meio-dia evita edge cases de DST) */
  get dateObj(): Date {
    return new Date(`${this.date}T12:00:00`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slots'] || changes['date']) {
      this.slotItems = (this.slots ?? []).map(s => {
        // tenta parse ISO
        let d = new Date(s);
        // se for inválido (ex.: "09:00"), monta com a data do dia
        if (isNaN(d.getTime())) d = new Date(`${this.date}T${s}:00`);
        return { iso: s, date: d };
      });
    }
  }

  onPick(iso: string) {
    this.select.emit(iso); // emite o original que recebeste do backend
  }
}
