import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductDto, PaginatedResult } from '../models/ecommerce.models';

/**
 * Service for interacting with the Product API.
 * Handles product browsing, detailed views, and administrative CRUD operations.
 */
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    /**
     * Fetches a paginated list of products with optional filters.
     * @param pageNumber The 1-based page index.
     * @param pageSize Number of items per result set.
     * @param brandId Filter by specific brand.
     * @param subCategoryId Filter by sub-category.
     * @param categoryId Filter by root category.
     * @param search Filter by name/description keyword.
     */
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

    /** Gets full details for a product by ID. */
    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    /** Admin: Adds a new product record. */
    createProduct(product: CreateProductDto): Observable<any> {
        return this.http.post(this.apiUrl, product);
    }

    /** Admin: Updates product metadata or pricing. */
    updateProduct(id: number, product: CreateProductDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, product);
    }

    /** Admin: Deletes a product record (Soft Delete). */
    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    /** Admin: Uploads a product image file. */
    uploadImage(file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData);
    }
}
