import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

const scrollConfig: InMemoryScrollingOptions = {
  // scrollPositionRestoration: 'top', // Anteriormente
  scrollPositionRestoration: 'disabled', // Anteriormente
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, inMemoryScrollingFeature),
    provideHttpClient(),
    provideToastr(),
    provideAnimations(),
  ],
};
