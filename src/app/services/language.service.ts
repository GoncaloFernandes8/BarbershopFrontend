import { Injectable, signal } from '@angular/core';

export type Language = 'pt' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'barbershop-language';
  
  // Signal para reatividade
  currentLanguage = signal<Language>(this.getInitialLanguage());
  
  private translations: Record<Language, Translations> = {
    pt: {
      nav: {
        home: 'Início',
        services: 'Serviços',
        booking: 'Marcação',
        history: 'Histórico',
        login: 'Login',
        logout: 'Sair'
      },
      footer: {
        address: 'Rua Principal, 123',
        developed: 'Desenvolvido por Gonçalo Fernandes'
      },
      home: {
        hero: {
          title: 'Bem-vindo à Barbearia',
          subtitle: 'Estilo e tradição em cada corte',
          cta: 'Marcar Agora'
        },
        features: {
          professionalism: 'Profissionalismo',
          professionalism_desc: 'Barbeiros experientes com mais de 15 anos',
          quality: 'Produtos de Qualidade',
          quality_desc: 'Usamos apenas produtos premium',
          environment: 'Ambiente',
          environment_desc: 'Espaço moderno e confortável'
        },
        testimonials: {
          title: 'Avaliações'
        },
        faq: {
          title: 'Perguntas frequentes',
          q1: 'Posso ir sem marcação?',
          a1: 'Recomendamos marcar. Se houver vaga, atendemos walk-in.',
          q2: 'Cancelamentos/tolerâncias?',
          a2: 'Podes cancelar até 2h antes. Há tolerância de 10 min.',
          q3: 'Formas de pagamento?',
          a3: 'MBWay, multibanco e dinheiro.'
        },
        map: {
          title: 'Vem conhecer-nos!!'
        }
      },
      services: {
        title: 'Serviços',
        subtitle: 'Escolha o serviço ideal para si',
        book: 'Marcar'
      },
      booking: {
        title: 'Marcação',
        subtitle: 'Agende o seu corte',
        service: 'Serviço',
        barber: 'Barbeiro',
        date: 'Data',
        time: 'Hora',
        notes: 'Observações',
        submit: 'Confirmar Marcação',
        login_required: 'É necessário fazer login para marcar',
        success: 'Marcação criada com sucesso!',
        error: 'Erro ao criar marcação'
      },
      history: {
        title: 'Histórico de Marcações',
        subtitle: 'Todas as suas marcações anteriores',
        empty: 'Ainda não tem marcações',
        empty_desc: 'Faça a sua primeira marcação para ver o histórico aqui.',
        refresh: 'Atualizar',
        new: 'Nova Marcação',
        first: 'Fazer Primeira Marcação',
        service: 'Serviço:',
        barber: 'Barbeiro:',
        duration: 'Duração:',
        notes: 'Notas:',
        edit: 'Editar',
        cancel: 'Cancelar',
        summary: 'Resumo',
        total: 'Total de Marcações',
        completed: 'Concluídas',
        upcoming: 'Próximas',
        loading: 'A carregar histórico...'
      },
      auth: {
        login: 'Entrar',
        register: 'Registar',
        name: 'Nome',
        email: 'Email',
        password: 'Palavra-passe',
        phone: 'Telefone',
        logout_success: 'Sessão terminada. Até breve!'
      }
    },
    en: {
      nav: {
        home: 'Home',
        services: 'Services',
        booking: 'Booking',
        history: 'History',
        login: 'Login',
        logout: 'Logout'
      },
      footer: {
        address: 'Main Street, 123',
        developed: 'Developed by Gonçalo Fernandes'
      },
      home: {
        hero: {
          title: 'Welcome to Barbershop',
          subtitle: 'Style and tradition in every cut',
          cta: 'Book Now'
        },
        features: {
          professionalism: 'Professionalism',
          professionalism_desc: 'Experienced barbers with over 15 years',
          quality: 'Quality Products',
          quality_desc: 'We only use premium products',
          environment: 'Environment',
          environment_desc: 'Modern and comfortable space'
        },
        testimonials: {
          title: 'Reviews'
        },
        faq: {
          title: 'Frequently Asked Questions',
          q1: 'Can I come without an appointment?',
          a1: 'We recommend booking. If available, we accept walk-ins.',
          q2: 'Cancellations/tolerances?',
          a2: 'You can cancel up to 2h before. There is a 10 min tolerance.',
          q3: 'Payment methods?',
          a3: 'MBWay, ATM and cash.'
        },
        map: {
          title: 'Come visit us!!'
        }
      },
      services: {
        title: 'Services',
        subtitle: 'Choose the perfect service for you',
        book: 'Book'
      },
      booking: {
        title: 'Booking',
        subtitle: 'Schedule your haircut',
        service: 'Service',
        barber: 'Barber',
        date: 'Date',
        time: 'Time',
        notes: 'Notes',
        submit: 'Confirm Booking',
        login_required: 'You need to login to book',
        success: 'Booking created successfully!',
        error: 'Error creating booking'
      },
      history: {
        title: 'Booking History',
        subtitle: 'All your previous bookings',
        empty: 'No bookings yet',
        empty_desc: 'Make your first booking to see history here.',
        refresh: 'Refresh',
        new: 'New Booking',
        first: 'Make First Booking',
        service: 'Service:',
        barber: 'Barber:',
        duration: 'Duration:',
        notes: 'Notes:',
        edit: 'Edit',
        cancel: 'Cancel',
        summary: 'Summary',
        total: 'Total Bookings',
        completed: 'Completed',
        upcoming: 'Upcoming',
        loading: 'Loading history...'
      },
      auth: {
        login: 'Login',
        register: 'Register',
        name: 'Name',
        email: 'Email',
        password: 'Password',
        phone: 'Phone',
        logout_success: 'Session ended. See you soon!'
      }
    }
  };

  constructor() {
    // Carregar idioma do localStorage se existir
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') {
      this.currentLanguage.set(saved);
    }
  }

  private getInitialLanguage(): Language {
    // Tentar localStorage primeiro
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') {
      return saved;
    }

    // Detectar idioma do browser
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('pt') ? 'pt' : 'en';
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  translate(key: string): string {
    const lang = this.currentLanguage();
    const keys = key.split('.');
    let value: any = this.translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Retornar a chave se não encontrar tradução
      }
    }

    return typeof value === 'string' ? value : key;
  }

  // Atalho para usar no template
  t(key: string): string {
    return this.translate(key);
  }

  toggleLanguage() {
    const current = this.currentLanguage();
    this.setLanguage(current === 'pt' ? 'en' : 'pt');
  }
}

