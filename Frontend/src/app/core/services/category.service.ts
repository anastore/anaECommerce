import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryDto, PaginatedResult } from '../models/ecommerce.models';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    getCategories(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Category>> {
        const params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PaginatedResult<Category>>(this.apiUrl, { params });
    }

    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }

    createCategory(category: CreateCategoryDto): Observable<any> {
        return this.http.post(this.apiUrl, category);
    }

    updateCategory(id: number, category: CreateCategoryDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, category);
    }

    deleteCategory(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
