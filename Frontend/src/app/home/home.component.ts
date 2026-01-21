import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product.service';
import { CategoryService } from '../core/services/category.service';
import { SubCategoryService, SubCategory } from '../services/sub-category.service';
import { BrandService, Brand } from '../services/brand.service';
import { Product, Category } from '../core/models/ecommerce.models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  brands: Brand[] = [];
  loading = true;
  selectedCategoryId?: number;
  selectedSubCategoryId?: number;
  selectedBrandId?: number;
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories(1, 100).subscribe({
      next: (result: any) => {
        this.categories = Array.isArray(result) ? result : (result.items || []);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(
      this.currentPage,
      this.pageSize,
      this.selectedBrandId,
      this.selectedSubCategoryId,
      this.selectedCategoryId
    ).subscribe({
      next: (result: any) => {
        if (Array.isArray(result)) {
          this.products = result;
          this.totalPages = 1;
        } else {
          this.products = result.items || [];
          this.totalPages = result.totalPages || 1;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onCategoryChange(categoryId?: number): void {
    console.log('Category Selection Changed:', categoryId);
    this.selectedCategoryId = categoryId;
    this.selectedSubCategoryId = undefined;
    this.selectedBrandId = undefined;
    this.subCategories = [];
    this.brands = [];
    this.currentPage = 1;

    if (categoryId) {
      this.loadSubCategories(categoryId);
    }
    this.loadProducts();
  }

  onSubCategoryChange(subCategoryId?: number): void {
    console.log('SubCategory Selection Changed:', subCategoryId);
    this.selectedSubCategoryId = subCategoryId;
    this.selectedBrandId = undefined;
    this.brands = [];
    this.currentPage = 1;

    if (subCategoryId) {
      this.loadBrands(subCategoryId);
    }
    this.loadProducts();
  }

  onBrandChange(brandId?: number): void {
    console.log('Brand Selection Changed:', brandId);
    this.selectedBrandId = brandId;
    this.currentPage = 1;
    this.loadProducts();
  }

  loadSubCategories(categoryId: number): void {
    this.subCategoryService.getSubCategories(1, 100, categoryId).subscribe({
      next: (res: any) => {
        this.subCategories = Array.isArray(res) ? res : (res.items || []);
        console.log('Loaded SubCategories:', this.subCategories);
      },
      error: (err) => console.error('Error loading subcategories', err)
    });
  }

  loadBrands(subCategoryId: number): void {
    this.brandService.getBrands(1, 100, subCategoryId).subscribe({
      next: (res: any) => {
        this.brands = Array.isArray(res) ? res : (res.items || []);
        console.log('Loaded Brands:', this.brands);
      },
      error: (err) => console.error('Error loading brands', err)
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getImageUrl(product: Product): string {
    if (!product.imageUrl) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (product.imageUrl.startsWith('http')) return product.imageUrl;
    return `${environment.imageBaseUrl}${product.imageUrl}`;
  }
}
