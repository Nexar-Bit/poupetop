# Guia de Build e Deploy

Este guia descreve como fazer build e deploy da aplicação PoupeTop.

## 📦 Build de Produção

### Pré-requisitos
- Node.js 18.x ou superior
- npm 9.x ou superior
- Todas as dependências instaladas (`npm install`)

### Build Local

```bash
npm run build -- --configuration production
```

O build será gerado em `dist/poupetop/browser/`

### Verificar Build Localmente

```bash
# Instalar servidor HTTP simples
npm install -g http-server

# Servir o build
cd dist/poupetop/browser
http-server -p 8080 -c-1
```

Acesse `http://localhost:8080` para testar o build.

---

## 🚀 Deploy

### Firebase Hosting

#### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Login
```bash
firebase login
```

#### 3. Inicializar Projeto
```bash
firebase init hosting
```

**Configurações**:
- Public directory: `dist/poupetop/browser`
- Single-page app: `Yes`
- Automatic builds: `No` (ou configure GitHub Actions)

#### 4. Deploy
```bash
npm run build -- --configuration production
firebase deploy --only hosting
```

#### 5. Configurar Firebase (firebase.json)
```json
{
  "hosting": {
    "public": "dist/poupetop/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "ngsw-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

---

### Netlify

#### 1. Via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
```

**Configurações**:
- Build command: `npm run build -- --configuration production`
- Publish directory: `dist/poupetop/browser`

#### 2. Via Netlify Dashboard
1. Conecte seu repositório GitHub/GitLab
2. Configure:
   - **Build command**: `npm run build -- --configuration production`
   - **Publish directory**: `dist/poupetop/browser`
3. Deploy automático a cada push

#### 3. Arquivo netlify.toml (opcional)
```toml
[build]
  command = "npm run build -- --configuration production"
  publish = "dist/poupetop/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### Vercel

#### 1. Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### 2. Via Vercel Dashboard
1. Importe seu repositório
2. Configure:
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build -- --configuration production`
   - **Output Directory**: `dist/poupetop/browser`
3. Deploy

#### 3. Arquivo vercel.json (opcional)
```json
{
  "buildCommand": "npm run build -- --configuration production",
  "outputDirectory": "dist/poupetop/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### GitHub Pages

#### 1. Configurar angular.json
```json
"outputPath": "dist/poupetop/browser",
"baseHref": "/poupetop/"
```

#### 2. Build
```bash
npm run build -- --configuration production --base-href=/poupetop/
```

#### 3. Deploy via GitHub Actions
Crie `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build -- --configuration production --base-href=/poupetop/
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/poupetop/browser
```

---

### Docker

#### 1. Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist/poupetop/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. nginx.conf
```nginx
server {
  listen 80;
  server_name localhost;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

#### 3. Build e Run
```bash
docker build -t poupetop .
docker run -p 80:80 poupetop
```

---

## 🔧 Variáveis de Ambiente

### Desenvolvimento
Crie `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Produção
Crie `src/environments/environment.production.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.poupetop.com'
};
```

### Usar no Serviço
```typescript
import { environment } from '../environments/environment';

private apiUrl = environment.apiUrl;
```

---

## ✅ Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Build de produção executa sem erros
- [ ] Service Worker está funcionando
- [ ] Todas as rotas funcionam (teste navegação)
- [ ] Imagens carregam corretamente
- [ ] API está configurada (se aplicável)
- [ ] Variáveis de ambiente estão configuradas
- [ ] HTTPS está habilitado (obrigatório para Service Worker)
- [ ] Testado em diferentes navegadores
- [ ] Testado em diferentes tamanhos de tela
- [ ] Performance está otimizada (Lighthouse)

---

## 🧪 Testes Pós-Deploy

### 1. Testar Funcionalidades
- [ ] Home page carrega
- [ ] Seleção de cidade funciona
- [ ] Filtro de estabelecimentos funciona
- [ ] Grid de ofertas exibe dados
- [ ] Paginação funciona
- [ ] Login funciona
- [ ] Cadastro de estabelecimento funciona
- [ ] Upload de nota fiscal funciona

### 2. Testar Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size dentro dos limites

### 3. Testar Responsividade
- [ ] Mobile (320px, 375px, 425px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

### 4. Testar Service Worker
- [ ] App funciona offline (após primeiro carregamento)
- [ ] Cache está funcionando
- [ ] Atualizações são detectadas

---

## 🔄 Atualizações

### Atualizar Aplicação
1. Fazer alterações no código
2. Testar localmente
3. Commit e push
4. Deploy automático (se configurado) ou manual

### Forçar Atualização do Service Worker
O Service Worker atualiza automaticamente quando detecta mudanças. Para forçar:
1. Atualizar `ngsw-config.json`
2. Fazer novo build
3. Deploy

---

## 📊 Monitoramento

### Firebase Analytics
```typescript
// Adicionar ao app.config.ts
import { provideAnalytics } from '@angular/fire/analytics';

providers: [
  // ...
  provideAnalytics(() => getAnalytics())
]
```

### Error Tracking
Considere integrar:
- Sentry
- LogRocket
- Firebase Crashlytics

---

## 🆘 Troubleshooting

### Service Worker não funciona
- Verificar se HTTPS está habilitado
- Verificar se `ngsw-config.json` está no build
- Verificar console do navegador para erros

### Rotas não funcionam
- Verificar configuração de rewrites/redirects
- Verificar `baseHref` se usando subdiretório

### API não funciona
- Verificar CORS no servidor
- Verificar variáveis de ambiente
- Verificar se InMemoryWebApi está desabilitado em produção

---

## 📚 Recursos Adicionais

- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Service Worker Guide](https://angular.io/guide/service-worker-intro)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)

