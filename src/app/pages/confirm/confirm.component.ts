import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-confirm',
  imports: [CommonModule, RouterLink],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  loading = signal(true);
  ok = signal<boolean | null>(null);
  msg = signal<string>('A confirmar…');

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading.set(false);
      this.ok.set(false);
      this.msg.set('Ligação inválida: falta o token.');
      return;
    }
    this.auth.verifyEmail(token).subscribe({
      next: res => {
        this.loading.set(false);
        this.ok.set(res.verified);
        this.msg.set(res.verified ? 'Email confirmado! Já podes iniciar sessão.' : (res.message ?? 'Não foi possível confirmar.'));
      },
      error: err => {
        this.loading.set(false);
        this.ok.set(false);
        this.msg.set(err?.error?.message ?? 'Token inválido ou expirado.');
      }
    });
  }
}
