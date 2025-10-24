# 🪒 Barbershop Frontend

Frontend da aplicação de agendamento de barbearia desenvolvido em Angular.

## 📋 Funcionalidades

- **Página Inicial**: Apresentação da barbearia com informações sobre serviços
- **Catálogo de Serviços**: Visualização dos serviços disponíveis (corte, barba, etc.)
- **Sistema de Agendamento**: 
  - Seleção de data e horário
  - Escolha do barbeiro
  - Seleção do serviço desejado
- **Histórico de Marcações**: Visualização de agendamentos anteriores
- **Autenticação**: Login e logout de usuários
- **Design Responsivo**: Interface adaptável para mobile e desktop

## 🛠️ Tecnologias

- **Angular 18+** - Framework principal
- **TypeScript** - Linguagem de programação
- **CSS3** - Estilização com design tokens
- **RxJS** - Programação reativa
- **Angular Router** - Navegação entre páginas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
ng serve

# Acessar em http://localhost:4200
```

### Build para Produção
```bash
ng build --configuration production
```

## 📱 Páginas

- **/** - Página inicial
- **/servicos** - Catálogo de serviços
- **/marcacao** - Sistema de agendamento
- **/historico** - Histórico de marcações (requer login)
- **/login** - Autenticação

## 🎨 Design

- **Tema escuro** com acentos em verde neon
- **Interface moderna** com gradientes e blur effects
- **Menu hambúrguer** responsivo
- **Componentes reutilizáveis** com design tokens

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços (auth, booking, etc.)
│   ├── models/        # Interfaces TypeScript
│   └── guards/        # Guards de rota
├── assets/           # Imagens e recursos
└── styles/           # Estilos globais e tokens
```

## 🔧 Configuração

O projeto está configurado para se conectar com a API backend. Certifique-se de que o backend esteja rodando na porta configurada.

## 👨‍💻 Autor

**Gonçalo Fernandes**
- GitHub: [@GoncaloFernandes8](https://github.com/GoncaloFernandes8)
- LinkedIn: [Gonçalo Fernandes](https://www.linkedin.com/in/goncalo-fernandes88/)
- Email: goncalo8fernandes8@gmail.com

## 📄 Licença

Copyright © 2025 Gonçalo Fernandes. Todos os direitos reservados.

Este projeto foi desenvolvido para fins educacionais e de portfólio.