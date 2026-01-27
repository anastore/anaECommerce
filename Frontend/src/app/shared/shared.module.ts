import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
    declarations: [
        PaginationComponent,
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        MatPaginatorModule,
        MatDialogModule,
        MatButtonModule,
        TranslateModule
    ],
    exports: [
        PaginationComponent,
        ConfirmDialogComponent
    ]
})
export class SharedModule { }
