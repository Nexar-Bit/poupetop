# Guia de Testes

Este documento descreve como testar a aplicação PoupeTop em diferentes dispositivos e navegadores.

## 🧪 Testes de Responsividade

### Breakpoints para Testar

#### Mobile (320px - 768px)
- **320px**: Smartphones pequenos (iPhone SE, Galaxy S5)
- **375px**: iPhone padrão (iPhone 12/13/14)
- **425px**: Smartphones grandes (iPhone Plus, Pixel)
- **768px**: Tablets pequenos (iPad Mini)

#### Tablet (768px - 1024px)
- **768px**: iPad em modo retrato
- **1024px**: iPad em modo paisagem

#### Desktop (1024px+)
- **1024px**: Laptops pequenos
- **1440px**: Desktops padrão
- **1920px**: Desktops grandes

### Ferramentas de Teste

#### Chrome DevTools
1. Abra DevTools (F12)
2. Clique no ícone de dispositivo (Ctrl+Shift+M)
3. Selecione dispositivo ou dimensões customizadas
4. Teste em diferentes orientações (portrait/landscape)

#### Firefox Responsive Design Mode
1. Abra DevTools (F12)
2. Clique no ícone de dispositivo
3. Selecione dimensões ou dispositivo pré-configurado

#### Safari Web Inspector
1. Ative "Desenvolver" no menu
2. Conecte dispositivo iOS
3. Use "Inspecionar Elemento" para testar

### Checklist de Responsividade

#### Layout
- [ ] Header fixo funciona em todas as resoluções
- [ ] Banner de anúncio não sobrepõe conteúdo
- [ ] Grid de ofertas adapta colunas corretamente
- [ ] Formulários são legíveis e usáveis
- [ ] Botões têm tamanho adequado para touch

#### Tipografia
- [ ] Texto é legível em todas as resoluções
- [ ] Tamanhos de fonte são apropriados
- [ ] Não há overflow de texto
- [ ] Hierarquia visual é mantida

#### Imagens
- [ ] Imagens carregam corretamente
- [ ] Imagens são responsivas
- [ ] Lazy loading funciona
- [ ] Não há quebra de layout

#### Interações
- [ ] Touch targets são pelo menos 44x44px
- [ ] Swipe funciona no carrossel
- [ ] Pull-to-refresh funciona
- [ ] Scroll é suave

---

## 🌐 Testes de Navegadores

### Navegadores para Testar

#### Desktop
- [ ] **Chrome** (últimas 2 versões)
- [ ] **Firefox** (últimas 2 versões)
- [ ] **Safari** (últimas 2 versões)
- [ ] **Edge** (últimas 2 versões)

#### Mobile
- [ ] **Chrome Android** (últimas 2 versões)
- [ ] **Safari iOS** (últimas 2 versões)
- [ ] **Samsung Internet** (últimas 2 versões)
- [ ] **Firefox Mobile** (últimas 2 versões)

### Funcionalidades por Navegador

#### Service Worker
- [ ] Chrome: Funciona
- [ ] Firefox: Funciona
- [ ] Safari: Funciona (iOS 11.3+)
- [ ] Edge: Funciona

#### Touch Events
- [ ] Todos os navegadores mobile: Funciona
- [ ] Desktop com touchscreen: Funciona

#### Safe Areas (Notched Phones)
- [ ] Safari iOS: Funciona
- [ ] Chrome Android: Funciona

---

## 📱 Testes em Dispositivos Reais

### Dispositivos Recomendados

#### iOS
- iPhone SE (320px)
- iPhone 12/13/14 (375px)
- iPhone 14 Pro Max (428px)
- iPad (768px/1024px)

#### Android
- Galaxy S5 (360px)
- Pixel 5 (393px)
- Galaxy S20 (360px)
- Tablet Android (800px/1024px)

### Checklist de Testes em Dispositivos

#### Performance
- [ ] App carrega rapidamente (< 3s)
- [ ] Animações são suaves (60fps)
- [ ] Não há lag ao rolar
- [ ] Imagens carregam progressivamente

#### Funcionalidades
- [ ] Todas as rotas funcionam
- [ ] Formulários submetem corretamente
- [ ] Upload de arquivos funciona
- [ ] Autocomplete funciona
- [ ] Paginação funciona

#### UX
- [ ] Navegação é intuitiva
- [ ] Feedback visual é claro
- [ ] Mensagens de erro são úteis
- [ ] Loading states são visíveis

---

## 🔍 Testes de Funcionalidades

