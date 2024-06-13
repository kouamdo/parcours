// reset-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../services/authentifications/authentification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthentificationService
  ) {
    this.token = this.route.snapshot.queryParams['token'];
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  get f() {
    return this.resetForm.controls;
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  resetPassword() {
    if (this.resetForm.valid) {
      this.authService.resetPassword(this.token, this.resetForm.value.password).subscribe(
        response => {
          console.log('Mot de passe réinitialisé', response);
        },
        error => {
          console.error('Erreur lors de la réinitialisation du mot de passe', error);
        }
      );
    }
  }
}
