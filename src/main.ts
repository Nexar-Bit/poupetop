import { bootstrapApplication } from '@angular/platform-browser';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Register Swiper custom elements
registerSwiperElements();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
