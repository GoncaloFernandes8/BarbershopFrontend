import { Component, inject, OnInit, ElementRef } from '@angular/core'; // NEW
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router'; // NEW
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators'; // NEW

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit { // NEW: implements OnInit
  year = new Date().getFullYear();
  private router = inject(Router);
  private el = inject(ElementRef<HTMLElement>); // NEW
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

  // NEW: fecha o menu (usado pelos (click) no HTML)
  closeMenu(toggler?: HTMLInputElement | null) {
    if (toggler) toggler.checked = false;
  }

  // NEW: fecha o menu sempre que a navegação termina
  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const toggler = this.el.nativeElement.querySelector('#nav-toggle') as HTMLInputElement | null;
        if (toggler) toggler.checked = false;
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
    // não precisa fechar aqui — o NavigationEnd já trata
  }
}
