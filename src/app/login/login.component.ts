import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentifications/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  forme: any;
  submitted: boolean | undefined;

  constructor(private authService: AuthentificationService, private formBuilder: FormBuilder, private router: Router){
    this.forme = this.formBuilder.group({
      mail: [
        '',
        [
          Validators.required,
        ],
      ],
      pwd: [
        '',
        [
          Validators.required,
        ],
      ]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  get f() {
    return this.forme.controls;
  }

  login() {
    this.submitted = true;
    if (this.forme.invalid) return;
    if (this.authService.login(this.forme)) {
      this.router.navigate(['/']);
    } else {
      // Affichez un message d'erreur
      alert('Invalid credentials');
    }
  }

}
