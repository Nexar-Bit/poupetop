# Next Steps - Action Plan

## 🎯 Immediate Actions (Do Now)

### 1. Test API Integration

#### Option A: Test with Real API in Development
To test with your real API, temporarily disable the InMemory API:

**Edit `src/app/app.config.ts`:**
```typescript
// Comment out or remove this block:
// ...(isDevMode() ? [
//   importProvidersFrom(
//     HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
//       dataEncapsulation: false,
//       delay: 500
//     })
//   )
// ] : [])
```

**Then:**
1. Ensure your API is running on `http://localhost:8080`
2. Start the Angular app: `npm start`
3. Test each feature:
   - [ ] City search (should show "NomeMunicipio, SiglaEstado")
   - [ ] Establishment loading after city selection
   - [ ] Offers loading with filters
   - [ ] Multiple establishments filtering
   - [ ] Error handling (test with API offline)

#### Option B: Keep InMemory API for Development
- Test with mock data in development
- Test with real API only in production build

---

### 2. Verify API Endpoints

Ensure your backend API matches these endpoints:

| Service | Endpoint | Method | Parameters |
|---------|----------|--------|------------|
| Cities | `/api/municipios` | GET | None |
| Establishments | `/estabelecimentos` | GET | `idMunicipio` |
| Offers | `/api/ofertas` | GET | `idMunicipio`, `idEstabelecimento` (optional) |
| Products | `/produtos-nota-fiscal` | GET | `page` |

**Test each endpoint manually:**
```bash
# Test cities
curl http://localhost:8080/api/municipios

# Test establishments
curl "http://localhost:8080/estabelecimentos?idMunicipio=4310207"

# Test offers
curl "http://localhost:8080/api/ofertas?idMunicipio=4305009"
curl "http://localhost:8080/api/ofertas?idMunicipio=4305009&idEstabelecimento=1"

# Test products
curl "http://localhost:8080/produtos-nota-fiscal?page=0"
```

---

### 3. Complete Receipt Upload Integration

**Current Status:** Receipt upload uses a simulated API call (TODO comment found)

**Action Required:** Implement actual API call in `src/app/features/receipt-upload/receipt-upload.component.ts`

**Replace this section (around line 242):**
```typescript
// TODO: Replace with actual API call when backend is ready
// For now, simulate API call
setTimeout(() => {
  // ... simulation code
}, 2000);
```

**With:**
```typescript
// Actual API call
this.http.post(`${environment.apiUrl}/api/receipts/upload`, formData, {
  headers: {
    // Don't set Content-Type - let browser set it with boundary
  }
}).pipe(
  takeUntil(this.destroy$)
).subscribe({
  next: (response) => {
    this.isLoading = false;
    console.log('Receipt uploaded:', response);
    
    // Load products after successful upload
    this.loadProdutosNotaFiscal();
    
    this.snackBar.open('Receipt uploaded successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    
    this.resetForm();
  },
  error: (error) => {
    this.isLoading = false;
    // Error is handled by ErrorInterceptor
  }
});
```

**Don't forget to import HttpClient:**
```typescript
import { HttpClient } from '@angular/common/http';
```

---

## 🔧 Configuration Updates

### 4. Update Production API URL

**Edit `src/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com' // Replace with your production API URL
};
```

---

### 5. CORS Configuration

If your API is on a different domain/port, ensure CORS is configured:

**Backend should allow:**
- Origin: Your Angular app URL
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization (if using auth)

---

## 🧪 Testing Checklist

### Functional Testing

- [ ] **City Search**
  - [ ] Type in city name
  - [ ] Verify format: "NomeMunicipio, SiglaEstado"
  - [ ] Verify autocomplete works
  - [ ] Verify city is saved to localStorage

- [ ] **Establishments**
  - [ ] Select a city
  - [ ] Verify establishments load
  - [ ] Verify search/filter works
  - [ ] Verify multiple selection works

- [ ] **Offers**
  - [ ] Select city only → verify offers load
  - [ ] Select city + establishment → verify filtered offers
  - [ ] Select multiple establishments → verify combined offers
  - [ ] Verify pagination works
  - [ ] Verify pull-to-refresh works (mobile)

- [ ] **Error Handling**
  - [ ] Disconnect API → verify error message appears
  - [ ] Test 404 error → verify appropriate message
  - [ ] Test 500 error → verify appropriate message

