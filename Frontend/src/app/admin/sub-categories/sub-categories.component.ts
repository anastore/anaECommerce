import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubCategoryService, SubCategory } from '../../services/sub-category.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/ecommerce.models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { SubCategoryFormComponent } from './sub-category-form/sub-category-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-sub-categories',
    templateUrl: './sub-categories.component.html',
    styles: []
})
export class SubCategoriesComponent implements OnInit {
    subCategories: SubCategory[] = [];
    categories: Category[] = [];
    loading = true;

    // Pagination & Filtering
    currentPage = 1;
    pageSize = 10;
    totalCount = 0;
    totalPages = 0;
    searchString = '';
    private searchSubject = new Subject<string>();

    constructor(
        private subCategoryService: SubCategoryService,
        private categoryService: CategoryService,
        private dialog: MatDialog
    ) {
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(searchText => {
            this.searchString = searchText;
            this.currentPage = 1;
            this.loadSubCategories();
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadSubCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories(1, 100).subscribe({
            next: (result) => {
                this.categories = result.items || [];
            },
            error: (err) => console.error('Error loading categories', err)
        });
    }

    loadSubCategories(): void {
        this.loading = true;
        this.subCategoryService.getSubCategories(this.currentPage, this.pageSize, undefined, this.searchString).subscribe({
            next: (result) => {
                this.subCategories = result.items || [];
                this.totalCount = result.totalCount;
                this.totalPages = result.totalPages;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading subcategories', err);
                this.loading = false;
            }
        });
    }

    onPageChange(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.loadSubCategories();
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchSubject.next(filterValue.trim());
    }

    openCreateForm(): void {
        const dialogRef = this.dialog.open(SubCategoryFormComponent, {
            width: '500px',
            data: { subCategory: null, categories: this.categories }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.subCategoryService.createSubCategory(result).subscribe({
                    next: () => this.loadSubCategories(),
                    error: (err) => console.error('Error creating subcategory', err)
                });
            }
        });
    }

    openEditForm(subCategory: SubCategory): void {
        const dialogRef = this.dialog.open(SubCategoryFormComponent, {
            width: '500px',
            data: { subCategory, categories: this.categories }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.subCategoryService.updateSubCategory(subCategory.id, result).subscribe({
                    next: () => this.loadSubCategories(),
                    error: (err) => console.error('Error updating subcategory', err)
                });
            }
        });
    }

    deleteSubCategory(id: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete SubCategory',
                message: 'Are you sure you want to delete this subcategory?'
            }
        });

        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.subCategoryService.deleteSubCategory(id).subscribe({
                    next: () => this.loadSubCategories(),
                    error: (err) => {
                        alert('Cannot delete subcategory. Ensure it has no brands associated.');
                        console.error(err);
                    }
                });
            }
        });
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    }
}
