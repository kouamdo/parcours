import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import { AuthentificationService } from '../services/authentifications/authentification.service';
import { Router } from '@angular/router';
import { IPersonnel } from '../modele/personnel';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent {
  title = 'Parcours client - clinique de ...';
  langues : string[] = ['fr','en','sp','de'];
  langueChoisi: string = 'fr';
  user!: IPersonnel;
  groupe: string = "Simple";
  flags = [
    { flag: 'assets/images/flags/fr.svg'},
    { flag: 'assets/images/flags/us.svg'},
    { flag: 'assets/images/flags/spain.svg'},
    { flag: 'assets/images/flags/germany.svg'},
  ];

  constructor(private translate: TranslateService, public authService: AuthentificationService, private overlay: OverlayContainer, private router: Router) {
    translate.addLangs(this.langues);
    translate.setDefaultLang('fr'); 
    translate.use('fr');
  }
  
  ngOnInit(): void {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    localStorage.setItem('langue', this.langueChoisi);
    this.user = this.authService.currentUserValue.user
    this.groupe = this.authService.currentUserValue.groupe.libelle

    console.log("user connect :", this.authService.currentUser);
    
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.langueChoisi = language;   
    localStorage.setItem('langue', this.langueChoisi);
  }

  valeurChange(event:any):void{
    this.useLanguage(event.target.value);
  }

  toggle:boolean = true;

  change(){
    this.toggle = !this.toggle;
  }
}