- [ ] **Caching**
  - [ ] Select city → check network tab (should see API call)
  - [ ] Select same city again → check network tab (should use cache)
  - [ ] Wait for cache expiration → verify fresh data loads

- [ ] **Receipt Upload**
  - [ ] Upload file → verify success message
  - [ ] Verify products load after upload
  - [ ] Verify pagination for products works

---

### Performance Testing

- [ ] **Lighthouse Audit**
  ```bash
  # Build for production
  npm run build -- --configuration production
  
  # Serve the build
  npx http-server dist/poupetop/browser -p 4200
  
  # Run Lighthouse in Chrome DevTools
  ```

- [ ] **Network Performance**
  - [ ] Check initial bundle size
  - [ ] Verify lazy loading works
  - [ ] Check cache effectiveness

- [ ] **Mobile Performance**
  - [ ] Test on real devices
  - [ ] Check touch responsiveness
  - [ ] Verify pull-to-refresh works

---

## 🚀 Deployment Preparation

### 6. Production Build

```bash
# Build for production
npm run build -- --configuration production

# Verify build output
ls -lh dist/poupetop/browser
```

**Check:**
- [ ] Service worker is generated (`ngsw.json`)
- [ ] Files are minified
- [ ] Source maps are disabled (for security)
- [ ] Bundle sizes are within limits

### 7. Environment Variables

If you need different API URLs per environment, consider:

**Option A: Multiple environment files**
- `environment.ts` - Development
- `environment.prod.ts` - Production
- `environment.staging.ts` - Staging (if needed)

**Option B: Build-time configuration**
Use Angular's file replacements in `angular.json`

---

## 📝 Documentation Updates

### 8. Update API Documentation

Update `docs/SERVICES.md` with:
- Actual API endpoints
- Request/response formats
- Authentication requirements (if any)
- Error response formats

### 9. Update README

Update `README.md` with:
- Production API URL
- Deployment instructions
- Environment setup

---

## 🔒 Security Considerations

### 10. Security Checklist

- [ ] **API Security**
  - [ ] Implement authentication if needed
  - [ ] Use HTTPS in production
  - [ ] Validate API responses
  - [ ] Sanitize user inputs

- [ ] **Angular Security**
  - [ ] Review `angular.json` security settings
  - [ ] Ensure no sensitive data in source code
  - [ ] Use environment variables for secrets
  - [ ] Enable Content Security Policy (CSP)

---

## 🐛 Troubleshooting Guide

### Common Issues

#### Issue: API calls return 404
**Solution:**
- Verify API is running
- Check API URL in `environment.ts`
- Verify endpoint paths match backend

#### Issue: CORS errors
**Solution:**
- Configure CORS on backend
- Check browser console for specific CORS error
- Verify allowed origins include your app URL

#### Issue: Cache not working
**Solution:**
- Check browser DevTools → Network tab
- Verify cache expiration times
- Clear cache manually: `cityService.clearCache()`

#### Issue: Multiple establishments not combining
**Solution:**
- Check console for errors
- Verify API responses are arrays
- Check that establishment IDs are valid

#### Issue: Error interceptor not showing messages
**Solution:**
- Verify `MatSnackBarModule` is imported
- Check console for interceptor errors
- Verify interceptors are registered in `app.config.ts`

---

## 📊 Monitoring & Analytics

### 11. Add Monitoring (Optional)

Consider adding:
- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics, Mixpanel
- **Performance**: New Relic, Datadog
- **API Monitoring**: Monitor API response times and errors

---

## ✅ Final Checklist Before Production

- [ ] All API endpoints tested and working
- [ ] Error handling tested
- [ ] Caching verified
- [ ] Production API URL configured
- [ ] CORS configured
- [ ] Receipt upload API integrated
- [ ] Production build tested
- [ ] Service worker working
- [ ] Performance metrics acceptable
- [ ] Security review completed
- [ ] Documentation updated

---

## 🎉 You're Ready!

Once all items are checked, you're ready for production deployment!

**Recommended Deployment Platforms:**
- **Vercel**: Easy Angular deployment
- **Netlify**: Great for static sites
- **Firebase Hosting**: Google's hosting solution
- **AWS S3 + CloudFront**: Enterprise solution
- **Azure Static Web Apps**: Microsoft's solution

---

**Last Updated**: $(date)
