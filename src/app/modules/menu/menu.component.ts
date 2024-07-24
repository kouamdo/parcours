import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { IFonctionnalites } from '../../modele/fonctionnalites';
import { IMenu } from '../../modele/menu';
import { MenusService } from '../../services/menus/menus.service';
import { DonneesEchangeService } from '../../services/donnees-echange/donnees-echange.service';
import { AuthentificationService } from 'src/app/services/authentifications/authentification.service';
import { PassActionService } from 'src/app/services/actions-view/pass-action.service';
import { IElements } from 'src/app/modele/elements';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnChanges {
  menuUser$:Observable<IMenu>=EMPTY;
  fonctionnalites!: IFonctionnalites[];
  @Input()
  langueParent :string = 'fr';
  userId !:any;
  constructor(private menuService:MenusService,private dataEnteteMenuService:DonneesEchangeService, private authService: AuthentificationService, private actionView: PassActionService, private route: ActivatedRoute ) { }

  ngOnInit(): void {
    if(localStorage.getItem("currentUser")!=null){
      this.userId = JSON.parse(localStorage.getItem("currentUser")!);
    }else{
      this.userId = "phil";
    }
    this.menuUser$ = this.getMenus();
    this.langueParent = localStorage.getItem('langue')!;
    this.actionView.updateLangueData(this.langueParent);
    this.menuUser$.subscribe(x=>{
      console.log("x donnee:", x);
      
      if(x!=null && x.fonctionnalites!=null){
        this.fonctionnalites = x.fonctionnalites;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['langueParent'] && changes['langueParent'].currentValue) {
      this.menuUser$ = this.getMenus();
      this.menuUser$.subscribe(x=>{
        if(x!=null && x.fonctionnalites!=null){
          this.fonctionnalites = x.fonctionnalites;
          let act : IElements | undefined;
          x.fonctionnalites.find((m) => act = m.elements.find((l) => l.lien == localStorage.getItem('lien')));
          this.sendAction(act?.action!, act?.lien!);
          localStorage.setItem('langue', this.langueParent); 
          this.actionView.updateLangueData(this.langueParent);
        }
      })
    }
  }

  private getMenus(){
   // return this.menuService.getMenuByUserAndLangue(this.userId,this.langueParent);
    return this.menuService.getMenuByUserAndLangue(this.authService.currentUserValue.login,this.langueParent);
  }

  sendAction(actions: IElements[], lien: string) {
    localStorage.setItem('lien', lien);
    this.actionView.setActions(actions);
  }

  getElementMenu(titre: string) {
    this.dataEnteteMenuService.dataEnteteMenu = titre; // This will automatically save to sessionStorage
  }

  setUrlSource(urlSource: string) {
    this.dataEnteteMenuService.setUrlSource(urlSource);
  }
}
