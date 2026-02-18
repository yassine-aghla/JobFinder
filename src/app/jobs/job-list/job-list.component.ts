import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Job } from '../../models/job';
import { AuthService } from '../../services/auth.service';
import { ApplicationsService } from '../../services/applications.service'; // ← Import ajouté
import * as FavoritesActions from '../../store/favorites.actions';
import * as FavoritesSelectors from '../../store/favorites.selectors';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class JobListComponent implements OnInit, OnDestroy {
  @Input() jobs: Job[] = [];
  @Input() currentPage: number = 1;
  @Input() resultsPerPage: number = 10;
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private currentUserId: number | null = null;

  // État local pour les favoris
  favoriteStatus: { [offerId: string]: boolean } = {};
  private favoriteIdMap: { [offerId: string]: number } = {};

  constructor(
    private authService: AuthService,
    private applicationsService: ApplicationsService, // ← Injection ajoutée
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.currentUserId = user.id;
        this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));

        this.store.select(FavoritesSelectors.selectAllFavorites)
          .pipe(takeUntil(this.destroy$))
          .subscribe(favorites => {
            this.favoriteStatus = {};
            this.favoriteIdMap = {};
            favorites.forEach(fav => {
              if (fav.id) {
                this.favoriteStatus[fav.offerId] = true;
                this.favoriteIdMap[fav.offerId] = fav.id;
              }
            });
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  isFavorite(job: Job): boolean {
    return !!this.favoriteStatus[job.id];
  }

  toggleFavorite(job: Job): void {
    if (!this.isAuthenticated()) {
      alert('Veuillez vous connecter pour gérer vos favoris');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.currentUserId) return;

    if (this.isFavorite(job)) {
      const favId = this.favoriteIdMap[job.id];
      if (favId) {
        this.store.dispatch(FavoritesActions.removeFavorite({ id: favId }));
      }
    } else {
      const newFavorite = {
        userId: this.currentUserId,
        offerId: job.id,
        apiSource: job.apiSource,
        title: job.title,
        company: job.company,
        location: job.location
      };
      this.store.dispatch(FavoritesActions.addFavorite({ favorite: newFavorite }));
    }
  }

  // Suivi de candidature (nouvelle méthode)
  trackApplication(job: Job): void {
    if (!this.isAuthenticated()) {
      alert('Veuillez vous connecter pour suivre des candidatures');
      this.router.navigate(['/auth/login']);
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.applicationsService.checkExisting(currentUser.id, job.id).subscribe({
      next: (existing) => {
        if (existing.length > 0) {
          alert('Cette offre est déjà dans votre suivi de candidatures.');
          return;
        }

        const newApplication = {
          userId: currentUser.id,
          offerId: job.id,
          apiSource: job.apiSource,
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          status: 'en_attente' as const,
          notes: '',
          dateAdded: new Date().toISOString()
        };

        this.applicationsService.addApplication(newApplication).subscribe({
          next: () => {
            alert('Offre ajoutée à votre suivi de candidatures.');
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout:', err);
            alert('Une erreur est survenue. Veuillez réessayer.');
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la vérification:', err);
        alert('Erreur de vérification. Veuillez réessayer.');
      }
    });
  }

  viewJob(url: string): void {
    window.open(url, '_blank');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
    return date.toLocaleDateString('fr-FR');
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) this.previousPage.emit();
  }

  onNextPage(): void {
    this.nextPage.emit();
  }
}
