import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderStatus } from '../../../core/models/ecommerce.models';

@Component({
    selector: 'app-order-status-form',
    template: `
    <h2 mat-dialog-title>{{ 'ADMIN.ORDERS.STATUS' | translate }}</h2>
    <mat-dialog-content>
      <div class="py-2">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'ADMIN.ORDERS.STATUS' | translate }}</mat-label>
          <mat-select [(value)]="selectedStatus">
            <mat-option *ngFor="let s of statuses" [value]="s.value">
              {{ s.key | translate }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'COMMON.ACTIONS.CANCEL' | translate }}</button>
      <button mat-raised-button color="primary" (click)="onConfirm()">{{ 'COMMON.ACTIONS.SAVE' | translate }}</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .w-full { width: 100%; }
  `]
})
export class OrderStatusFormComponent {
    selectedStatus: OrderStatus;
    statuses = [
        { value: OrderStatus.Pending, key: 'ADMIN.ORDERS.STATUSES.PENDING' },
        { value: OrderStatus.Processing, key: 'ADMIN.ORDERS.STATUSES.PROCESSING' },
        { value: OrderStatus.Shipped, key: 'ADMIN.ORDERS.STATUSES.SHIPPED' },
        { value: OrderStatus.Delivered, key: 'ADMIN.ORDERS.STATUSES.DELIVERED' },
        { value: OrderStatus.Cancelled, key: 'ADMIN.ORDERS.STATUSES.CANCELLED' }
    ];

    constructor(
        public dialogRef: MatDialogRef<OrderStatusFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { status: OrderStatus }
    ) {
        this.selectedStatus = data.status;
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onConfirm(): void {
        this.dialogRef.close(this.selectedStatus);
    }
}
