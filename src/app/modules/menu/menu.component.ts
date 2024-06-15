import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { EMPTY, Observable, UnaryFunction } from 'rxjs';
import { IFonctionnalites } from '../../modele/fonctionnalites';
import { IMenus } from '../../modele/menus';
import { MenusService } from '../../services/menus/menus.service';
import { DonneesEchangeService } from '../../services/donnees-echange/donnees-echange.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnChanges {
  menuUser$:Observable<IMenus>=EMPTY;
  fonctionnalites!: IFonctionnalites[];
  @Input()
  langueParent :string = 'fr';
  userId !:any;
  constructor(private menuService:MenusService,private dataEnteteMenuService:DonneesEchangeService ) { }

  ngOnInit(): void {
    if(localStorage.getItem("userId")!=null){
      this.userId = localStorage.getItem("userId");
    }else{
      this.userId = "phil";
    }
    this.menuUser$ = this.getMenus();
    this.menuUser$.subscribe(x=>{
      console.log("x donnee:", x);
      
      if(x!=null && x.fonctionnalites!=null){
        this.fonctionnalites = x.fonctionnalites;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['langueParent'] && changes['langueParent'].currentValue){
      this.menuUser$ = this.getMenus();
      this.menuUser$.subscribe(x=>{
        if(x!=null  && x.fonctionnalites!=null){
          this.fonctionnalites = x.fonctionnalites;
        }

      })
    }

  }

  private getMenus(){
    return  this.menuService.getMenuByUserAndLangue(this.userId,this.langueParent);
  }

  getElementMenu(titre:string){
    this.dataEnteteMenuService.dataEnteteMenu=titre
  }

  setUrlSource(urlSource:string){
    this.dataEnteteMenuService.setUrlSource(urlSource)
  }
}