### Home Page
- [ ] Banner carrossel roda automaticamente
- [ ] Swipe funciona no carrossel
- [ ] Seleção de cidade funciona
- [ ] Cidade é memorizada (se selecionado)
- [ ] Filtro de estabelecimentos aparece após selecionar cidade
- [ ] Busca de estabelecimentos funciona
- [ ] Seleção múltipla de estabelecimentos funciona
- [ ] Grid de ofertas aparece após selecionar cidade
- [ ] Paginação funciona
- [ ] Pull-to-refresh funciona
- [ ] Imagens de ofertas carregam

### Login
- [ ] Validação de email funciona
- [ ] Validação de senha funciona
- [ ] Toggle de visibilidade de senha funciona
- [ ] Link "Esqueceu senha" funciona
- [ ] Link "Voltar" funciona
- [ ] Submissão funciona (mock)

### Cadastro de Estabelecimento
- [ ] Validação de todos os campos funciona
- [ ] Auto-formatação de CNPJ funciona
- [ ] Auto-formatação de telefone funciona
- [ ] Validação de CNPJ funciona
- [ ] Autocomplete de cidade funciona
- [ ] Validação de força de senha funciona
- [ ] Checkbox de termos é obrigatório
- [ ] Submissão funciona (mock)

### Upload de Nota Fiscal
- [ ] Drag & drop funciona
- [ ] Click para selecionar funciona
- [ ] Validação de tipo de arquivo funciona
- [ ] Validação de tamanho funciona
- [ ] Preview de imagem funciona
- [ ] Remoção de arquivo funciona
- [ ] Formulário funciona
- [ ] Formatação de valor funciona
- [ ] Submissão funciona (mock)

### Histórico de Compras
- [ ] Compras são agrupadas por data
- [ ] Headers de data são sticky
- [ ] "Load More" funciona
- [ ] Ícones de categoria aparecem
- [ ] Valores são formatados corretamente

---

## ⚡ Testes de Performance

### Métricas a Verificar

#### Lighthouse
Execute Lighthouse no Chrome DevTools:
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

#### Core Web Vitals
- [ ] **LCP** (Largest Contentful Paint): < 2.5s
- [ ] **FID** (First Input Delay): < 100ms
- [ ] **CLS** (Cumulative Layout Shift): < 0.1

#### Network
- [ ] Initial bundle: < 1MB
- [ ] Gzipped bundle: < 300KB
- [ ] Images otimizadas
- [ ] Lazy loading funciona

### Ferramentas
- Chrome DevTools Performance tab
- Lighthouse
- WebPageTest
- PageSpeed Insights

---

## 🐛 Testes de Bugs Comuns

### Mobile
- [ ] Zoom não acontece ao focar inputs (font-size: 16px)
- [ ] Safe areas funcionam em notched phones
- [ ] Keyboard não quebra layout
- [ ] Scroll funciona suavemente
- [ ] Touch targets são grandes o suficiente

### Cross-browser
- [ ] CSS funciona em todos os navegadores
- [ ] JavaScript funciona em todos os navegadores
- [ ] Service Worker funciona onde suportado
- [ ] Fallbacks funcionam onde necessário

### Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] Screen readers funcionam
- [ ] Contraste de cores é adequado
- [ ] Labels estão presentes

---

## 📊 Relatório de Testes

### Template de Relatório

```
# Relatório de Testes - PoupeTop

**Data**: [DATA]
**Versão**: [VERSÃO]
**Testador**: [NOME]

## Dispositivos Testados
- [Lista de dispositivos]

## Navegadores Testados
- [Lista de navegadores]

## Funcionalidades Testadas
- [Lista de funcionalidades]

## Bugs Encontrados
1. [Descrição do bug]
   - Dispositivo: [DEVICE]
   - Navegador: [BROWSER]
   - Passos para reproduzir: [STEPS]
   - Screenshot: [LINK]

## Performance
- Lighthouse Score: [SCORE]
- LCP: [TIME]
- FID: [TIME]
- CLS: [SCORE]

## Observações
[NOTAS ADICIONAIS]
```

---

## 🛠️ Ferramentas Recomendadas

### Desktop
- Chrome DevTools
- Firefox DevTools
- Safari Web Inspector
- BrowserStack (testes em múltiplos navegadores)

### Mobile
- Chrome Remote Debugging
- Safari Web Inspector
- Responsively App
- BrowserStack Mobile

### Performance
- Lighthouse
- WebPageTest
- PageSpeed Insights
- Chrome Performance Profiler

---

## ✅ Checklist Final

Antes de considerar os testes completos:

- [ ] Testado em pelo menos 3 navegadores desktop
- [ ] Testado em pelo menos 3 navegadores mobile
- [ ] Testado em pelo menos 5 tamanhos de tela diferentes
- [ ] Todas as funcionalidades principais testadas
- [ ] Performance verificada (Lighthouse > 90)
- [ ] Acessibilidade verificada
- [ ] Nenhum bug crítico encontrado
- [ ] Documentação de bugs criada (se houver)

