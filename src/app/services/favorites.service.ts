import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/favorites';

  constructor(private http: HttpClient) {}

  getUserFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addFavorite(favorite: Omit<Favorite, 'id'>): Observable<Favorite> {
    return this.http.post<Favorite>(this.apiUrl, favorite);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkExisting(userId: number, offerId: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
  }
}
