import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category, CreateCategoryDto } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  showForm = false;
  categoryForm: FormGroup;
  editingId: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories(this.currentPage, this.pageSize).subscribe({
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

  openCreateForm(): void {
    this.editingId = null;
    this.categoryForm.reset();
    this.showForm = true;
  }

  openEditForm(category: Category): void {
    this.editingId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const dto: CreateCategoryDto = this.categoryForm.value;

    if (this.editingId) {
      this.categoryService.updateCategory(this.editingId, dto).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelForm();
        },
        error: (err) => console.error('Error updating category', err)
      });
    } else {
      this.categoryService.createCategory(dto).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelForm();
        },
        error: (err) => console.error('Error creating category', err)
      });
    }
  }

  deleteCategory(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => {
        alert('Cannot delete category. Even admin cannot delete category with products.');
        console.error(err);
      }
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }
}
