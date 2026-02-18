import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Favorite } from '../models/favorite';
import { AuthService } from '../services/auth.service';
import * as FavoritesActions from '../store/favorites.actions';
import * as FavoritesSelectors from '../store/favorites.selectors';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: Favorite[] = [];
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));

    this.store.select(FavoritesSelectors.selectAllFavorites)
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favorites = favorites;
        this.loading = false;
      });

    this.store.select(FavoritesSelectors.selectFavoritesLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeFavorite(fav: Favorite): void {
    if (fav.id) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: fav.id }));
    }
  }

}
