import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentifications/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  returnUrl: string | undefined;
  error: string | undefined;
  forme: FormGroup;
  submitted: boolean | undefined;

  constructor(private authService: AuthentificationService, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, private router: Router, private route: ActivatedRoute){
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
    // rediriger vers la page d'accueil si déjà connecté
    if (this.authService.currentUserValue) {
      this.router.navigate(['/parcours']);
    }
  }
  ngOnInit() {
    // obtenir l'URL de retour ou rediriger vers l'accueil
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/parcours';
  }

  get f() {
    return this.forme.controls;
  }

  login() {
    this.submitted = true;
    if (this.forme.invalid) return;
    
    console.log(this.forme.value);
    
    this.authService.login(this.forme.value.mail, this.forme.value.pwd)
    .subscribe(
        res => {
          console.log("response :", res);
          
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          console.log("error :", error);
          
        });
  }

}
