import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);


// Se tens um interceptor de classe (AuthInterceptor) registado via HTTP_INTERCEPTORS, 
// precisas de withInterceptorsFromDi() para ele ser aplicado.
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptors';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-PT' },
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
}).catch(err => console.error(err));
