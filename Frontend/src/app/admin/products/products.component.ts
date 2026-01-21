import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { SubCategoryService, SubCategory } from '../../services/sub-category.service';
import { BrandService, Brand } from '../../services/brand.service';
import { Product, Category, CreateProductDto } from '../../core/models/ecommerce.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  // Form Dropdown Data
  formSubCategories: SubCategory[] = [];
  formBrands: Brand[] = [];

  // Filter Dropdown Data
  filterSubCategories: SubCategory[] = [];
  filterBrands: Brand[] = [];

  loading = true;
  showForm = false;
  productForm: FormGroup;
  editingId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Pagination & Filtering
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  filterCategoryId?: number;
  filterSubCategoryId?: number;
  filterBrandId?: number;

  // Form specific lists (separating filter lists from form lists might be needed if they differ, but for now simple)
  // Actually, for cascading in form, we use the same lists but trigger loads differently.
  // For filtering, we might want cascading too. 

  searchQuery = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private brandService: BrandService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],       // UI only
      subCategoryId: [null, [Validators.required]],    // UI only
      brandId: [null, [Validators.required]],          // DTO
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Needed for dropdown and filtering
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories(1, 100).subscribe({
      next: (res) => this.categories = res.items
    });
  }

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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  async uploadImage(): Promise<string | undefined> {
    if (!this.selectedFile) return undefined;

    try {
      const response = await this.productService.uploadImage(this.selectedFile).toPromise();
      return response?.imageUrl;
    } catch (error) {
      console.error('Image upload failed', error);
      alert('Image upload failed');
      throw error;
    }
  }

  // Cascading Logic - Form
  onCategoryChange(categoryId: number): void {
    this.productForm.patchValue({ subCategoryId: null, brandId: null });
    this.formSubCategories = [];
    this.formBrands = [];
    if (categoryId) {
      this.loadFormSubCategories(categoryId);
    }
  }

  onSubCategoryChange(subCategoryId: number): void {
    this.productForm.patchValue({ brandId: null });
    this.formBrands = [];
    if (subCategoryId) {
      this.loadFormBrands(subCategoryId);
    }
  }

  loadFormSubCategories(categoryId: number): void {
    this.subCategoryService.getSubCategories(1, 100, categoryId).subscribe({
      next: (res) => this.formSubCategories = res.items
    });
  }

  loadFormBrands(subCategoryId: number): void {
    this.brandService.getBrands(1, 100, subCategoryId).subscribe({
      next: (res) => this.formBrands = res.items
    });
  }

  // Cascading Logic - Filter
  onFilterCategoryChange(): void {
    this.filterSubCategoryId = undefined;
    this.filterBrandId = undefined;
    this.filterSubCategories = [];
    this.filterBrands = [];

    this.currentPage = 1;
    if (this.filterCategoryId) {
      this.loadFilterSubCategories(this.filterCategoryId);
    }
    this.loadProducts();
  }

  onFilterSubCategoryChange(): void {
    this.filterBrandId = undefined;
    this.filterBrands = [];

    this.currentPage = 1;
    if (this.filterSubCategoryId) {
      this.loadFilterBrands(this.filterSubCategoryId);
    }
    this.loadProducts();
  }

  onFilterBrandChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  loadFilterSubCategories(categoryId: number): void {
    this.subCategoryService.getSubCategories(1, 100, categoryId).subscribe({
      next: (res) => this.filterSubCategories = res.items
    });
  }

  loadFilterBrands(subCategoryId: number): void {
    this.brandService.getBrands(1, 100, subCategoryId).subscribe({
      next: (res) => this.filterBrands = res.items
    });
  }


  openCreateForm(): void {
    this.editingId = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.formSubCategories = [];
    this.formBrands = [];
    this.productForm.reset({ price: 0, stock: 0 });
    this.showForm = true;
  }

  openEditForm(product: Product): void {
    this.editingId = product.id;
    this.selectedFile = null;
    this.imagePreview = product.imageUrl || null;

    // Load dependencies first
    if (product.categoryId) this.loadFormSubCategories(product.categoryId);
    if (product.subCategoryId) this.loadFormBrands(product.subCategoryId);

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      brandId: product.brandId,
      imageUrl: product.imageUrl
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) return;

    try {
      let imageUrl = this.productForm.value.imageUrl;

      if (this.selectedFile) {
        imageUrl = await this.uploadImage();
      }

      const formValues = this.productForm.value;
      const dto: CreateProductDto = {
        name: formValues.name,
        description: formValues.description,
        price: formValues.price,
        stock: formValues.stock,
        brandId: formValues.brandId,
        imageUrl: imageUrl
      };

      if (this.editingId) {
        this.productService.updateProduct(this.editingId, dto).subscribe({
          next: () => {
            this.loadProducts();
            this.cancelForm();
          },
          error: (err) => console.error('Error updating product', err)
        });
      } else {
        this.productService.createProduct(dto).subscribe({
          next: () => {
            this.loadProducts();
            this.cancelForm();
          },
          error: (err) => console.error('Error creating product', err)
        });
      }
    } catch (error) {
      // Error handled in uploadImage
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error deleting product', err)
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  getImageUrl(product: Product): string {
    if (!product.imageUrl) return 'https://via.placeholder.com/100x100?text=No+Image';
    if (product.imageUrl.startsWith('http')) return product.imageUrl;
    return `${environment.imageBaseUrl}${product.imageUrl}`;
  }
}
