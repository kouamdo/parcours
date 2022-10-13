import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import defaultLanguage from './../assets/i18n/en.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 
export class AppComponent {
  title = 'Parcours client - clinique de ...';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
