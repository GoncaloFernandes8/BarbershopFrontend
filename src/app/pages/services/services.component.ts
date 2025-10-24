import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService, ServiceDto } from '../../services/booking.service';
import { LanguageService } from '../../services/language.service';

@Component({
  standalone: true,
  selector: 'app-services',
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  private api = inject(BookingService);
  protected lang = inject(LanguageService);

  services = signal<ServiceDto[]>([]);

  ngOnInit(): void {
    this.api.getServices().subscribe(list => {
      // só ativos, ordena por nome
      const active = list.filter(s => s.active);
      active.sort((a, b) => a.name.localeCompare(b.name, 'pt-PT'));
      this.services.set(active);
    });
  }

  trackById = (_: number, item: ServiceDto) => item.id;

  getServiceImg(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('corte e barba')) return 'assets/services/corte-barba.png';
    if (n.includes('barba'))          return 'assets/services/barba.png';
    if (n.includes('crian'))          return 'assets/services/crianca.png';
    if (n.includes('corte'))          return 'assets/services/corte.png';
    return 'assets/services/servico.png';
  }

  // descrição simples (o teu /services não tem description)
  getDesc(s: ServiceDto): string {
    const n = s.name.toLowerCase();
    if (n.includes('corte e barba')) return 'Pacote completo: cabelo e barba.';
    if (n.includes('barba'))         return 'Acerto e contorno da barba.';
    if (n.includes('crian'))         return 'Corte para os mais novos.';
    return 'Clássico, fade ou máquina.';
  }

  euros(cents: number): number {
    return Math.round(cents) / 100;
  }
}
