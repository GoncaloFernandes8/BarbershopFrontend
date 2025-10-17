import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Armazena dados no cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiry = ttl || this.DEFAULT_TTL;
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + expiry
    });
  }

  /**
   * Recupera dados do cache se ainda válidos
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Remove item específico do cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Verifica se uma chave existe no cache e ainda é válida
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Obtém ou executa uma função e armazena o resultado no cache
   */
  getOrSet<T>(key: string, factory: () => Observable<T>, ttl?: number): Observable<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return of(cached);
    }

    return factory().pipe(
      tap(data => this.set(key, data, ttl))
    );
  }

  /**
   * Limpa itens expirados do cache
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

/**
 * Decorator para cache automático de métodos de serviço
 */
export function Cached(ttl?: number) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cacheKeyPrefix = `${target.constructor.name}.${propertyName}`;

    descriptor.value = function (...args: any[]) {
      const cacheService = new CacheService();
      const cacheKey = `${cacheKeyPrefix}.${JSON.stringify(args)}`;
      
      return cacheService.getOrSet(cacheKey, () => method.apply(this, args), ttl);
    };

    return descriptor;
  };
}
