import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SubCategory {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    categoryName: string;
    brandCount: number;
}

export interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SubCategoryService {
    private apiUrl = `${environment.apiUrl}/subcategories`;

    constructor(private http: HttpClient) { }

    getSubCategories(pageNumber: number = 1, pageSize: number = 10, categoryId?: number): Observable<PaginatedResult<SubCategory>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (categoryId) {
            params = params.set('categoryId', categoryId.toString());
        }
        console.log(params);
        console.log(this.apiUrl);
        console.log(this.http.get<PaginatedResult<SubCategory>>(this.apiUrl, { params }));
        return this.http.get<PaginatedResult<SubCategory>>(this.apiUrl, { params });
    }

    getAllSubCategories(): Observable<SubCategory[]> {
        return this.http.get<SubCategory[]>(`${this.apiUrl}/all`);
    }

    getSubCategory(id: number): Observable<SubCategory> {
        return this.http.get<SubCategory>(`${this.apiUrl}/${id}`);
    }

    createSubCategory(subCategory: any): Observable<any> {
        return this.http.post(this.apiUrl, subCategory);
    }

    updateSubCategory(id: number, subCategory: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, subCategory);
    }

    deleteSubCategory(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
