import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/ecommerce.models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { CategoryFormComponent } from './category-form/category-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
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
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.searchString = searchText;
      this.currentPage = 1;
      this.loadCategories();
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories(this.currentPage, this.pageSize, this.searchString).subscribe({
      next: (result) => {
        this.categories = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadCategories();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue.trim());
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      data: { category: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.createCategory(result).subscribe({
          next: () => this.loadCategories(),
          error: (err) => console.error('Error creating category', err)
        });
      }
    });
  }

  openEditForm(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.updateCategory(category.id, result).subscribe({
          next: () => this.loadCategories(),
          error: (err) => console.error('Error updating category', err)
        });
      }
    });
  }

  deleteCategory(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Category',
        message: 'Are you sure you want to delete this category? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => this.loadCategories(),
          error: (err) => {
            alert('Cannot delete category. Even admin cannot delete category with products.');
            console.error(err);
          }
        });
      }
    });
  }
}
