import { createReducer, on } from '@ngrx/store';
import * as FavoritesActions from './favorites.actions';
import { Favorite } from '../models/favorite';

export interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: any;
}

export const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null
};

export const favoritesReducer = createReducer(
  initialState,

  on(FavoritesActions.loadFavorites, (state) => ({ ...state, loading: true })),
  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favorites,
    loading: false,
    error: null
  })),
  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(FavoritesActions.addFavorite, (state) => ({ ...state, loading: true })),
  on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite],
    loading: false,
    error: null
  })),
  on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),


  on(FavoritesActions.removeFavorite, (state) => ({ ...state, loading: true })),
  on(FavoritesActions.removeFavoriteSuccess, (state, { id }) => ({
    ...state,
    favorites: state.favorites.filter(fav => fav.id !== id),
    loading: false,
    error: null
  })),
  on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
