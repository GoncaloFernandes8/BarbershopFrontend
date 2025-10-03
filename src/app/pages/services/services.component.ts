import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SERVICE_TYPES } from '../../models/service-type.model';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-services',
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html'
})
export class ServicesComponent {
  services = SERVICE_TYPES;
}
