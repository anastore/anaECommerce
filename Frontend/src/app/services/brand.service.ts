import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Brand {
    id: number;
    name: string;
    description: string;
    subCategoryId: number;
    subCategoryName: string;
    categoryId: number;
    categoryName: string;
    productCount: number;
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
export class BrandService {
    private apiUrl = `${environment.apiUrl}/brands`;

    constructor(private http: HttpClient) { }

    getBrands(pageNumber: number = 1, pageSize: number = 10, subCategoryId?: number): Observable<PaginatedResult<Brand>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (subCategoryId) {
            params = params.set('subCategoryId', subCategoryId.toString());
        }

        return this.http.get<PaginatedResult<Brand>>(this.apiUrl, { params });
    }

    getAllBrands(): Observable<Brand[]> {
        return this.http.get<Brand[]>(`${this.apiUrl}/all`);
    }

    getBrand(id: number): Observable<Brand> {
        return this.http.get<Brand>(`${this.apiUrl}/${id}`);
    }

    createBrand(brand: any): Observable<any> {
        return this.http.post(this.apiUrl, brand);
    }

    updateBrand(id: number, brand: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, brand);
    }

    deleteBrand(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
