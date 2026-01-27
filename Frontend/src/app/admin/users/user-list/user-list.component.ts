import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { UserService, User } from '../../../core/services/user.service';
import { RolesService, Role } from '../../../core/services/roles.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    displayedColumns: string[] = ['fullName', 'email', 'role', 'actions'];
    dataSource = new MatTableDataSource<User>();
    roles: Role[] = [];
    loading = false;

    // Pagination
    totalCount = 0;
    pageSize = 10;
    pageNumber = 1;
    searchString = '';
    private searchSubject = new Subject<string>();

    constructor(
        private userService: UserService,
        private rolesService: RolesService,
        private dialog: MatDialog
    ) {
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((searchText) => {
            this.searchString = searchText;
            this.pageNumber = 1;
            this.loadUsers();
        });
    }

    ngOnInit(): void {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers() {
        this.loading = true;
        this.userService.getUsers(this.pageNumber, this.pageSize, this.searchString).subscribe({
            next: (result) => {
                this.dataSource.data = result.items;
                this.totalCount = result.totalCount;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading users:', error);
                this.loading = false;
            }
        });
    }

    loadRoles() {
        this.rolesService.getAllRoles().subscribe({
            next: (roles) => {
                this.roles = roles;
            },
            error: (error) => {
                console.error('Error loading roles:', error);
            }
        });
    }

    editUser(user: User) {
        const dialogRef = this.dialog.open(UserEditComponent, {
            width: '500px',
            data: { user, roles: this.roles }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadUsers();
            }
        });
    }

    deleteUser(user: User) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete User',
                message: `Are you sure you want to delete ${user.fullName}?`
            }
        });

        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.userService.deleteUser(user.id).subscribe({
                    next: () => {
                        this.loadUsers();
                    },
                    error: (error) => {
                        console.error('Error deleting user:', error);
                    }
                });
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchSubject.next(filterValue.trim());
    }

    onPageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageNumber = event.pageIndex + 1;
        this.loadUsers();
    }
}
