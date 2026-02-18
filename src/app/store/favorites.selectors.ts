import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state) => state.favorites
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state) => state.error
);

export const selectIsFavorite = (offerId: string) => createSelector(
  selectAllFavorites,
  (favorites) => favorites.some(fav => fav.offerId === offerId)
);


export const selectFavoriteIdByOfferId = (offerId: string) => createSelector(
  selectAllFavorites,
  (favorites) => {
    const fav = favorites.find(f => f.offerId === offerId);
    return fav ? fav.id : null;
  }
);
