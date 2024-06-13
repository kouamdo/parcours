// request-password-reset.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from '../services/authentifications/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html'
})
export class RequestPasswordResetComponent {
  requestForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthentificationService, private router: Router) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.requestForm.controls;
  }

  requestReset() {
    if (this.requestForm.valid) {
      this.authService.requestPasswordReset(this.requestForm.value.email).subscribe(
        response => {
          console.log('Email de réinitialisation envoyé', response);
          this.router.navigate(['/resetPassword']);
        },
        error => {
          console.error('Erreur lors de l\'envoi de l\'email de réinitialisation', error);
        }
      );
    }
  }
}
