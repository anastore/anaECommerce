import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService, User } from '../../../core/services/user.service';
import { RolesService, Role } from '../../../core/services/roles.service';
import { UserEditComponent } from '../user-edit/user-edit.component';

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

    constructor(
        private userService: UserService,
        private rolesService: RolesService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers() {
        this.loading = true;
        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.dataSource.data = users;
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
        if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
            this.userService.deleteUser(user.id).subscribe({
                next: () => {
                    this.loadUsers();
                },
                error: (error) => {
                    console.error('Error deleting user:', error);
                    alert('Failed to delete user');
                }
            });
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
