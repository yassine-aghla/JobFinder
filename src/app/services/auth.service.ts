import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { User, UserSession } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private SESSION_KEY = 'jobfinder_user';

  constructor(private http: HttpClient) {}


  register(user: User): Observable<UserSession> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${user.email}`).pipe(
      switchMap((users) => {
        if (users.length > 0) {
          return throwError(() => new Error('Un compte avec cet email existe déjà.'));
        }
        return this.http.post<User>(`${this.apiUrl}/users`, user);
      }),
      map((created: User) => {
        const session = this.buildSession(created);
        this.saveSession(session);
        return session;
      }),
      catchError((err) => throwError(() => err))
    );
  }


  login(email: string, password: string): Observable<UserSession> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (users.length === 0) {
            throw new Error('Email ou mot de passe incorrect.');
          }
          const session = this.buildSession(users[0]);
          this.saveSession(session);
          return session;
        }),
        catchError((err) => throwError(() => err))
      );
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  getCurrentUser(): UserSession | null {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  updateProfile(userId: number, changes: Partial<User>): Observable<UserSession> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, changes).pipe(
      map((updated) => {
        const session = this.buildSession(updated);
        this.saveSession(session);
        return session;
      })
    );
  }

  deleteAccount(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`).pipe(
      map(() => {
        this.logout();
      })
    );
  }

  private buildSession(user: User): UserSession {
    return {
      id: user.id!,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
  }

  private saveSession(session: UserSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }
}
