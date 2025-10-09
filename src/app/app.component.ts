import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html'
})
export class AppComponent {
  year = new Date().getFullYear();
  private router = inject(Router);
  protected auth = inject(AuthService);

  // já tinhas:
  get isLoggedIn(): boolean {
    return !!this.auth.user;
  }
  get userName(): string {
    return this.auth.user?.name ?? '';
  }

  // novo: só true na home
  get isHome(): boolean {
    // cobre "/" e "/" com query params
    return this.router.url === '/' || this.router.url.startsWith('/?');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
