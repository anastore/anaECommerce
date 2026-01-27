import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Brand } from '../../../services/brand.service';
import { SubCategory } from '../../../services/sub-category.service';

@Component({
    selector: 'app-brand-form',
    template: `
    <h2 mat-dialog-title>{{ data.brand ? ('ADMIN.BRANDS.EDIT' | translate) : ('ADMIN.BRANDS.NEW' | translate) }}</h2>
    <form [formGroup]="brandForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="grid grid-cols-1 gap-4 py-2">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.BRANDS.NAME' | translate }}</mat-label>
            <input matInput formControlName="name" [placeholder]="'ADMIN.BRANDS.PLACEHOLDERS.NAME' | translate">
            <mat-error *ngIf="brandForm.get('name')?.hasError('required')">{{ 'COMMON.VALIDATION.REQUIRED' | translate }}</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.BRANDS.SUBCATEGORY' | translate }}</mat-label>
            <mat-select formControlName="subCategoryId">
              <mat-option *ngFor="let sub of data.subCategories" [value]="sub.id">
                {{ sub.name }} ({{ sub.categoryName }})
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'ADMIN.BRANDS.DESCRIPTION' | translate }}</mat-label>
            <textarea matInput formControlName="description" rows="3" [placeholder]="'ADMIN.BRANDS.PLACEHOLDERS.DESC' | translate"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">{{ 'COMMON.ACTIONS.CANCEL' | translate }}</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="brandForm.invalid">
          {{ 'COMMON.ACTIONS.SAVE' | translate }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
    styles: [`
    .w-full { width: 100%; }
  `]
})
export class BrandFormComponent implements OnInit {
    brandForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<BrandFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { brand: Brand | null, subCategories: SubCategory[] }
    ) {
        this.brandForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500)]],
            subCategoryId: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        if (this.data.brand) {
            this.brandForm.patchValue({
                name: this.data.brand.name,
                description: this.data.brand.description,
                subCategoryId: this.data.brand.subCategoryId
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.brandForm.valid) {
            this.dialogRef.close(this.brandForm.value);
        }
    }
}
