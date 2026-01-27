import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product, Category, CreateProductDto } from '../../../core/models/ecommerce.models';
import { SubCategoryService, SubCategory } from '../../../services/sub-category.service';
import { BrandService, Brand } from '../../../services/brand.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-product-form',
    template: `
    <h2 mat-dialog-title>{{ data.product ? ('ADMIN.PRODUCTS.EDIT' | translate) : ('ADMIN.PRODUCTS.NEW' | translate) }}</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <!-- Image Section -->
          <div class="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div *ngIf="imagePreview" class="mb-4">
              <img [src]="imagePreview" class="h-32 object-contain rounded">
            </div>
            <label class="btn btn-secondary cursor-pointer">
              <input type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              <span class="flex items-center gap-2">
                <mat-icon>upload</mat-icon> {{ 'ADMIN.PRODUCTS.UPLOAD' | translate }}
              </span>
            </label>
          </div>

          <!-- Basic Info -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.PRODUCTS.NAME' | translate }}</mat-label>
            <input matInput formControlName="name" [placeholder]="'ADMIN.PRODUCTS.PLACEHOLDERS.NAME' | translate">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.PRODUCTS.CATEGORY' | translate }}</mat-label>
            <mat-select formControlName="categoryId" (selectionChange)="onCategoryChange($event.value)">
              <mat-option *ngFor="let cat of data.categories" [value]="cat.id">{{ cat.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.PRODUCTS.SUBCATEGORY' | translate }}</mat-label>
            <mat-select formControlName="subCategoryId" (selectionChange)="onSubCategoryChange($event.value)">
              <mat-option *ngFor="let sub of subCategories" [value]="sub.id">{{ sub.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.PRODUCTS.BRAND' | translate }}</mat-label>
            <mat-select formControlName="brandId">
              <mat-option *ngFor="let brand of brands" [value]="brand.id">{{ brand.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.PRODUCTS.PRICE' | translate }}</mat-label>
            <input matInput type="number" formControlName="price" step="0.01">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.PRODUCTS.STOCK' | translate }}</mat-label>
            <input matInput type="number" formControlName="stock">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-span-1 md:col-span-2 w-full">
            <mat-label>{{ 'ADMIN.PRODUCTS.DESCRIPTION' | translate }}</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">{{ 'COMMON.ACTIONS.CANCEL' | translate }}</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid">
          {{ 'COMMON.ACTIONS.SAVE' | translate }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
    styles: [`
    .w-full { width: 100%; }
    .btn { @apply px-4 py-2 rounded font-medium transition-colors; }
    .btn-secondary { @apply bg-gray-100 text-gray-700 hover:bg-gray-200; }
  `]
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    subCategories: SubCategory[] = [];
    brands: Brand[] = [];
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        private fb: FormBuilder,
        private subCategoryService: SubCategoryService,
        private brandService: BrandService,
        public dialogRef: MatDialogRef<ProductFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { product: Product | null, categories: Category[] }
    ) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(200)]],
            description: ['', [Validators.maxLength(2000)]],
            price: [0, [Validators.required, Validators.min(0.01)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            categoryId: [null, [Validators.required]],
            subCategoryId: [null, [Validators.required]],
            brandId: [null, [Validators.required]],
            imageUrl: ['']
        });
    }

    ngOnInit(): void {
        if (this.data.product) {
            if (this.data.product.categoryId) this.loadSubCategories(this.data.product.categoryId);
            if (this.data.product.subCategoryId) this.loadBrands(this.data.product.subCategoryId);

            this.productForm.patchValue({
                name: this.data.product.name,
                description: this.data.product.description,
                price: this.data.product.price,
                stock: this.data.product.stock,
                categoryId: this.data.product.categoryId,
                subCategoryId: this.data.product.subCategoryId,
                brandId: this.data.product.brandId,
                imageUrl: this.data.product.imageUrl
            });

            if (this.data.product.imageUrl) {
                this.imagePreview = this.data.product.imageUrl.startsWith('http')
                    ? this.data.product.imageUrl
                    : `${environment.imageBaseUrl}${this.data.product.imageUrl}`;
            }
        }
    }

    onCategoryChange(categoryId: number): void {
        this.productForm.patchValue({ subCategoryId: null, brandId: null });
        this.subCategories = [];
        this.brands = [];
        if (categoryId) this.loadSubCategories(categoryId);
    }

    onSubCategoryChange(subCategoryId: number): void {
        this.productForm.patchValue({ brandId: null });
        this.brands = [];
        if (subCategoryId) this.loadBrands(subCategoryId);
    }

    loadSubCategories(categoryId: number): void {
        this.subCategoryService.getSubCategories(1, 100, categoryId).subscribe({
            next: (res) => this.subCategories = res.items
        });
    }

    loadBrands(subCategoryId: number): void {
        this.brandService.getBrands(1, 100, subCategoryId).subscribe({
            next: (res) => this.brands = res.items
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => this.imagePreview = e.target.result;
            reader.readAsDataURL(file);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.productForm.valid) {
            this.dialogRef.close({
                formValue: this.productForm.value,
                file: this.selectedFile
            });
        }
    }
}
