import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as FavoritesActions from './favorites.actions';
import { FavoritesService } from '../services/favorites.service';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private favoritesService = inject(FavoritesService);

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      switchMap(({ userId }) =>
        this.favoritesService.getUserFavorites(userId).pipe(
          map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
          catchError(error => of(FavoritesActions.loadFavoritesFailure({ error })))
        )
      )
    )
  );

  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      switchMap(({ favorite }) =>
        this.favoritesService.addFavorite(favorite).pipe(
          map(fav => FavoritesActions.addFavoriteSuccess({ favorite: fav })),
          catchError(error => of(FavoritesActions.addFavoriteFailure({ error })))
        )
      )
    )
  );

  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.removeFavorite),
      switchMap(({ id }) =>
        this.favoritesService.removeFavorite(id).pipe(
          map(() => FavoritesActions.removeFavoriteSuccess({ id })),
          catchError(error => of(FavoritesActions.removeFavoriteFailure({ error })))
        )
      )
    )
  );
}
