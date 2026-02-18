import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Job } from '../../models/job';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class JobListComponent {
  @Input() jobs: Job[] = [];
  @Input() currentPage: number = 1;
  @Input() resultsPerPage: number = 10;
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  // Placeholder pour les favoris
  addToFavorites(job: Job): void {
    if (!this.isAuthenticated()) {
      alert('Veuillez vous connecter pour ajouter des favoris');
      this.router.navigate(['/auth/login']);
      return;
    }
    alert('Fonctionnalité "Favoris" non disponible pour le moment.');
  }

  // Placeholder pour le suivi
  trackApplication(job: Job): void {
    if (!this.isAuthenticated()) {
      alert('Veuillez vous connecter pour suivre des candidatures');
      this.router.navigate(['/auth/login']);
      return;
    }
    alert('Fonctionnalité "Suivi des candidatures" non disponible pour le moment.');
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
