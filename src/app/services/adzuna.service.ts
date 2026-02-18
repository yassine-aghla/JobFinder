import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AdzunaSearchResponse, AdzunaJob, JobSearchParams, Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class AdzunaService {
  private readonly APP_ID = 'bbb9f2fe';
  private readonly APP_KEY = '802fb5fa8588b34a2f8c5e09f6e2b4d8';
  private readonly BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
  private readonly COUNTRY = 'fr';

  constructor(private http: HttpClient) {}

  searchJobs(searchParams: JobSearchParams): Observable<Job[]> {
    const page = searchParams.page || 1;
    const resultsPerPage = searchParams.results_per_page || 10;

    const url = `${this.BASE_URL}/${this.COUNTRY}/search/${page}`;

    let params = new HttpParams()
      .set('app_id', this.APP_ID)
      .set('app_key', this.APP_KEY)
      .set('results_per_page', resultsPerPage.toString())
      .set('sort_by', 'date');

    if (searchParams.what) {
      params = params.set('what', searchParams.what);
    }
    if (searchParams.where) {
      params = params.set('where', searchParams.where);
    }

    return this.http.get<AdzunaSearchResponse>(url, { params }).pipe(
      map(response => this.transformAdzunaJobs(response.results)),
      catchError(error => {
        console.error('Erreur API Adzuna:', error);
        return of([]);
      })
    );
  }

  private transformAdzunaJobs(adzunaJobs: AdzunaJob[]): Job[] {
    return adzunaJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: this.truncateDescription(job.description),
      publishedDate: job.created,
      url: job.redirect_url,
      salary: this.formatSalary(job.salary_min, job.salary_max),
      apiSource: 'adzuna'
    }));
  }

  private truncateDescription(description: string): string {
    const maxLength = 200;
    return description.length <= maxLength ? description : description.substring(0, maxLength) + '...';
  }

  private formatSalary(min?: number, max?: number): string | undefined {
    if (!min && !max) return undefined;
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} €`;
    if (min) return `À partir de ${min.toLocaleString()} €`;
    if (max) return `Jusqu'à ${max.toLocaleString()} €`;
    return undefined;
  }

  getPopularLocations(): string[] {
    return [
      'Paris',
      'Lyon',
      'Marseille',
      'Toulouse',
      'Nice',
      'Nantes',
      'Strasbourg',
      'Montpellier',
      'Bordeaux',
      'Lille',
      'Rennes',
      'Grenoble'
    ];
  }
}
