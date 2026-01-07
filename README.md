# PoupeTop

PoupeTop é uma aplicação web Angular 17 para gerenciamento de ofertas e descontos, permitindo que estabelecimentos cadastrem ofertas e clientes encontrem as melhores promoções em sua cidade.

## 🚀 Tecnologias

- **Angular 17** - Framework principal
- **Angular Material 17** - Componentes UI
- **RxJS** - Programação reativa
- **Swiper.js** - Carrossel de banners
- **Service Worker** - Cache e PWA
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- Angular CLI 17.x (instalado globalmente ou via npx)

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd poupetop
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Acesse a aplicação**
   - Abra seu navegador em `http://localhost:4200`

## 📁 Estrutura do Projeto

```
src/app/
├── core/                    # Serviços e funcionalidades core
│   ├── guards/             # Route guards
│   └── services/           # Serviços HTTP e lógica de negócio
│       ├── banner.service.ts
│       ├── city.service.ts
│       ├── establishment.service.ts
│       ├── offer.service.ts
│       ├── purchase.service.ts
│       └── in-memory-data.service.ts
├── shared/                  # Componentes e recursos compartilhados
│   ├── components/
│   │   ├── header/
│   │   ├── announcement-banner/
│   │   ├── city-selector/
│   │   ├── establishment-filter/
│   │   ├── offers-grid/
│   │   └── skeleton/
│   └── pipes/              # Pipes customizados
├── features/                # Módulos de funcionalidades
│   ├── home/
│   │   ├── banner-carousel/
│   │   └── home.component.ts
│   ├── login/
│   ├── establishment-signup/
│   ├── receipt-upload/
│   └── purchases/
├── models/                  # Interfaces TypeScript
│   └── index.ts
├── app.component.ts         # Componente raiz
├── app.config.ts           # Configuração da aplicação
└── app.routes.ts           # Definição de rotas
```

## 🎯 Funcionalidades

### Página Inicial
- **Carrossel de Banners**: Exibe banners promocionais com rotação automática
- **Seleção de Cidade**: Autocomplete para selecionar cidade com opção de memorizar
- **Filtro de Estabelecimentos**: Lista de estabelecimentos com busca e seleção múltipla
- **Grid de Ofertas**: Exibe ofertas em grid responsivo com paginação
- **Histórico de Compras**: Lista de compras agrupadas por data

### Autenticação
- **Login**: Formulário de login com validação
- **Recuperação de Senha**: Link para recuperação (página futura)

### Cadastro
- **Cadastro de Estabelecimento**: Formulário completo com validação de CNPJ
- **Upload de Nota Fiscal**: Upload de arquivos com drag & drop

## 🏗️ Build

### Desenvolvimento
```bash
npm run build
```

### Produção
```bash
npm run build -- --configuration production
```

O build de produção gera:
- Arquivos otimizados e minificados
- Service Worker para cache
- Lazy loading de rotas
- Code splitting otimizado

## 🧪 Testes

```bash
npm test
```

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Breakpoints
- `320px` - Smartphones pequenos
- `375px` - iPhone padrão
- `425px` - Smartphones grandes
- `768px` - Tablets

## ⚡ Performance

### Otimizações Implementadas
- ✅ Lazy loading de rotas
- ✅ OnPush change detection
- ✅ Image lazy loading
- ✅ Service Worker para cache
- ✅ Code splitting
- ✅ Bundle optimization
- ✅ Memory leak prevention
- ✅ Loading skeletons

### Métricas
- **Initial Bundle**: ~764 KB (178 KB gzipped)
- **Lazy Chunks**: Carregados sob demanda
- **First Contentful Paint**: Otimizado com skeletons

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Service Worker
O Service Worker está configurado em `ngsw-config.json` e é habilitado automaticamente em builds de produção.

## 🚀 Deploy

### Build para Produção
```bash
npm run build -- --configuration production
```

### Deploy no Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Deploy no Netlify
1. Conecte seu repositório ao Netlify
2. Configure o build command: `npm run build -- --configuration production`
3. Configure o publish directory: `dist/poupetop/browser`

### Deploy no Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📚 Documentação Adicional

- [Documentação de Componentes](./docs/COMPONENTS.md)
- [Documentação de Serviços](./docs/SERVICES.md)
- [Guia de Build e Deploy](./docs/DEPLOYMENT.md)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- Equipe PoupeTop

## 📞 Suporte

Para suporte, envie um email para suporte@poupetop.com ou abra uma issue no repositório.
