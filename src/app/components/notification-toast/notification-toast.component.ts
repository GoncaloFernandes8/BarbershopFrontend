import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (notification of notificationService.notifications$(); track notification.id) {
        <div class="toast" 
             [class.toast-success]="notification.type === 'success'"
             [class.toast-error]="notification.type === 'error'"
             [class.toast-info]="notification.type === 'info'"
             [class.toast-warning]="notification.type === 'warning'"
             [@slideIn]>
          <div class="toast-icon">
            @if (notification.type === 'success') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            }
            @if (notification.type === 'error') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            }
            @if (notification.type === 'info') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            }
            @if (notification.type === 'warning') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            }
          </div>
          <div class="toast-message">{{ notification.message }}</div>
          <button class="toast-close" (click)="notificationService.remove(notification.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast {
      min-width: 320px;
      max-width: 420px;
      padding: 16px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      pointer-events: all;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .toast-success {
      background: linear-gradient(135deg, rgba(195, 255, 90, 0.15), rgba(195, 255, 90, 0.08));
      border-color: rgba(195, 255, 90, 0.3);
      color: #C3FF5A;
    }

    .toast-error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08));
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .toast-info {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
      border-color: rgba(59, 130, 246, 0.3);
      color: #3b82f6;
    }

    .toast-warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.08));
      border-color: rgba(245, 158, 11, 0.3);
      color: #f59e0b;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }

    .toast-icon svg {
      width: 100%;
      height: 100%;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      color: #e9eef7;
    }

    .toast-close {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
      color: currentColor;
    }

    .toast-close:hover {
      opacity: 1;
    }

    .toast-close svg {
      width: 100%;
      height: 100%;
    }

    @media (max-width: 640px) {
      .toast-container {
        top: 60px;
        right: 12px;
        left: 12px;
      }
      
      .toast {
        min-width: unset;
        max-width: unset;
      }
    }
  `]
})
export class NotificationToastComponent {
  notificationService = inject(NotificationService);
}

