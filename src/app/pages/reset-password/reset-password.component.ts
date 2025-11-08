import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private notification = inject(NotificationService);

  token = signal<string | null>(null);
  loading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  ngOnInit() {
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (!tokenParam) {
      this.notification.error('Link inválido. Solicita um novo reset de password.');
      this.router.navigate(['/login']);
      return;
    }
    this.token.set(tokenParam);
  }

  get passwordStrength(): 'weak' | 'medium' | 'strong' | null {
    const pwd = this.form.controls.password.value;
    if (!pwd || pwd.length < 6) return null;
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  }

  get passwordsMatch(): boolean {
    const pwd = this.form.controls.password.value;
    const confirm = this.form.controls.confirmPassword.value;
    return pwd === confirm && pwd.length > 0;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const pwd = this.form.controls.password.value;
    const confirm = this.form.controls.confirmPassword.value;

    if (pwd !== confirm) {
      this.notification.error('As passwords não coincidem.');
      return;
    }

    const token = this.token();
    if (!token) {
      this.notification.error('Token inválido.');
      return;
    }

    this.loading.set(true);
    this.auth.resetPassword(token, pwd).subscribe({
      next: () => {
        this.loading.set(false);
        this.notification.success('Password redefinida com sucesso! Podes agora fazer login.', 5000);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.notification.error(err?.error?.message || 'Não foi possível redefinir a password. O link pode ter expirado.');
      }
    });
  }

  get f() { return this.form.controls; }
}

