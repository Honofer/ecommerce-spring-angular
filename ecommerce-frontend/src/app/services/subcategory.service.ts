import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubCategory } from '../models/subcategory.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private apiUrl = 'http://127.0.0.1:8080/api/subcategories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.apiUrl);
  }

  getById(id: number): Observable<SubCategory> {
    return this.http.get<SubCategory>(`${this.apiUrl}/${id}`);
  }

  create(subCategory: SubCategory): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.apiUrl, subCategory);
  }

  update(id: number, subCategory: SubCategory): Observable<SubCategory> {
    return this.http.put<SubCategory>(`${this.apiUrl}/${id}`, subCategory);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
