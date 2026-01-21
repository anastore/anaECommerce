import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService, User, UpdateUser, AssignRole } from '../../../core/services/users.service';
import { Role } from '../../../core/services/roles.service';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
    userForm: FormGroup;
    roles: Role[];
    loading = false;

    constructor(
        private fb: FormBuilder,
        private usersService: UsersService,
        public dialogRef: MatDialogRef<UserEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User, roles: Role[] }
    ) {
        this.roles = data.roles;
        this.userForm = this.fb.group({
            fullName: [data.user.fullName, Validators.required],
            email: [data.user.email, [Validators.required, Validators.email]],
            role: [data.user.role, Validators.required]
        });
    }

    ngOnInit() { }

    onSubmit() {
        if (this.userForm.valid) {
            this.loading = true;
            const updateUser: UpdateUser = {
                fullName: this.userForm.value.fullName,
                email: this.userForm.value.email
            };

            this.usersService.updateUser(this.data.user.id, updateUser).subscribe({
                next: () => {
                    // If role changed, update role
                    if (this.userForm.value.role !== this.data.user.role) {
                        const assignRole: AssignRole = {
                            roleName: this.userForm.value.role
                        };
                        this.usersService.assignRole(this.data.user.id, assignRole).subscribe({
                            next: () => {
                                this.loading = false;
                                this.dialogRef.close(true);
                            },
                            error: (error) => {
                                console.error('Error assigning role:', error);
                                this.loading = false;
                                alert('Failed to assign role');
                            }
                        });
                    } else {
                        this.loading = false;
                        this.dialogRef.close(true);
                    }
                },
                error: (error) => {
                    console.error('Error updating user:', error);
                    this.loading = false;
                    alert('Failed to update user');
                }
            });
        }
    }

    onCancel() {
        this.dialogRef.close();
    }
}
