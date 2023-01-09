import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {OverlayContainer, OverlayModule} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
}) 
export class AppComponent {
  title = 'Parcours client - clinique de ...';
  langues : string[] = ['fr','en','sp','de'];
  langueChoisi: string = 'fr';
  flags = [
    { flag: 'assets/images/flags/fr.svg'},
    { flag: 'assets/images/flags/us.svg'},
    { flag: 'assets/images/flags/spain.svg'},
    { flag: 'assets/images/flags/germany.svg'},
  ];

  constructor(private translate: TranslateService, private overlay: OverlayContainer) {
    translate.addLangs(this.langues);
    translate.setDefaultLang('fr'); 
    translate.use('fr');
  }
  
  ngOnInit(): void {
    
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
