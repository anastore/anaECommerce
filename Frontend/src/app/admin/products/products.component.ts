import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { SubCategoryService } from '../../services/sub-category.service';
import { BrandService } from '../../services/brand.service';
import { Product, Category } from '../../core/models/ecommerce.models';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { ProductFormComponent } from './product-form/product-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

/**
 * Administrative panel for product management.
 * Supports paginated listing, debounced search, complex attribute filtering, and full CRUD.
 */
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  loading = true;

  // Pagination metadata
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  // Hierarchical filters
  filterCategoryId?: number;
  filterSubCategoryId?: number;
  filterBrandId?: number;

  searchQuery = '';
  /** Reactive subject for debounced keyword searching. */
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private brandService: BrandService,
    private dialog: MatDialog
  ) {
    // Pipeline for search input logic
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.searchQuery = searchText;
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  /** Loads reference data for filtering dropdowns. */
  loadCategories(): void {
    this.categoryService.getCategories(1, 100).subscribe({
      next: (res) => this.categories = res.items
    });
  }

  /** Primary data loading function for the table. */
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(
      this.currentPage,
      this.pageSize,
      this.filterBrandId,
      this.filterSubCategoryId,
      this.filterCategoryId,
      this.searchQuery
    ).subscribe({
      next: (result) => {
        this.products = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
      }
    });
  }

  /** Handler for material paginator events. */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadProducts();
  }

  /** Maps input events to the reactive search subject. */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue.trim());
  }

  onFilterCategoryChange(): void {
    this.filterSubCategoryId = undefined;
    this.filterBrandId = undefined;
    this.currentPage = 1;
    this.loadProducts();
  }

  onFilterSubCategoryChange(): void {
    this.filterBrandId = undefined;
    this.currentPage = 1;
    this.loadProducts();
  }

  onFilterBrandChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  /** Launches a modal dialog to enter new product data. */
  openCreateForm(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      data: { product: null, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          // File upload integration: Upload image first, then save entity
          let imageUrl = result.formValue.imageUrl;
          if (result.file) {
            const uploadRes = await this.productService.uploadImage(result.file).toPromise();
            imageUrl = uploadRes?.imageUrl;
          }

          const dto = { ...result.formValue, imageUrl };
          this.productService.createProduct(dto).subscribe({
            next: () => this.loadProducts(),
            error: (err) => console.error('Error creating product', err)
          });
        } catch (error) {
          console.error('Upload failed', error);
        }
      }
    });
  }

  /** Launches a modal dialog to modify an existing item. */
  openEditForm(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      data: { product, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          let imageUrl = result.formValue.imageUrl;
          if (result.file) {
            const uploadRes = await this.productService.uploadImage(result.file).toPromise();
            imageUrl = uploadRes?.imageUrl;
          }

          const dto = { ...result.formValue, imageUrl };
          this.productService.updateProduct(product.id, dto).subscribe({
            next: () => this.loadProducts(),
            error: (err) => console.error('Error updating product', err)
          });
        } catch (error) {
          console.error('Upload failed', error);
        }
      }
    });
  }

  /** Triggers a confirmation dialog before soft-deleting a product record. */
  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.productService.deleteProduct(id).subscribe({
          next: () => this.loadProducts(),
          error: (err) => console.error('Error deleting product', err)
        });
      }
    });
  }

  getImageUrl(product: Product): string {
    if (!product.imageUrl) return 'https://via.placeholder.com/100x100?text=No+Image';
    if (product.imageUrl.startsWith('http')) return product.imageUrl;
    return `${environment.imageBaseUrl}${product.imageUrl}`;
  }
}
