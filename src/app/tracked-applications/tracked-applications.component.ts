import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationsService } from '../services/applications.service';
import { AuthService } from '../services/auth.service';
import { Application } from '../models/application';

@Component({
  selector: 'app-tracked-applications',
  templateUrl: './tracked-applications.component.html',
  styleUrls: ['./tracked-applications.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TrackedApplicationsComponent implements OnInit {
  applications: Application[] = [];
  isLoading = true;
  errorMessage = '';
  editingNotesId: number | null = null;
  notesEditValue = '';

  constructor(
    private applicationsService: ApplicationsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isLoading = true;
    this.applicationsService.getUserApplications(user.id).subscribe({
      next: (apps) => {
        this.applications = apps;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement applications:', err);
        this.errorMessage = 'Impossible de charger vos candidatures.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(app: Application, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const status = select.value as Application['status'];
    this.applicationsService.updateApplicationStatus(app.id!, status).subscribe({
      next: () => {
        app.status = status;
      },
      error: (err) => console.error('Erreur mise à jour statut:', err)
    });
  }

  startEditNotes(app: Application): void {
    this.editingNotesId = app.id!;
    this.notesEditValue = app.notes || '';
  }

  saveNotes(app: Application): void {
    if (!this.editingNotesId) return;
    this.applicationsService.updateApplicationNotes(app.id!, this.notesEditValue).subscribe({
      next: () => {
        app.notes = this.notesEditValue;
        this.cancelEditNotes();
      },
      error: (err) => console.error('Erreur mise à jour notes:', err)
    });
  }

  cancelEditNotes(): void {
    this.editingNotesId = null;
    this.notesEditValue = '';
  }

  deleteApplication(app: Application): void {
    if (confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
      this.applicationsService.deleteApplication(app.id!).subscribe({
        next: () => {
          this.applications = this.applications.filter(a => a.id !== app.id);
        },
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }

  viewJob(url: string): void {
    window.open(url, '_blank');
  }
}
