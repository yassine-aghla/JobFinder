import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { favoritesReducer } from './store/favorites.reducer';
import { FavoritesEffects } from './store/favorites.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ favorites: favoritesReducer }),
    provideEffects(FavoritesEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};
