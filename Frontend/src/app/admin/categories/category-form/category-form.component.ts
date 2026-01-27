import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../core/models/ecommerce.models';

@Component({
    selector: 'app-category-form',
    template: `
    <h2 mat-dialog-title>{{ data.category ? ('ADMIN.CATEGORIES.EDIT' | translate) : ('ADMIN.CATEGORIES.NEW' | translate) }}</h2>
    <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="grid grid-cols-1 gap-4 py-2">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.CATEGORIES.NAME' | translate }}</mat-label>
            <input matInput formControlName="name" [placeholder]="'ADMIN.CATEGORIES.PLACEHOLDERS.NAME' | translate">
            <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
              {{ 'COMMON.VALIDATION.REQUIRED' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.CATEGORIES.DESCRIPTION' | translate }}</mat-label>
            <textarea matInput formControlName="description" rows="3" [placeholder]="'ADMIN.CATEGORIES.PLACEHOLDERS.DESC' | translate"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">{{ 'COMMON.ACTIONS.CANCEL' | translate }}</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="categoryForm.invalid">
          {{ 'COMMON.ACTIONS.SAVE' | translate }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
    styles: [`
    .w-full { width: 100%; }
  `]
})
export class CategoryFormComponent implements OnInit {
    categoryForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CategoryFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { category: Category | null }
    ) {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500)]]
        });
    }

    ngOnInit(): void {
        if (this.data.category) {
            this.categoryForm.patchValue({
                name: this.data.category.name,
                description: this.data.category.description
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.categoryForm.valid) {
            this.dialogRef.close(this.categoryForm.value);
        }
    }
}
