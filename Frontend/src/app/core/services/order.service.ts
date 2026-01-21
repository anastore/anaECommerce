import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderDto, OrderStatus, PaginatedResult } from '../models/ecommerce.models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getOrders(
        pageNumber: number = 1,
        pageSize: number = 10,
        status?: OrderStatus,
        userId?: string
    ): Observable<PaginatedResult<Order>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (status !== undefined) {
            params = params.set('status', status.toString());
        }

        if (userId) {
            params = params.set('userId', userId);
        }

        return this.http.get<PaginatedResult<Order>>(this.apiUrl, { params });
    }

    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    createOrder(order: CreateOrderDto): Observable<any> {
        return this.http.post(this.apiUrl, order);
    }

    updateOrderStatus(id: number, status: OrderStatus): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/status`, { status });
    }

    deleteOrder(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
