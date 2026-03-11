import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loginError = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected submit(): void {
    this.loginError.set('');
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.isSubmitting.set(true);

    this.authService.login(username, password)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/inicio');
        },
        error: (error: unknown) => {
          this.loginError.set(this.resolveErrorMessage(error));
        }
      });
  }

  private resolveErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null) {
      const maybeError = error as { status?: number; error?: unknown };

      if (maybeError.status === 0) {
        return 'No fue posible conectar con el backend en http://localhost:8082.';
      }

      if (maybeError.status === 401 || maybeError.status === 403) {
        return 'Credenciales invalidas.';
      }

      if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
        return maybeError.error;
      }

      if (typeof maybeError.error === 'object' && maybeError.error !== null) {
        const apiError = maybeError.error as Record<string, unknown>;
        const candidates = ['message', 'error', 'detail'];

        for (const key of candidates) {
          const value = apiError[key];
          if (typeof value === 'string' && value.trim()) {
            return value;
          }
        }
      }
    }

    return 'No se pudo iniciar sesion con el backend.';
  }
}
