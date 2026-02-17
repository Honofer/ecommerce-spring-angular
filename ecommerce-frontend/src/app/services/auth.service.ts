import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_user';
  private readonly AUTH_HEADER_KEY = 'authHeader';
  private readonly apiUrl = 'http://127.0.0.1:8080/api/users/login';

  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(this.getStoredUser());

  login(username: string, password: string): Observable<User[]> {
    const authString = 'Basic ' + btoa(username + ':' + password);

    return this.http.get<User[]>('http://127.0.0.1:8080/api/users', {
      headers: { 'Authorization': authString }
    }).pipe(
      tap(users => {
        if (users && users.length > 0) {
          const loggedInUser = users.find(u => u.username === username);
          if (loggedInUser) {
            localStorage.setItem(this.AUTH_HEADER_KEY, authString);
            this.setSession(loggedInUser);
          }
        }
      })
    );
  }

  getAuthHeader(): string | null {
    return localStorage.getItem(this.AUTH_HEADER_KEY);
  }

  logout(): void {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null && this.getAuthHeader() !== null;
  }

  private setSession(user: User): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        localStorage.removeItem(this.AUTH_KEY);
      }
    }
    return null;
  }
}
