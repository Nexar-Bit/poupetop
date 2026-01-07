# Próximos Passos - Integração da API Real

## ✅ O que já foi feito

1. ✅ Arquivos de ambiente criados (`environment.ts` e `environment.prod.ts`)
2. ✅ Modelos atualizados para corresponder à API
3. ✅ Serviços atualizados para usar endpoints reais:
   - `CityService` → `/api/municipios`
   - `EstablishmentService` → `/estabelecimentos?idMunicipio={id}`
   - `OfferService` → `/api/ofertas?idMunicipio={id}&idEstabelecimento={id}`
   - `ProdutoNotaFiscalService` → `/produtos-nota-fiscal?page={page}`
4. ✅ Componentes atualizados para exibir formato correto ("NomeMunicipio, SiglaEstado")
5. ✅ Configuração de produção no `angular.json`

---

## 🚀 Próximos Passos Imediatos

### 1. Testar a Integração com a API Real

**Opção A: Desabilitar InMemory API em Desenvolvimento**

Se você quiser testar com a API real em desenvolvimento, edite `src/app/app.config.ts`:

```typescript
// Comentar ou remover o bloco do InMemoryWebApi
// ...(isDevMode() ? [
//   importProvidersFrom(
//     HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
//       dataEncapsulation: false,
//       delay: 500
//     })
//   )
// ] : [])
```

**Opção B: Manter InMemory API para desenvolvimento**

Mantenha como está e teste apenas em produção. O InMemory API será automaticamente desabilitado em produção.

### 2. Verificar a URL da API

Edite `src/environments/environment.ts` se necessário:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // Ajuste se sua API estiver em outra porta
};
```

### 3. Testar Funcionalidades

Teste cada funcionalidade:

- [ ] **Busca de Municípios**: Digite no textbox e verifique se retorna "NomeMunicipio, SiglaEstado"
- [ ] **Carregamento de Estabelecimentos**: Selecione um município e verifique se os estabelecimentos aparecem
- [ ] **Filtro de Ofertas**: Selecione município e/ou estabelecimento e verifique se as ofertas são carregadas
- [ ] **Paginação**: Teste a navegação entre páginas de ofertas

### 4. Verificar Tratamento de Erros

Certifique-se de que os componentes tratam erros adequadamente:

- [ ] Erros de rede são exibidos ao usuário
- [ ] Loading states funcionam corretamente
- [ ] Mensagens de erro são claras

---

## 🔧 Melhorias Recomendadas

### 1. Tratamento de Erros Melhorado

Adicione interceptors HTTP para tratamento centralizado de erros:

```typescript
// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Tratamento centralizado de erros
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
}
```

### 2. Loading Interceptor

Adicione um interceptor para gerenciar estados de loading globalmente.

### 3. Cache de Dados

Considere implementar cache para:
- Lista de municípios (raramente muda)
- Estabelecimentos por município

### 4. Suporte a Múltiplos Estabelecimentos

Atualmente, quando múltiplos estabelecimentos são selecionados, apenas o primeiro é usado. Para suportar múltiplos:

```typescript
// Em OfferService, fazer múltiplas chamadas e combinar resultados
getOffersMultiple(idMunicipio: number, page: number, idEstabelecimentos: number[]): Observable<Offer[]> {
  if (idEstabelecimentos.length === 0) {
    return this.getOffers(idMunicipio, page);
  }
  
  // Fazer chamadas para cada estabelecimento e combinar
  const requests = idEstabelecimentos.map(id => 
    this.getOffers(idMunicipio, 1, [id])
  );
  
  return forkJoin(requests).pipe(
    map(results => {
      // Combinar e paginar resultados
      const combined = results.flat();
      const startIndex = (page - 1) * this.itemsPerPage;
      return combined.slice(startIndex, startIndex + this.itemsPerPage);
    })
  );
}
```

### 5. Integração do Serviço de Produtos Nota Fiscal

O serviço `ProdutoNotaFiscalService` foi criado, mas precisa ser integrado no componente de upload de nota fiscal:

```typescript
// Em receipt-upload.component.ts
import { ProdutoNotaFiscalService } from '../../core/services/produto-nota-fiscal.service';

// Após upload bem-sucedido, carregar produtos
this.produtoNotaFiscalService.getProdutosNotaFiscal(0)
  .subscribe(produtos => {
    // Processar produtos da nota fiscal
  });
```

---

## 📝 Configuração de Produção

### 1. Atualizar URL da API de Produção

Edite `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.poupetop.com' // Sua URL de produção
};
```

### 2. Build de Produção

```bash
npm run build -- --configuration production
```

### 3. Verificar Service Worker

O Service Worker está configurado para cachear chamadas de API. Verifique `ngsw-config.json` se precisar ajustar estratégias de cache.

---

## 🧪 Testes

### 1. Testes Unitários

Crie testes para os novos serviços:

```bash
ng generate service core/services/city.service.spec
```

### 2. Testes de Integração

Teste o fluxo completo:
1. Buscar município
2. Selecionar município
3. Carregar estabelecimentos
4. Filtrar por estabelecimento
5. Carregar ofertas

---

## 📊 Monitoramento

### 1. Logging

Considere adicionar logging para:
- Chamadas de API
- Erros
- Performance

### 2. Analytics

Adicione analytics para rastrear:
- Municípios mais buscados
- Estabelecimentos mais selecionados
- Ofertas mais visualizadas

---

## 🐛 Troubleshooting

### Problema: API não está respondendo

**Solução:**
1. Verifique se a API está rodando em `http://localhost:8080`
2. Verifique CORS se estiver em domínios diferentes
3. Verifique o console do navegador para erros

### Problema: InMemory API ainda está interceptando

**Solução:**
1. Verifique se está em modo produção (`isDevMode()` retorna `false`)
2. Ou comente o bloco do InMemoryWebApi em `app.config.ts`

### Problema: Formato de dados diferente

**Solução:**
1. Verifique a estrutura da resposta da API
2. Ajuste os modelos em `src/app/models/index.ts`
3. Ajuste os mappers nos serviços

---

## 📚 Documentação Adicional

- [Documentação de Componentes](./docs/COMPONENTS.md)
- [Documentação de Serviços](./docs/SERVICES.md)
- [Guia de Deploy](./docs/DEPLOYMENT.md)

---

## ✅ Checklist Final

Antes de fazer deploy:

- [ ] API real está funcionando e acessível
- [ ] Todos os endpoints estão testados
- [ ] Tratamento de erros implementado
- [ ] Loading states funcionando
- [ ] URL de produção configurada
- [ ] Build de produção testado
- [ ] Service Worker funcionando
- [ ] Testes passando
- [ ] Documentação atualizada

---

**Última atualização:** $(date)
