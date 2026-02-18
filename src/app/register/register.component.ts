import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password');
  const cpw = control.get('confirmPassword');
  if (pw && cpw && pw.value !== cpw.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName:  ['', [Validators.required, Validators.minLength(2)]],
        email:     ['', [Validators.required, Validators.email]],
        password:  ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator }
    );
  }

  get firstName()       { return this.registerForm.get('firstName'); }
  get lastName()        { return this.registerForm.get('lastName'); }
  get email()           { return this.registerForm.get('email'); }
  get password()        { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { firstName, lastName, email, password } = this.registerForm.value;

    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/jobs']);
      },
      error: (err:any) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Une erreur est survenue.';
      }
    });
  }
}
