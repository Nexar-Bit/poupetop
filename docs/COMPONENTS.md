# Documentação de Componentes

Este documento descreve todos os componentes da aplicação PoupeTop.

## Componentes Compartilhados (Shared)

### HeaderComponent
**Localização**: `src/app/shared/components/header/`

**Descrição**: Cabeçalho fixo da aplicação com logo e botão de login.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**:
```html
<app-header></app-header>
```

**Características**:
- Posição fixa no topo
- Altura: 60px
- Responsivo com safe areas
- Navegação para `/login`

---

### AnnouncementBannerComponent
**Localização**: `src/app/shared/components/announcement-banner/`

**Descrição**: Banner de anúncio abaixo do header com link para cadastro de estabelecimento.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**:
```html
<app-announcement-banner></app-announcement-banner>
```

**Características**:
- Fundo azul claro (#e3f2fd)
- Link clicável para `/establishment-signup`
- Posicionado abaixo do header fixo

---

### CitySelectorComponent
**Localização**: `src/app/shared/components/city-selector/`

**Descrição**: Componente de seleção de cidade com autocomplete e opção de memorizar.

**Props/Inputs**: Nenhum

**Outputs**:
- `citySelected: EventEmitter<City>` - Emite quando uma cidade é selecionada

**Uso**:
```html
<app-city-selector (citySelected)="onCitySelected($event)"></app-city-selector>
```

**Características**:
- Autocomplete com debounce de 300ms
- Checkbox para memorizar cidade no localStorage
- Carrega cidade salva ao inicializar
- Validação de entrada mínima (2 caracteres)

**Métodos Públicos**: Nenhum

---

### EstablishmentFilterComponent
**Localização**: `src/app/shared/components/establishment-filter/`

**Descrição**: Filtro de estabelecimentos com busca e seleção múltipla.

**Props/Inputs**:
- `cityId: number | null` - ID da cidade selecionada

**Outputs**:
- `establishmentsSelected: EventEmitter<number[]>` - Emite array de IDs selecionados

**Uso**:
```html
<app-establishment-filter
  [cityId]="selectedCityId"
  (establishmentsSelected)="onEstablishmentSelected($event)">
</app-establishment-filter>
```

**Características**:
- Busca com autocomplete
- Seleção múltipla com checkboxes
- Virtual scrolling para performance
- Filtragem em tempo real
- Visual feedback para itens selecionados

**Métodos Públicos**: Nenhum

---

### OffersGridComponent
**Localização**: `src/app/shared/components/offers-grid/`

**Descrição**: Grid responsivo de ofertas com paginação e pull-to-refresh.

**Props/Inputs**:
- `cityId: number | null` - ID da cidade
- `establishmentIds: number[]` - IDs dos estabelecimentos selecionados

**Outputs**: Nenhum

**Uso**:
```html
<app-offers-grid
  [cityId]="selectedCityId"
  [establishmentIds]="selectedEstablishmentIds">
</app-offers-grid>
```

**Características**:
- Grid 2 colunas no mobile, 4 no desktop
- Paginação com controles
- Pull-to-refresh no mobile
- Loading skeletons
- 8 itens por página
- Formatação de preços em BRL

**Métodos Públicos**:
- `goToPage(page: number)` - Navega para página específica
- `previousPage()` - Página anterior
- `nextPage()` - Próxima página
- `formatPrice(price: number): string` - Formata preço

---

### SkeletonComponent
**Localização**: `src/app/shared/components/skeleton/`

**Descrição**: Componente de skeleton loading reutilizável.

**Props/Inputs**:
- `type: 'text' | 'card' | 'circle' | 'rect'` - Tipo de skeleton
- `width: string` - Largura (padrão: '100%')
- `height: string` - Altura (padrão: '1rem')
- `count: number` - Quantidade de skeletons (padrão: 1)

**Outputs**: Nenhum

**Uso**:
```html
<app-skeleton
  type="card"
  [count]="8"
  width="calc(50% - 0.5rem)"
  height="280px">
</app-skeleton>
```

**Características**:
- Animação de loading suave
- Múltiplos tipos de skeleton
- Configurável via inputs

---

## Componentes de Features

### HomeComponent
**Localização**: `src/app/features/home/`

**Descrição**: Componente principal que integra todos os componentes da home.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**: Rota padrão `/`

**Características**:
- Integra todos os componentes da home
- Gerencia estado de cidade e estabelecimentos selecionados
- Loading overlay global
- Tratamento de erros com SnackBar

**Métodos Públicos**:
- `onCitySelected(city: City)` - Handler para seleção de cidade
- `onEstablishmentSelected(ids: number[])` - Handler para seleção de estabelecimentos

---

### BannerCarouselComponent
**Localização**: `src/app/features/home/banner-carousel/`

**Descrição**: Carrossel de banners com Swiper.js.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**:
```html
<app-banner-carousel></app-banner-carousel>
```

**Características**:
- Auto-rotate a cada 5 segundos
- Touch swiping
- Dot indicators
- Banners clicáveis
- Loading skeleton
- Lazy loading de imagens

---

### LoginComponent
**Localização**: `src/app/features/login/`

**Descrição**: Formulário de login com validação.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**: Rota `/login`

**Características**:
- Validação de email e senha
- Toggle de visibilidade de senha
- Link para recuperação de senha
- Link para voltar ao início
- Loading state durante submissão

**Validações**:
- Email: obrigatório, formato válido
- Senha: obrigatória, mínimo 6 caracteres

---

### EstablishmentSignupComponent
**Localização**: `src/app/features/establishment-signup/`

**Descrição**: Formulário de cadastro de estabelecimento.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**: Rota `/establishment-signup`

**Características**:
- Validação completa de formulário
- Auto-formatação de CNPJ e telefone
- Autocomplete de cidade
- Validação de força de senha
- Checkbox de termos obrigatório

**Campos**:
- Razão Social (obrigatório, min 3 caracteres)
- CNPJ (obrigatório, validação de algoritmo)
- Email (obrigatório, formato válido)
- Telefone (obrigatório, formato brasileiro)
- Endereço (obrigatório, min 5 caracteres)
- Cidade (obrigatório, autocomplete)
- Senha (obrigatório, min 8 caracteres, força)
- Termos (obrigatório)

---

### ReceiptUploadComponent
**Localização**: `src/app/features/receipt-upload/`

**Descrição**: Upload de nota fiscal com drag & drop.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**: Rota `/receipt-upload`

**Características**:
- Drag & drop de arquivos
- Preview de imagens
- Validação de tipo e tamanho de arquivo
- Formulário de dados da nota
- Formatação de valor em BRL

**Validações de Arquivo**:
- Tipos permitidos: JPG, PNG, WEBP, PDF
- Tamanho máximo: 5MB

**Campos do Formulário**:
- Data da Nota Fiscal (obrigatório)
- Valor Total (obrigatório, min 0.01)
- Nome do Estabelecimento (obrigatório, min 2 caracteres)
- Categoria (obrigatório)
- Descrição (opcional)

---

### PurchasesComponent
**Localização**: `src/app/features/purchases/`

**Descrição**: Lista de compras agrupadas por data.

**Props/Inputs**: Nenhum

**Outputs**: Nenhum

**Uso**:
```html
<app-purchases></app-purchases>
```

**Características**:
- Agrupamento por data
- Headers de data sticky
- Paginação "Load More"
- Ícones de categoria
- Formatação de valores em BRL
- Loading skeletons

**Métodos Públicos**:
- `loadMore()` - Carrega mais compras
- `formatPrice(amount: number): string` - Formata preço
- `getCategoryIcon(category: string): string` - Retorna ícone da categoria

---

## Estratégia de Change Detection

Todos os componentes principais usam `ChangeDetectionStrategy.OnPush` para otimização de performance. Isso significa que o Angular só verifica mudanças quando:
- Inputs mudam
- Eventos são disparados
- `markForCheck()` é chamado explicitamente

## Performance

- **Lazy Loading**: Componentes de rotas são carregados sob demanda
- **OnPush**: Reduz verificações desnecessárias de mudanças
- **Virtual Scrolling**: Usado em listas longas (establishment filter)
- **Image Lazy Loading**: Todas as imagens usam `loading="lazy"`
- **Loading Skeletons**: Feedback visual durante carregamento

