import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserSession } from '../models/user';


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (!password || !confirm) return null;

  if ((password.value || confirm.value) && password.value !== confirm.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: UserSession | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showDeleteConfirm = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.profileForm = this.fb.group(
      {
        firstName: [this.currentUser.firstName, [Validators.required, Validators.minLength(2)]],
        lastName: [this.currentUser.lastName, [Validators.required, Validators.minLength(2)]],
        email: [this.currentUser.email, [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]],   // optionnel
        confirmPassword: ['']
      },
      { validators: passwordMatchValidator }
    );
  }


  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get email() { return this.profileForm.get('email'); }
  get password() { return this.profileForm.get('password'); }
  get confirmPassword() { return this.profileForm.get('confirmPassword'); }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const changes: any = {};
    const formValue = this.profileForm.value;

    if (this.firstName?.dirty && formValue.firstName !== this.currentUser?.firstName) {
      changes.firstName = formValue.firstName;
    }
    if (this.lastName?.dirty && formValue.lastName !== this.currentUser?.lastName) {
      changes.lastName = formValue.lastName;
    }
    if (this.email?.dirty && formValue.email !== this.currentUser?.email) {
      changes.email = formValue.email;
    }
    if (this.password?.dirty && formValue.password) {
      changes.password = formValue.password;
    }

    if (Object.keys(changes).length === 0) {
      this.isLoading = false;
      this.successMessage = 'Aucune modification détectée.';
      return;
    }

    this.authService.updateProfile(this.currentUser!.id, changes).subscribe({
      next: (updatedSession) => {
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès.';
        this.profileForm.patchValue({
          firstName: updatedSession.firstName,
          lastName: updatedSession.lastName,
          email: updatedSession.email
        });
        this.profileForm.patchValue({ password: '', confirmPassword: '' });
        this.profileForm.markAsPristine();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur lors de la mise à jour.';
      }
    });
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  confirmDelete(): void {
    this.isLoading = true;
    this.authService.deleteAccount(this.currentUser!.id).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur lors de la suppression du compte.';
        this.showDeleteConfirm = false;
      }
    });
  }
}
