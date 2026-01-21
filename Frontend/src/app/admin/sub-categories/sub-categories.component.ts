import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubCategoryService, SubCategory } from '../../services/sub-category.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/ecommerce.models';

@Component({
    selector: 'app-sub-categories',
    templateUrl: './sub-categories.component.html',
    styles: []
})
export class SubCategoriesComponent implements OnInit {
    subCategories: SubCategory[] = [];
    categories: Category[] = [];
    loading = true;
    showForm = false;
    subCategoryForm: FormGroup;
    editingId: number | null = null;

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalCount = 0;
    totalPages = 0;

    constructor(
        private subCategoryService: SubCategoryService,
        private categoryService: CategoryService,
        private fb: FormBuilder
    ) {
        this.subCategoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500)]],
            categoryId: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadSubCategories();
    }

    loadCategories(): void {
        // Load all categories for the dropdown (assuming < 100 for now, or we could paginate dropdown)
        this.categoryService.getCategories(1, 100).subscribe({
            next: (result: any) => {
                this.categories = Array.isArray(result) ? result : (result.items || []);
                console.log('Loaded categories:', this.categories);
            },
            error: (err) => console.error('Error loading categories', err)
        });
    }

    loadSubCategories(): void {
        this.loading = true;
        this.subCategoryService.getSubCategories(this.currentPage, this.pageSize).subscribe({
            next: (result: any) => {
                // Defensive check: if result is array (legacy/stale backend), handle it.
                if (Array.isArray(result)) {
                    this.subCategories = result;
                    this.totalCount = result.length;
                    this.totalPages = 1;
                } else {
                    // Correct PaginatedResult
                    this.subCategories = result.items || [];
                    this.totalCount = result.totalCount;
                    this.totalPages = result.totalPages;
                }
                this.loading = false;
                console.log('Loaded subCategories:', this.subCategories);
            },
            error: (err) => {
                console.error('Error loading subcategories', err);
                this.loading = false;
            }
        });
    }

    openCreateForm(): void {
        this.editingId = null;
        this.subCategoryForm.reset();
        this.showForm = true;
    }

    openEditForm(subCategory: SubCategory): void {
        this.editingId = subCategory.id;
        this.subCategoryForm.patchValue({
            name: subCategory.name,
            description: subCategory.description,
            categoryId: subCategory.categoryId
        });
        this.showForm = true;
    }

    cancelForm(): void {
        this.showForm = false;
        this.editingId = null;
        this.subCategoryForm.reset();
    }

    onSubmit(): void {
        if (this.subCategoryForm.invalid) return;

        const dto = this.subCategoryForm.value;

        if (this.editingId) {
            this.subCategoryService.updateSubCategory(this.editingId, dto).subscribe({
                next: () => {
                    this.loadSubCategories();
                    this.cancelForm();
                },
                error: (err) => console.error('Error updating subcategory', err)
            });
        } else {
            this.subCategoryService.createSubCategory(dto).subscribe({
                next: () => {
                    this.loadSubCategories();
                    this.cancelForm();
                },
                error: (err) => console.error('Error creating subcategory', err)
            });
        }
    }

    deleteSubCategory(id: number): void {
        if (!confirm('Are you sure you want to delete this subcategory?')) return;

        this.subCategoryService.deleteSubCategory(id).subscribe({
            next: () => this.loadSubCategories(),
            error: (err) => {
                alert('Cannot delete subcategory. Ensure it has no brands associated.');
                console.error(err);
            }
        });
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadSubCategories();
    }

    getCategoryName(categoryId: number): string {
        if (!this.categories) return 'Unknown';
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    }
}
