import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-time-slots',
  imports: [CommonModule, DatePipe],
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.css']
})
export class TimeSlotsComponent {
  @Input({ required: true }) date!: string; // YYYY-MM-DD
  @Input({ required: true }) slots!: string[];
  @Input() selected?: string;

  @Output() select = new EventEmitter<string>();

  onPick(t: string){
    this.select.emit(t);
  }
}
