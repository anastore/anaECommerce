import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService, Brand } from '../../services/brand.service';
import { SubCategoryService, SubCategory } from '../../services/sub-category.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/ecommerce.models';

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styles: []
})
export class BrandsComponent implements OnInit {
    brands: Brand[] = [];
    subCategories: SubCategory[] = [];
    categories: Category[] = [];
    loading = true;
    showForm = false;
    brandForm: FormGroup;
    editingId: number | null = null;

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalCount = 0;
    totalPages = 0;

    constructor(
        private brandService: BrandService,
        private subCategoryService: SubCategoryService,
        private categoryService: CategoryService,
        private fb: FormBuilder
    ) {
        this.brandForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500)]],
            subCategoryId: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadBrands();
        this.loadSubCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories(1, 100).subscribe({
            next: (result: any) => {
                this.categories = Array.isArray(result) ? result : (result.items || []);
            },
            error: (err) => console.error('Error loading categories', err)
        });
    }

    getCategoryNameBySubId(subCategoryId: number): string {
        if (!this.subCategories || !this.categories) return 'Unknown';

        // 1. Find the subcategory
        const sub = this.subCategories.find(s => s.id === subCategoryId);
        if (!sub) return 'Unknown';

        // 2. Return category name from subcategory if present
        if (sub.categoryName) return sub.categoryName;

        // 3. Fallback: Find category name using sub.categoryId
        const category = this.categories.find(c => c.id === sub.categoryId);
        return category ? category.name : 'Unknown';
    }

    loadSubCategories(): void {
        // Load all subcategories for the dropdown (pagination limit high)
        this.subCategoryService.getSubCategories(1, 100).subscribe({
            next: (result: any) => {
                this.subCategories = Array.isArray(result) ? result : (result.items || []);
            },
            error: (err) => console.error('Error loading subcategories', err)
        });
    }

    loadBrands(): void {
        this.loading = true;
        this.brandService.getBrands(this.currentPage, this.pageSize).subscribe({
            next: (result: any) => {
                // Defensive check: if result is array (legacy/stale backend), handle it.
                if (Array.isArray(result)) {
                    this.brands = result;
                    this.totalCount = result.length;
                    this.totalPages = 1;
                } else {
                    // Correct PaginatedResult
                    this.brands = result.items || [];
                    this.totalCount = result.totalCount;
                    this.totalPages = result.totalPages;
                }
                this.loading = false;
                console.log('Loaded brands:', this.brands);
            },
            error: (err) => {
                console.error('Error loading brands', err);
                this.loading = false;
            }
        });
    }

    openCreateForm(): void {
        this.editingId = null;
        this.brandForm.reset();
        this.showForm = true;
    }

    openEditForm(brand: Brand): void {
        this.editingId = brand.id;
        this.brandForm.patchValue({
            name: brand.name,
            description: brand.description,
            subCategoryId: brand.subCategoryId
        });
        this.showForm = true;
    }

    cancelForm(): void {
        this.showForm = false;
        this.editingId = null;
        this.brandForm.reset();
    }

    onSubmit(): void {
        if (this.brandForm.invalid) return;

        const dto = this.brandForm.value;

        if (this.editingId) {
            this.brandService.updateBrand(this.editingId, dto).subscribe({
                next: () => {
                    this.loadBrands();
                    this.cancelForm();
                },
                error: (err) => console.error('Error updating brand', err)
            });
        } else {
            this.brandService.createBrand(dto).subscribe({
                next: () => {
                    this.loadBrands();
                    this.cancelForm();
                },
                error: (err) => console.error('Error creating brand', err)
            });
        }
    }

    deleteBrand(id: number): void {
        if (!confirm('Are you sure you want to delete this brand?')) return;

        this.brandService.deleteBrand(id).subscribe({
            next: () => this.loadBrands(),
            error: (err) => {
                alert('Cannot delete brand. Ensure it has no products associated.');
                console.error(err);
            }
        });
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadBrands();
    }

    getSubCategoryName(subCategoryId: number): string {
        if (!this.subCategories) return 'Unknown';
        const sub = this.subCategories.find(s => s.id === subCategoryId);
        return sub ? sub.name : 'Unknown';
    }
}
