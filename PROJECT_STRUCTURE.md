# Poupetop Project Structure

## Project Configuration
- **Angular Version**: 17
- **Routing**: Enabled
- **Styles**: SCSS
- **Standalone Components**: Yes
- **SSR**: Disabled

## Dependencies Installed
- `@angular/material@^17.0.0` - Angular Material UI components
- `@angular/cdk@^17.0.0` - Angular CDK (Component Dev Kit)
- `swiper@^12.0.3` - Carousel/slider library
- `rxjs@~7.8.0` - Reactive Extensions for JavaScript

## Theme Configuration
- **Primary Color**: #1976d2 (configured in `src/styles.scss`)
- **Mobile Breakpoints**: 320px - 768px (defined as SCSS mixin)

## Project Structure

```
src/app/
├── core/
│   └── services/
│       ├── api.service.ts      # HTTP service for API calls
│       └── index.ts            # Service exports
├── shared/
│   └── components/
│       ├── header/
│       │   ├── header.component.ts
│       │   ├── header.component.html
│       │   └── header.component.scss
│       └── index.ts            # Component exports
├── features/
│   ├── home/
│   │   ├── home.component.ts
│   │   ├── home.component.html
│   │   └── home.component.scss
│   └── index.ts               # Feature exports
├── app.component.ts           # Root component
├── app.component.html
├── app.component.scss
├── app.config.ts              # App configuration (routing, animations, HTTP)
└── app.routes.ts              # Route definitions
```

## Key Features

### Core Module
- Contains services that are used across the application
- `ApiService`: Provides HTTP client methods for API communication

### Shared Module
- Contains reusable components used across features
- `HeaderComponent`: Material toolbar component with primary color theme

### Features Module
- Contains feature-specific components
- `HomeComponent`: Example home page component

## Usage

### Running the Application
```bash
npm start
```

### Building the Application
```bash
npm run build
```

### Using Mobile Breakpoints
In your SCSS files, use the mobile mixin:
```scss
@import '../styles.scss';

.my-component {
  padding: 2rem;
  
  @include mobile {
    padding: 1rem;
  }
}
```

### Using Angular Material
All Material modules are available. Import them in your standalone components:
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
```

### Using Swiper
Swiper is installed and ready to use. Import it in your components as needed.

