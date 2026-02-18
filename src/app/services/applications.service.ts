import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private apiUrl = 'http://localhost:3000/applications';

  constructor(private http: HttpClient) {}
  getUserApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addApplication(application: Omit<Application, 'id'>): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }


  updateApplicationStatus(id: number, status: Application['status']): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
  }

  updateApplicationNotes(id: number, notes: string): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { notes });
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkExisting(userId: number, offerId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
  }
}

