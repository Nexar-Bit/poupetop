# CORS Configuration Required

## Issue
The production application deployed at `https://poupetop.vercel.app` is being blocked by CORS policy when trying to access the API at `https://meumercadohoje.com.br`.

## Error Message
```
Access to XMLHttpRequest at 'https://meumercadohoje.com.br/api/*' 
from origin 'https://poupetop.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause
The backend API server at `https://meumercadohoje.com.br` does not have CORS (Cross-Origin Resource Sharing) headers configured to allow requests from the frontend domain `https://poupetop.vercel.app`.

## Solution (Backend Configuration Required)

The backend server needs to be configured to include the following CORS headers in all API responses:

### Required Headers:
```
Access-Control-Allow-Origin: https://poupetop.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true (if using cookies/auth)
```

### For Development (if needed):
```
Access-Control-Allow-Origin: http://localhost:4200
```

### For Multiple Origins:
If you need to support multiple origins, you can:
1. Use a whitelist of allowed origins
2. Or use `Access-Control-Allow-Origin: *` (less secure, allows all origins)

## Implementation Examples

### Node.js/Express Example:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://poupetop.vercel.app',
    'http://localhost:4200' // for development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Spring Boot Example:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("https://poupetop.vercel.app", "http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Nginx Example:
```nginx
location /api/ {
    add_header 'Access-Control-Allow-Origin' 'https://poupetop.vercel.app' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

### Apache Example:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://poupetop.vercel.app"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>
```

## Testing
After implementing CORS on the backend, test by:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make a request from `https://poupetop.vercel.app`
4. Check the response headers - you should see:
   - `Access-Control-Allow-Origin: https://poupetop.vercel.app`
   - Other CORS headers as configured

## Current Status
- ✅ Frontend is correctly configured to use `https://meumercadohoje.com.br` as API URL
- ✅ Development proxy is working (for local development)
- ❌ Backend CORS configuration is missing (needs to be fixed on server)

## Notes
- CORS is a browser security feature that cannot be bypassed from the client side
- The proxy configuration (`proxy.conf.json`) only works in development with `ng serve`
- In production, the backend must properly configure CORS headers
- This is a **server-side configuration issue** that must be resolved by the backend team

## Contact
If you need assistance configuring CORS on the backend, please contact the backend development team or server administrator.
