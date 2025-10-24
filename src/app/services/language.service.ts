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
      common: {
        minutes: 'min',
        barber: 'Barbeiro',
        book: 'Marcar',
        book_now: 'Marcar agora',
        view_services: 'Ver serviços',
        loading: 'A carregar...',
        confirming: 'A confirmar…',
        sending: 'A enviar…',
        resending: 'A reenviar…',
        entering: 'A entrar…',
        optional: 'opcional',
        call: 'Ligar',
        whatsapp: 'WhatsApp',
        open_maps: 'Abrir no Maps',
        popular: 'Mais popular'
      },
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
        badge: 'Barbearia',
        hero_title: 'Estilo que fala por si.',
        hero_subtitle: 'Cortes clássicos e modernos, barba no ponto e boa conversa. Marca já a tua hora.',
        schedule_title: 'Horário',
        schedule_hours: 'Seg–Sáb · 09:00–19:00',
        schedule_closed: 'Domingo encerrado',
        contacts_title: 'Contactos',
        professionalism_title: 'Profissionalismo',
        professionalism_desc: 'Experiência e atenção ao detalhe em cada corte.',
        quality_title: 'Produtos de Qualidade',
        quality_desc: 'Usamos marcas premium para cabelo e barba.',
        environment_title: 'Ambiente',
        environment_desc: 'Música, conversa e boa energia na barbearia!',
        barber_eyebrow: 'Conhece o artista',
        barber_blurb: 'Fades precisos, clássicos com personalidade e barba no ponto. 15+ anos a ouvir primeiro e a criar depois — porque o corte tem de falar por ti.',
        barber_years: 'Anos',
        barber_rating: 'Média',
        barber_clients: 'Clientes',
        barber_cta: 'Marca já a tua hora com o João.',
        book_with_joao: 'Marcar com João',
        testimonials_title: 'Avaliações',
        testimonial1: '"O João acertou no corte à primeira. Voltarei!"',
        testimonial2: '"Fade perfeito e barba impecável. Top!"',
        testimonial3: '"Ambiente incrível e atenção ao detalhe."',
        faq_title: 'Perguntas frequentes',
        faq_q1: 'Posso ir sem marcação?',
        faq_a1: 'Recomendamos marcar. Se houver vaga, atendemos walk-in.',
        faq_q2: 'Cancelamentos/tolerâncias?',
        faq_a2: 'Podes cancelar até 2h antes. Há tolerância de 10 min.',
        faq_q3: 'Formas de pagamento?',
        faq_a3: 'MBWay, multibanco e dinheiro.',
        map_title: 'Vem conhecer-nos!!'
      },
      services: {
        title: 'Serviços',
        subtitle: 'Transparência e preços honestos.'
      },
      booking: {
        title: 'Fazer marcação',
        subtitle: 'Escolhe o serviço, o barbeiro e reserva rapidamente no calendário.',
        choose_service: 'Escolhe o serviço',
        choose_barber: 'Escolhe o barbeiro',
        notes_label: 'Notas',
        notes_placeholder: 'Ex.: prefiro degradé, atenção à pele sensível...',
        confirm: 'Confirmar marcação'
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
        login_tab: 'Login',
        register_tab: 'Criar conta',
        resend_verification: 'Reenviar email de verificação',
        email_label: 'Email',
        password_label: 'Palavra-passe',
        name_label: 'Nome',
        phone_label: 'Telemóvel',
        email_error: 'Insere um email válido.',
        password_error: 'Mínimo 6 caracteres.',
        name_error: 'Nome é obrigatório.',
        phone_error: 'Número inválido.',
        login_button: 'Entrar',
        register_button: 'Criar conta',
        already_have_account: 'Já tenho conta',
        show_password: 'Mostrar palavra-passe',
        hide_password: 'Esconder palavra-passe',
        logout_success: 'Sessão terminada. Até breve!',
        to: 'para'
      }
    },
    en: {
      common: {
        minutes: 'min',
        barber: 'Barber',
        book: 'Book',
        book_now: 'Book now',
        view_services: 'View services',
        loading: 'Loading...',
        confirming: 'Confirming…',
        sending: 'Sending…',
        resending: 'Resending…',
        entering: 'Signing in…',
        optional: 'optional',
        call: 'Call',
        whatsapp: 'WhatsApp',
        open_maps: 'Open in Maps',
        popular: 'Most popular'
      },
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
        badge: 'Barbershop',
        hero_title: 'Style that speaks for itself.',
        hero_subtitle: 'Classic and modern cuts, perfect beard and good conversation. Book your time now.',
        schedule_title: 'Schedule',
        schedule_hours: 'Mon–Sat · 09:00–19:00',
        schedule_closed: 'Sunday closed',
        contacts_title: 'Contacts',
        professionalism_title: 'Professionalism',
        professionalism_desc: 'Experience and attention to detail in every cut.',
        quality_title: 'Quality Products',
        quality_desc: 'We use premium brands for hair and beard.',
        environment_title: 'Environment',
        environment_desc: 'Music, conversation and good energy at the barbershop!',
        barber_eyebrow: 'Meet the artist',
        barber_blurb: 'Precise fades, classics with personality and perfect beard. 15+ years of listening first and creating after — because the cut has to speak for you.',
        barber_years: 'Years',
        barber_rating: 'Average',
        barber_clients: 'Clients',
        barber_cta: 'Book your time with João now.',
        book_with_joao: 'Book with João',
        testimonials_title: 'Reviews',
        testimonial1: '"João nailed the cut on the first try. I\'ll be back!"',
        testimonial2: '"Perfect fade and impeccable beard. Top!"',
        testimonial3: '"Amazing atmosphere and attention to detail."',
        faq_title: 'Frequently Asked Questions',
        faq_q1: 'Can I come without an appointment?',
        faq_a1: 'We recommend booking. If available, we accept walk-ins.',
        faq_q2: 'Cancellations/tolerances?',
        faq_a2: 'You can cancel up to 2h before. There is a 10 min tolerance.',
        faq_q3: 'Payment methods?',
        faq_a3: 'MBWay, ATM and cash.',
        map_title: 'Come visit us!!'
      },
      services: {
        title: 'Services',
        subtitle: 'Transparency and honest prices.'
      },
      booking: {
        title: 'Make a booking',
        subtitle: 'Choose the service, the barber and book quickly on the calendar.',
        choose_service: 'Choose the service',
        choose_barber: 'Choose the barber',
        notes_label: 'Notes',
        notes_placeholder: 'E.g.: I prefer fade, sensitive skin attention...',
        confirm: 'Confirm booking'
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
        login_tab: 'Login',
        register_tab: 'Create account',
        resend_verification: 'Resend verification email',
        email_label: 'Email',
        password_label: 'Password',
        name_label: 'Name',
        phone_label: 'Phone',
        email_error: 'Enter a valid email.',
        password_error: 'Minimum 6 characters.',
        name_error: 'Name is required.',
        phone_error: 'Invalid number.',
        login_button: 'Sign in',
        register_button: 'Create account',
        already_have_account: 'Already have an account',
        show_password: 'Show password',
        hide_password: 'Hide password',
        logout_success: 'Session ended. See you soon!',
        to: 'to'
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
