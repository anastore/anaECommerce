import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../core/models/ecommerce.models';
import { SubCategory } from '../../../services/sub-category.service';

@Component({
    selector: 'app-sub-category-form',
    template: `
    <h2 mat-dialog-title>{{ data.subCategory ? ('ADMIN.SUBCATEGORIES.EDIT' | translate) : ('ADMIN.SUBCATEGORIES.NEW' | translate) }}</h2>
    <form [formGroup]="subCategoryForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="grid grid-cols-1 gap-4 py-2">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.SUBCATEGORIES.NAME' | translate }}</mat-label>
            <input matInput formControlName="name" [placeholder]="'ADMIN.SUBCATEGORIES.PLACEHOLDERS.NAME' | translate">
            <mat-error *ngIf="subCategoryForm.get('name')?.hasError('required')">{{ 'COMMON.VALIDATION.REQUIRED' | translate }}</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.SUBCATEGORIES.CATEGORY' | translate }}</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option *ngFor="let cat of data.categories" [value]="cat.id">{{ cat.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.SUBCATEGORIES.DESCRIPTION' | translate }}</mat-label>
            <textarea matInput formControlName="description" rows="3" [placeholder]="'ADMIN.SUBCATEGORIES.PLACEHOLDERS.DESC' | translate"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">{{ 'COMMON.ACTIONS.CANCEL' | translate }}</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="subCategoryForm.invalid">
          {{ 'COMMON.ACTIONS.SAVE' | translate }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
    styles: [`
    .w-full { width: 100%; }
  `]
})
export class SubCategoryFormComponent implements OnInit {
    subCategoryForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<SubCategoryFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { subCategory: SubCategory | null, categories: Category[] }
    ) {
        this.subCategoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500)]],
            categoryId: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        if (this.data.subCategory) {
            this.subCategoryForm.patchValue({
                name: this.data.subCategory.name,
                description: this.data.subCategory.description,
                categoryId: this.data.subCategory.categoryId
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.subCategoryForm.valid) {
            this.dialogRef.close(this.subCategoryForm.value);
        }
    }
}
