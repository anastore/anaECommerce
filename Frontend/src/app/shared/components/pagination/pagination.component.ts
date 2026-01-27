import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-pagination',
    template: `
    <div class="flex justify-center p-4">
      <mat-paginator 
        [length]="length"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        [pageIndex]="pageIndex"
        (page)="onPage($event)"
        aria-label="Select page">
      </mat-paginator>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
    }
    ::ng-deep .mat-mdc-paginator {
      background: transparent !important;
    }
  `]
})
export class PaginationComponent {
    @Input() length = 0;
    @Input() pageSize = 10;
    @Input() pageIndex = 0;
    @Input() pageSizeOptions = [5, 10, 25, 50];

    @Output() page = new EventEmitter<PageEvent>();

    onPage(event: PageEvent) {
        this.page.emit(event);
    }
}
