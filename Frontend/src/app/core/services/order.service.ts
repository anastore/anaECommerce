import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderDto, OrderStatus, PaginatedResult } from '../models/ecommerce.models';

/**
 * Service for handling customer orders and administrative fulfillment.
 */
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    /**
     * Lists orders. Admins can view all orders; customers can view their own.
     * @param pageNumber The page index.
     * @param pageSize The number of records per page.
     * @param status Filter by order status.
     * @param userId Admin: filter by specific customer.
     */
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

    /** Retrieves order details and line items. */
    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    /** Submits a new order for the current user. */
    createOrder(order: CreateOrderDto): Observable<any> {
        return this.http.post(this.apiUrl, order);
    }

    /** Admin: Updates the processing status of an order. */
    updateOrderStatus(id: number, status: OrderStatus): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/status`, { status });
    }

    /** Admin: Deletes an order record. */
    deleteOrder(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
