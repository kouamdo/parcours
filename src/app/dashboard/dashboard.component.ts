import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import { AuthentificationService } from '../services/authentifications/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Parcours client - clinique de ...';
  langues : string[] = ['fr','en','sp','de'];
  langueChoisi: string = 'fr';
  flags = [
    { flag: 'assets/images/flags/fr.svg'},
    { flag: 'assets/images/flags/us.svg'},
    { flag: 'assets/images/flags/spain.svg'},
    { flag: 'assets/images/flags/germany.svg'},
  ];

  constructor(private translate: TranslateService, private authService: AuthentificationService, private overlay: OverlayContainer, private router: Router) {
    translate.addLangs(this.langues);
    translate.setDefaultLang('fr'); 
    translate.use('fr');
  }
  
  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.langueChoisi = language;    
  }

  valeurChange(event:any):void{
    this.useLanguage(event.target.value);
  }

  toggle:boolean = true;

  change(){
    this.toggle = !this.toggle;
  }
}
