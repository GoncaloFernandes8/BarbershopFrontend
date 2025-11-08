import { Component, inject, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { LanguageService } from './services/language.service';
import { KeepAliveService } from './services/keep-alive.service';
import { filter } from 'rxjs/operators';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationToastComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  year = new Date().getFullYear();
  private router = inject(Router);
  private el = inject(ElementRef<HTMLElement>);
  protected auth = inject(AuthService);
  private notification = inject(NotificationService);
  protected lang = inject(LanguageService);
  private keepAlive = inject(KeepAliveService);

  isAuthPage = false;

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
    // Também fecha o menu via JavaScript
    this.toggleMenu(false);
  }

  // NEW: controla o menu via JavaScript
  toggleMenu(open: boolean) {
    const menu = document.getElementById('nav-menu');
    if (menu) {
      if (open) {
        menu.style.transform = 'translateY(0)';
      } else {
        menu.style.transform = 'translateY(-120%)';
      }
    }
  }

  ngOnInit(): void {
  // Iniciar keep-alive para evitar cold starts no Koyeb
  this.keepAlive.startKeepAlive();

  this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => {
      // fechar menu
      const toggler = this.el.nativeElement.querySelector('#nav-toggle') as HTMLInputElement | null;
      if (toggler) toggler.checked = false;
      this.toggleMenu(false);

      // 👇 NEW: marcar se estamos em /login ou /registar
      const url = this.router.url;
      this.isAuthPage = url.startsWith('/login') || url.startsWith('/registar');
    });

  // NEW: adicionar listener para o checkbox
  setTimeout(() => {
    const toggler = this.el.nativeElement.querySelector('#nav-toggle') as HTMLInputElement | null;
    if (toggler) {
      toggler.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.toggleMenu(target.checked);
      });
    }
  }, 0);
}

  toggleLanguage() {
    this.lang.toggleLanguage();
  }

  logout() {
    // Adicionar classe de animação ao body
    document.body.classList.add('logging-out');
    
    // Mostrar notificação (traduzida)
    this.notification.success(this.lang.t('auth.logout_success'), 3000);
    
    // Aguardar animação antes de fazer logout
    setTimeout(() => {
      this.auth.logout();
      this.router.navigateByUrl('/').then(() => {
        // Remover classe após navegação
        document.body.classList.remove('logging-out');
      });
    }, 600);
  }
}
