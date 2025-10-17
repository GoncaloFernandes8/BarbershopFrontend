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
  private notifications: string[] = [];
  
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
        // Mapear códigos de status HTTP com mensagens mais amigáveis
        switch (error.status) {
          case 0:
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            break;
          case 400:
            errorMessage = 'Dados inválidos. Verifique as informações inseridas.';
            break;
          case 401:
            errorMessage = 'Sessão expirada. Faça login novamente.';
            break;
          case 403:
            errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
          case 409:
            errorMessage = 'Conflito de dados. Esta informação já existe.';
            break;
          case 422:
            errorMessage = 'Dados de validação inválidos. Verifique os campos destacados.';
            break;
          case 429:
            errorMessage = 'Muitas tentativas. Aguarde um momento e tente novamente.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
            break;
          case 503:
            errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
            break;
          default:
            if (error.status >= 500) {
              errorMessage = 'Erro do servidor. Tente novamente mais tarde.';
            } else if (error.status >= 400) {
              errorMessage = 'Erro na requisição. Verifique os dados e tente novamente.';
            } else {
              errorMessage = `Erro ${error.status}: ${error.statusText}`;
            }
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

  // Métodos para notificações visuais
  showError(message: string): void {
    this.showNotification(message, 'error');
  }

  showSuccess(message: string): void {
    this.showNotification(message, 'success');
  }

  showWarning(message: string): void {
    this.showNotification(message, 'warning');
  }

  showInfo(message: string): void {
    this.showNotification(message, 'info');
  }

  private showNotification(message: string, type: 'error' | 'success' | 'warning' | 'info'): void {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para garantir que funcione
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '9999',
      maxWidth: '400px',
      wordWrap: 'break-word',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    // Cores baseadas no tipo
    const colors = {
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type];

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remover após 5 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  getNotifications(): string[] {
    return [...this.notifications];
  }

  clearNotifications(): void {
    this.notifications = [];
  }
}
