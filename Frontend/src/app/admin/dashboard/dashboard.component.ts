import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    categories: 0,
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0 // Optional, if backend provides or I sum it up
  };

  loading = true;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    forkJoin({
      categories: this.categoryService.getCategories(1, 1),
      products: this.productService.getProducts(1, 1),
      orders: this.orderService.getOrders(1, 1),
      users: this.userService.getUsers(1, 1)
    }).subscribe({
      next: (result) => {
        this.stats.categories = result.categories.totalCount;
        this.stats.products = result.products.totalCount;
        this.stats.orders = result.orders.totalCount;
        this.stats.users = result.users.totalCount;

        // Calculate estimated revenue from fetched orders (limited to the first page if I wanted precise, 
        // but for now I'll just use the items I have? No, totalCount doesn't give revenue)
        // Leaving revenue as 0 or mock for now, or fetch all orders if count is low?
        // Let's just show counts.

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.loading = false;
      }
    });
  }
}
