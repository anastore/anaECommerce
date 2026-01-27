import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/ecommerce.models';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrderStatusFormComponent } from './order-status-form/order-status-form.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  // Pagination & Filtering
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  selectedStatus?: OrderStatus;

  // Enum for template
  OrderStatus = OrderStatus;
  orderStatuses = [
    { value: OrderStatus.Pending, key: 'ADMIN.ORDERS.STATUSES.PENDING' },
    { value: OrderStatus.Processing, key: 'ADMIN.ORDERS.STATUSES.PROCESSING' },
    { value: OrderStatus.Shipped, key: 'ADMIN.ORDERS.STATUSES.SHIPPED' },
    { value: OrderStatus.Delivered, key: 'ADMIN.ORDERS.STATUSES.DELIVERED' },
    { value: OrderStatus.Cancelled, key: 'ADMIN.ORDERS.STATUSES.CANCELLED' }
  ];

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders(this.currentPage, this.pageSize, this.selectedStatus).subscribe({
      next: (result) => {
        this.orders = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadOrders();
  }

  openStatusForm(order: Order): void {
    const dialogRef = this.dialog.open(OrderStatusFormComponent, {
      width: '400px',
      data: { status: order.status }
    });

    dialogRef.afterClosed().subscribe(newStatus => {
      if (newStatus !== undefined && newStatus !== order.status) {
        this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
          next: () => {
            order.status = newStatus;
          },
          error: (err) => {
            console.error('Error updating status', err);
            this.loadOrders();
          }
        });
      }
    });
  }

  deleteOrder(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Order',
        message: 'Are you sure you want to delete this order?'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.orderService.deleteOrder(id).subscribe({
          next: () => this.loadOrders(),
          error: (err) => console.error(err)
        });
      }
    });
  }

  getStatusLabel(status: OrderStatus): string {
    return this.orderStatuses.find(s => s.value === status)?.key || 'Unknown';
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.Processing: return 'bg-blue-100 text-blue-800';
      case OrderStatus.Shipped: return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
      case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  filterByStatus(statusTarget: any): void {
    const value = statusTarget.value;
    this.selectedStatus = value === 'all' ? undefined : parseInt(value);
    this.currentPage = 1;
    this.loadOrders();
  }
}
