import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = signal<'login'|'register'>('login');
  showPwdLogin = signal(false);
  showPwdReg = signal(false);
  loading = signal(false);
  note = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d[\d\s-]{7,}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(){
  const tabFromData = this.route.snapshot.data['tab'] as 'login'|'register'|undefined;
  if (tabFromData) {
    this.activeTab.set(tabFromData);
  } else {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'register') this.activeTab.set('register');
  }
}

  switch(tab: 'login'|'register'){ this.activeTab.set(tab); this.note.set(null); }

  submitLogin(){
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        if (res.user.status === 'PENDING') {
          this.note.set('Conta criada mas a aguardar aprovação do barbeiro.');
        } else {
          this.router.navigateByUrl('/marcacao');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.note.set(err?.error?.message || 'Credenciais inválidas.');
        this.loading.set(false);
      }
    });
  }

  submitRegister(){
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.auth.register(this.registerForm.getRawValue()).subscribe({
      next: (res) => {
        if (res.requiresEmailVerification) {
          this.note.set('Verifica o teu email para confirmar a conta.');
        } else {
          this.note.set('Registo submetido. Aguardando aprovação do barbeiro.');
        }
        this.activeTab.set('login');
        this.loading.set(false);
      },
      error: (err) => {
        this.note.set(err?.error?.message || 'Não foi possível registar.');
        this.loading.set(false);
      }
    });
  }

  // Getters práticos
  get lf(){ return this.loginForm.controls; }
  get rf(){ return this.registerForm.controls; }
}
