import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductDto, PaginatedResult } from '../models/ecommerce.models';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(
        pageNumber: number = 1,
        pageSize: number = 10,
        brandId?: number,
        subCategoryId?: number,
        categoryId?: number,
        search?: string
    ): Observable<PaginatedResult<Product>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (brandId) {
            params = params.set('brandId', brandId.toString());
        }

        if (subCategoryId) {
            params = params.set('subCategoryId', subCategoryId.toString());
        }

        if (categoryId) {
            params = params.set('categoryId', categoryId.toString());
        }

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<PaginatedResult<Product>>(this.apiUrl, { params });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: CreateProductDto): Observable<any> {
        return this.http.post(this.apiUrl, product);
    }

    updateProduct(id: number, product: CreateProductDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    uploadImage(file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData);
    }
}
