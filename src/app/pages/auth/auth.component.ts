import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { LanguageService } from '../../services/language.service';

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationService);
  protected lang = inject(LanguageService);

  // já tens: import { Component, inject, signal } from '@angular/core';
  pendingEmail = signal<string | null>(null);
  resending = signal(false);

  activeTab = signal<'login'|'register'>('login');
  showPwdLogin = signal(false);
  showPwdReg = signal(false);
  loading = signal(false);
  note = signal<string | null>(null);
  
  // Forgot password
  showForgotPasswordModal = signal(false);
  forgotPasswordEmail = signal('');
  sendingResetEmail = signal(false);

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

  ngOnInit() {
    const tabFromData = this.route.snapshot.data['tab'] as 'login'|'register'|undefined;
    if (tabFromData) this.activeTab.set(tabFromData);
    else if (this.route.snapshot.queryParamMap.get('tab') === 'register') this.activeTab.set('register');
  }

  switch(tab: 'login'|'register'){ this.activeTab.set(tab); this.note.set(null); }

  submitLogin(){
  if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
  this.loading.set(true);
  const { email, password } = this.loginForm.getRawValue();
  this.auth.login({ email, password }).subscribe({
    next: () => { 
      this.loading.set(false); 
      this.notification.success('Login efetuado com sucesso!');
      this.router.navigateByUrl('/marcacao'); 
    },
    error: (err) => {
      this.loading.set(false);
      this.notification.error(err?.error?.message ?? 'Credenciais inválidas.');
    }
  });
}


resendVerification(){
  const email = this.pendingEmail();
  if (!email) return;

  this.resending.set(true);
  this.auth.resendVerification(email).subscribe({
    next: () => {
      this.resending.set(false);
      this.notification.success('Reenviámos o email de verificação. Verifica a tua caixa de entrada.');
    },
    error: () => {
      this.resending.set(false);
      this.notification.error('Não foi possível reenviar agora. Tenta mais tarde.');
    }
  });
}



  submitRegister(){
  if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
  this.loading.set(true);
  this.auth.register(this.registerForm.getRawValue()).subscribe({
    next: () => {
      this.notification.success('Enviámos um email de confirmação. Abre o link para concluir o registo.', 6000);
      this.activeTab.set('login');
      this.loading.set(false);
    },
    error: (err) => {
      this.notification.error(err?.error?.message || 'Não foi possível registar.');
      this.loading.set(false);
    }
  });
}

  

  openForgotPasswordModal() {
    this.showForgotPasswordModal.set(true);
    this.forgotPasswordEmail.set('');
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal.set(false);
    this.forgotPasswordEmail.set('');
  }

  sendResetEmail() {
    const email = this.forgotPasswordEmail().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.notification.error('Por favor, insere um email válido.');
      return;
    }

    this.sendingResetEmail.set(true);
    this.auth.forgotPassword(email).subscribe({
      next: (res) => {
        this.sendingResetEmail.set(false);
        this.closeForgotPasswordModal();
        this.notification.success(res.message || 'Enviámos instruções para o teu email.', 6000);
      },
      error: () => {
        this.sendingResetEmail.set(false);
        this.notification.error('Não foi possível enviar o email. Tenta novamente.');
      }
    });
  }

  get lf(){ return this.loginForm.controls; }
  get rf(){ return this.registerForm.controls; }
}
