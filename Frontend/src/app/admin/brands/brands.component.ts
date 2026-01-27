import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrandService, Brand } from '../../services/brand.service';
import { SubCategoryService, SubCategory } from '../../services/sub-category.service';
import { CategoryService } from '../../core/services/category.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { BrandFormComponent } from './brand-form/brand-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styles: []
})
export class BrandsComponent implements OnInit {
    brands: Brand[] = [];
    subCategories: SubCategory[] = [];
    loading = true;

    // Pagination & Filtering
    currentPage = 1;
    pageSize = 10;
    totalCount = 0;
    totalPages = 0;
    searchString = '';
    private searchSubject = new Subject<string>();

    constructor(
        private brandService: BrandService,
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
            this.loadBrands();
        });
    }

    ngOnInit(): void {
        this.loadBrands();
        this.loadSubCategories();
    }

    loadSubCategories(): void {
        this.subCategoryService.getSubCategories(1, 100).subscribe({
            next: (result) => {
                this.subCategories = result.items || [];
            },
            error: (err) => console.error('Error loading subcategories', err)
        });
    }

    loadBrands(): void {
        this.loading = true;
        this.brandService.getBrands(this.currentPage, this.pageSize, undefined, this.searchString).subscribe({
            next: (result) => {
                this.brands = result.items || [];
                this.totalCount = result.totalCount;
                this.totalPages = result.totalPages;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading brands', err);
                this.loading = false;
            }
        });
    }

    onPageChange(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.loadBrands();
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchSubject.next(filterValue.trim());
    }

    openCreateForm(): void {
        const dialogRef = this.dialog.open(BrandFormComponent, {
            width: '500px',
            data: { brand: null, subCategories: this.subCategories }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.brandService.createBrand(result).subscribe({
                    next: () => this.loadBrands(),
                    error: (err) => console.error('Error creating brand', err)
                });
            }
        });
    }

    openEditForm(brand: Brand): void {
        const dialogRef = this.dialog.open(BrandFormComponent, {
            width: '500px',
            data: { brand, subCategories: this.subCategories }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.brandService.updateBrand(brand.id, result).subscribe({
                    next: () => this.loadBrands(),
                    error: (err) => console.error('Error updating brand', err)
                });
            }
        });
    }

    deleteBrand(id: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete Brand',
                message: 'Are you sure you want to delete this brand?'
            }
        });

        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.brandService.deleteBrand(id).subscribe({
                    next: () => this.loadBrands(),
                    error: (err) => {
                        alert('Cannot delete brand. Ensure it has no products associated.');
                        console.error(err);
                    }
                });
            }
        });
    }

    getCategoryNameBySubId(subCategoryId: number): string {
        const sub = this.subCategories.find(s => s.id === subCategoryId);
        return sub ? sub.categoryName : 'Unknown';
    }

    getSubCategoryName(subCategoryId: number): string {
        const sub = this.subCategories.find(s => s.id === subCategoryId);
        return sub ? sub.name : 'Unknown';
    }
}
