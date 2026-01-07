# Documentação de Serviços

Este documento descreve todos os serviços da aplicação PoupeTop.

## Serviços Core

### BannerService
**Localização**: `src/app/core/services/banner.service.ts`

**Descrição**: Serviço para buscar banners promocionais.

**Métodos**:
```typescript
getBanners(): Observable<Banner[]>
```

**Retorno**: Observable que emite array de banners

**Exemplo de Uso**:
```typescript
constructor(private bannerService: BannerService) {}

ngOnInit() {
  this.bannerService.getBanners().subscribe(banners => {
    this.banners = banners;
  });
}
```

**API Endpoint**: `GET /api/banners`

---

### CityService
**Localização**: `src/app/core/services/city.service.ts`

**Descrição**: Serviço para buscar e filtrar cidades.

**Métodos**:
```typescript
searchCities(query: string): Observable<City[]>
```

**Parâmetros**:
- `query: string` - Termo de busca (mínimo 2 caracteres)

**Retorno**: Observable que emite array de cidades filtradas

**Características**:
- Filtragem client-side como fallback
- Retorna array vazio se query < 2 caracteres

**Exemplo de Uso**:
```typescript
constructor(private cityService: CityService) {}

searchCities(query: string) {
  this.cityService.searchCities(query).subscribe(cities => {
    this.filteredCities = cities;
  });
}
```

**API Endpoint**: `GET /api/cities?name_like={query}`

---

### EstablishmentService
**Localização**: `src/app/core/services/establishment.service.ts`

**Descrição**: Serviço para buscar estabelecimentos por cidade.

**Métodos**:
```typescript
getEstablishments(cityId: number): Observable<Establishment[]>
```

**Parâmetros**:
- `cityId: number` - ID da cidade

**Retorno**: Observable que emite array de estabelecimentos

**Exemplo de Uso**:
```typescript
constructor(private establishmentService: EstablishmentService) {}

loadEstablishments(cityId: number) {
  this.establishmentService.getEstablishments(cityId)
    .subscribe(establishments => {
      this.establishments = establishments;
    });
}
```

**API Endpoint**: `GET /api/establishments?cityId={cityId}`

---

### OfferService
**Localização**: `src/app/core/services/offer.service.ts`

**Descrição**: Serviço para buscar ofertas com paginação e filtros.

**Métodos**:
```typescript
getOffers(cityId: number, page: number, establishmentId?: number): Observable<Offer[]>
getTotalOffers(cityId: number): Observable<number>
```

**Parâmetros**:
- `cityId: number` - ID da cidade (obrigatório)
- `page: number` - Número da página (obrigatório)
- `establishmentId?: number` - ID do estabelecimento (opcional)

**Retorno**: 
- `getOffers()`: Observable que emite array de ofertas
- `getTotalOffers()`: Observable que emite número total de ofertas

**Características**:
- Filtra ofertas por cidade (via estabelecimentos)
- Filtra opcionalmente por estabelecimento
- Suporta paginação

**Exemplo de Uso**:
```typescript
constructor(private offerService: OfferService) {}

loadOffers(cityId: number, page: number) {
  // Buscar ofertas
  this.offerService.getOffers(cityId, page)
    .subscribe(offers => {
      this.offers = offers;
    });

  // Buscar total para paginação
  this.offerService.getTotalOffers(cityId)
    .subscribe(total => {
      this.totalPages = Math.ceil(total / this.itemsPerPage);
    });
}
```

**API Endpoint**: 
- `GET /api/offers?cityId={cityId}&page={page}&establishmentId={establishmentId}`
- `GET /api/offers?cityId={cityId}` (para total)

---

### PurchaseService
**Localização**: `src/app/core/services/purchase.service.ts`

**Descrição**: Serviço para buscar histórico de compras com paginação.

**Métodos**:
```typescript
getPurchases(page: number): Observable<Purchase[]>
```

**Parâmetros**:
- `page: number` - Número da página

**Retorno**: Observable que emite array de compras

**Características**:
- Ordena por data (mais recente primeiro)
- Suporta paginação

**Exemplo de Uso**:
```typescript
constructor(private purchaseService: PurchaseService) {}

loadPurchases(page: number) {
  this.purchaseService.getPurchases(page)
    .subscribe(purchases => {
      this.purchases = [...this.purchases, ...purchases];
    });
}
```

**API Endpoint**: `GET /api/purchases?page={page}`

---

### InMemoryDataService
**Localização**: `src/app/core/services/in-memory-data.service.ts`

**Descrição**: Serviço de mock data para desenvolvimento usando angular-in-memory-web-api.

**Características**:
- Implementa `InMemoryDbService`
- Fornece dados mock para desenvolvimento
- Apenas ativo em modo desenvolvimento

**Dados Mock**:
- 5 banners
- 20 cidades brasileiras
- 15 estabelecimentos
- 25 ofertas
- 20 compras

**Configuração**:
```typescript
// app.config.ts
importProvidersFrom(
  HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
    dataEncapsulation: false,
    delay: 500
  })
)
```

**Nota**: Este serviço é automaticamente desabilitado em produção. Em produção, configure a URL da API real em `environment.production.ts`.

---

## Padrões de Uso

### Tratamento de Erros
Todos os serviços devem ter tratamento de erros:

```typescript
this.service.getData()
  .pipe(
    takeUntil(this.destroy$),
    catchError(error => {
      console.error('Error:', error);
      // Tratar erro (ex: mostrar mensagem ao usuário)
      return of([]); // Retornar valor padrão
    })
  )
  .subscribe(data => {
    // Processar dados
  });
```

### Unsubscribe
Sempre use `takeUntil` para evitar memory leaks:

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // ...
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### Loading States
Sempre gerencie estados de loading:

```typescript
isLoading = false;

loadData() {
  this.isLoading = true;
  this.service.getData()
    .pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.destroy$)
    )
    .subscribe(data => {
      // ...
    });
}
```

---

## Integração com API Real

Para integrar com uma API real:

1. **Criar arquivo de environment**:
```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.poupetop.com'
};
```

2. **Atualizar serviços**:
```typescript
private apiUrl = environment.apiUrl;

getBanners(): Observable<Banner[]> {
  return this.http.get<Banner[]>(`${this.apiUrl}/banners`);
}
```

3. **Remover InMemoryWebApi** em produção (já configurado automaticamente)

---

## Cache e Service Worker

O Service Worker está configurado para cachear:
- **Assets**: CSS, JS, imagens (lazy install)
- **API Calls**: Cache com estratégia "freshness" (1h maxAge)

Configuração em `ngsw-config.json`.

