import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = 'http://127.0.0.1:8080/api/providers';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.apiUrl);
  }

  getById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.apiUrl}/${id}`);
  }

  create(provider: Provider): Observable<Provider> {
    return this.http.post<Provider>(this.apiUrl, provider);
  }

  update(id: number, provider: Provider): Observable<Provider> {
    return this.http.put<Provider>(`${this.apiUrl}/${id}`, provider);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
