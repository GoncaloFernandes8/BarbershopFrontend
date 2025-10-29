import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css'
})
export class SetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  token: string | null = null;
  loading = false;
  success = false;
  error = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.error = true;
      this.errorMessage = 'Token inválido ou ausente.';
    }
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.passwordForm.valid && this.token) {
      this.loading = true;
      this.error = false;

      const payload = {
        token: this.token,
        password: this.passwordForm.value.password
      };

      this.http.post(`${environment.apiUrl}/clients/set-password`, payload)
        .subscribe({
          next: (response: any) => {
            this.loading = false;
            if (response.success) {
              this.success = true;
              // Redirecionar para login após 3 segundos
              setTimeout(() => {
                this.router.navigate(['/auth']);
              }, 3000);
            } else {
              this.error = true;
              this.errorMessage = response.message || 'Erro ao definir senha.';
            }
          },
          error: (err) => {
            this.loading = false;
            this.error = true;
            this.errorMessage = err.error?.message || 'Erro ao definir senha. O link pode ter expirado.';
          }
        });
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }
}

