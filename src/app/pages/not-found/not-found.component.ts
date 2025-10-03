import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {}
