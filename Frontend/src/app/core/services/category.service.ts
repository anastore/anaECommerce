import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryDto, PaginatedResult } from '../models/ecommerce.models';

/**
 * Service for managing product categories.
 */
@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    /** Fetches a paginated list of top-level categories. */
    getCategories(pageNumber: number = 1, pageSize: number = 10, search?: string): Observable<PaginatedResult<Category>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<PaginatedResult<Category>>(this.apiUrl, { params });
    }

    /** Gets metadata for a specific category. */
    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }

    /** Admin: Registers a new product category. */
    createCategory(category: CreateCategoryDto): Observable<any> {
        return this.http.post(this.apiUrl, category);
    }

    /** Admin: Updates category details. */
    updateCategory(id: number, category: CreateCategoryDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, category);
    }

    /** Admin: Deletes a category. Backend validation prevents deletion if sub-categories exist. */
    deleteCategory(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
