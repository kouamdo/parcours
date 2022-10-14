import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 
export class AppComponent {
  title = 'Parcours client - clinique de ...';
  langues : string[] = ['en','fr','sp','de'];

  constructor(private translate: TranslateService) {
    translate.addLangs(this.langues);
    translate.setDefaultLang('en');
    translate.use('en');
  }
  useLanguage(language: string): void {
    this.translate.use(language);
  }

  valeurChange(event:any):void{
    this.useLanguage(event.target.value);
  }
}
