import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ApiError {
  error: string;
  message: string;
  fieldErrors?: { [key: string]: string };
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado.';
    let fieldErrors: { [key: string]: string } | undefined;

    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = error.error.message;
    } else {
      // Erro do servidor
      const apiError = error.error as ApiError;
      
      if (apiError) {
        errorMessage = apiError.message || errorMessage;
        fieldErrors = apiError.fieldErrors;
      } else {
        // Mapear códigos de status HTTP
        switch (error.status) {
          case 400:
            errorMessage = 'Dados inválidos.';
            break;
          case 401:
            errorMessage = 'Não autorizado.';
            break;
          case 403:
            errorMessage = 'Acesso negado.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
          case 409:
            errorMessage = 'Conflito de dados.';
            break;
          case 422:
            errorMessage = 'Dados de validação inválidos.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor.';
            break;
          default:
            errorMessage = `Erro ${error.status}: ${error.statusText}`;
        }
      }
    }

    const enhancedError = new HttpErrorResponse({
      error: { message: errorMessage, fieldErrors },
      status: error.status,
      statusText: error.statusText
    });

    return throwError(() => enhancedError);
  }

  getFieldError(fieldErrors: { [key: string]: string } | undefined, fieldName: string): string | null {
    return fieldErrors?.[fieldName] || null;
  }

  hasFieldErrors(fieldErrors: { [key: string]: string } | undefined): boolean {
    return fieldErrors ? Object.keys(fieldErrors).length > 0 : false;
  }
}
