import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdzunaService } from '../../services/adzuna.service';
import { Job } from '../../models/job';
import { JobListComponent } from '../job-list/job-list.component';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JobListComponent
  ]
})
export class JobSearchComponent implements OnInit {
  searchForm!: FormGroup;
  jobs: Job[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 1;
  resultsPerPage = 10;
  totalResults = 0;
  popularLocations: string[] = [];

  constructor(
    private fb: FormBuilder,
    private adzunaService: AdzunaService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.popularLocations = this.adzunaService.getPopularLocations();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      what: ['', [Validators.required, Validators.minLength(2)]],
      where: ['', [Validators.required]]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.currentPage = 1;

    const searchParams = {
      what: this.searchForm.get('what')?.value.trim(),
      where: this.searchForm.get('where')?.value.trim(),
      page: this.currentPage,
      results_per_page: this.resultsPerPage
    };

    this.adzunaService.searchJobs(searchParams).subscribe({
      next: (jobs:any) => {
        this.jobs = jobs;
        this.isLoading = false;
        if (jobs.length === 0) {
          this.errorMessage = 'Aucune offre d\'emploi trouvée pour ces critères.';
        }
      },
      error: (error:any) => {
        console.error('Erreur lors de la recherche:', error);
        this.isLoading = false;
        this.errorMessage = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
      }
    });
  }

  loadNextPage(): void {
    this.currentPage++;
    this.loadPage();
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage();
    }
  }

  private loadPage(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const searchParams = {
      what: this.searchForm.get('what')?.value.trim(),
      where: this.searchForm.get('where')?.value.trim(),
      page: this.currentPage,
      results_per_page: this.resultsPerPage
    };

    this.adzunaService.searchJobs(searchParams).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la page:', error);
        this.isLoading = false;
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }

  private markFormAsTouched(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      this.searchForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (field?.hasError('required')) return 'Ce champ est obligatoire';
    if (field?.hasError('minlength')) return 'Minimum 2 caractères requis';
    return '';
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.jobs = [];
    this.errorMessage = '';
    this.currentPage = 1;
  }
}
